import {
  chercherEvenements,
  chercherProjets,
  evenementsEnCours,
  motsCles,
  normaliser,
  prochainsEvenements,
  rechercheLibre,
  trouverLieu,
} from './outils';
import type { FiltreEvenements } from './outils';
import {
  categories,
  compareEvenements,
  evenements,
  festival,
  filieres,
  heure,
  jourLabel,
  lieuParId,
  projets,
} from '../data/festival';
import type {
  Categorie,
  Evenement,
  JourDate,
  Lieu,
  Projet,
} from '../data/festival';

export type Carte =
  | { type: 'evenement'; evenement: Evenement }
  | { type: 'projet'; projet: Projet }
  | { type: 'lieu'; lieu: Lieu };

export type Reponse = {
  texte: string;
  cartes: Carte[];
  suggestions: string[];
};

export type Contexte = {
  maintenant: Date;
  favoris: Set<string>;
};

export const SUGGESTIONS_ACCUEIL = [
  'Qu’est-ce qui se passe maintenant ?',
  'Quels concerts ce soir ?',
  'Où manger ?',
  'Des projets de photographie ?',
];

const MAX_CARTES = 6;

const MOTS_CATEGORIES: Record<Categorie, string[]> = {
  Conférence: ['conference', 'conferences', 'conf', 'table ronde', 'rencontre', 'rencontres', 'debat'],
  Atelier: ['atelier', 'workshop', 'participatif', 'enfant', 'enfants', 'famille'],
  Exposition: ['expo', 'exposition', 'expositions', 'jeux video'],
  Concert: ['concert', 'concerts', 'musique', 'dj', 'danser', 'son live'],
  Projection: ['projection', 'projections', 'film', 'films', 'cinema', 'court metrage', 'courts metrages'],
  Performance: ['performance', 'performances', 'spectacle', 'poesie'],
};

const MOTS_CATEGORIES_TOUS = new Set(Object.values(MOTS_CATEGORIES).flat());

const contient = (q: string, motifs: string[]) => motifs.some((m) => new RegExp(`\\b${m}\\b`).test(q));

function heureEnMinutes(q: string): { minutes: number; reste: string } | undefined {
  const m = q.match(/\b(\d{1,2})\s*(?:h|:|heures?)\s*(\d{2})?\b/);
  if (!m) return undefined;
  const h = Number(m[1]);
  if (h > 23) return undefined;
  return { minutes: h * 60 + Number(m[2] ?? 0), reste: q.replace(m[0], ' ') };
}

function lireMoment(q: string): { intervalle: [number, number]; nom: string } | undefined {
  if (/\bsoir|soiree|nuit\b/.test(q)) return { intervalle: [18 * 60, 24 * 60], nom: 'en soirée' };
  if (/\bapres midi\b|\baprem\b/.test(q)) return { intervalle: [12 * 60, 18 * 60], nom: 'l’après-midi' };
  if (/\bmatin|matinee\b/.test(q)) return { intervalle: [0, 12 * 60], nom: 'ce matin' };
  if (/\bmidi\b/.test(q)) return { intervalle: [11 * 60 + 30, 14 * 60], nom: 'vers midi' };
  return undefined;
}

const versCartes = (liste: Evenement[]): Carte[] =>
  liste.slice(0, MAX_CARTES).map((evenement) => ({ type: 'evenement', evenement }));

const enHeure = (minutes: number) => heure(`${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`);

const pluriel = (n: number, mot: string) => `${n} ${mot}${n > 1 ? 's' : ''}`;

function plusQue(total: number) {
  return total > MAX_CARTES ? ` Voici les ${MAX_CARTES} premiers ; le reste est dans l’onglet Programme.` : '';
}

function decrireEvenement(e: Evenement) {
  const lieu = lieuParId(e.lieuId);
  return `« ${e.titre} » : de ${heure(e.debut)} à ${heure(e.fin)}${lieu ? `, ${lieu.nom} (repère ${lieu.numero})` : ''}.`;
}

export function repondre(question: string, { maintenant, favoris }: Contexte): Reponse {
  const q = normaliser(question);
  const dateFest = festival.jours[0].date;
  const debutFestival = new Date(`${dateFest}T00:00:00`);
  const finFestival = new Date(`${dateFest}T23:59:59`);
  const avantFestival = maintenant < debutFestival;

  if (!q) return aide();

  if (/^(bonjour|bonsoir|salut|coucou|hello|ahoy|hey)\b/.test(q) && q.split(' ').length <= 3) {
    return {
      texte: 'Bien le bonjour, moussaillon ! Je tiens la barre du festival pour la journée du 8 avril 2027 : demandez-moi le programme, un lieu ou les travaux des élèves.',
      cartes: [],
      suggestions: SUGGESTIONS_ACCUEIL,
    };
  }
  if (/\b(aide|help|que sais tu|tu sais faire|qui es tu|comment ca marche)\b/.test(q)) return aide();
  if (/\bmerci\b/.test(q)) {
    return { texte: 'À votre service. Bon vent sur le campus !', cartes: [], suggestions: SUGGESTIONS_ACCUEIL };
  }

  if (/\b(toilettes?|wc|sanitaires?|parking|garer|vestiaires?|secours|pharmacie|wifi|prise|recharger|accessibilite|pmr|ascenseur)\b/.test(q)) {
    const accueil = lieuParId('accueil');
    return {
      texte: `Mon livre de bord ne dit rien là-dessus, et je préfère ne pas vous égarer. ${accueil ? `Le ${accueil.nom} (repère ${accueil.numero}) saura vous renseigner.` : 'L’équipe d’accueil saura vous renseigner.'}`,
      cartes: accueil ? [{ type: 'lieu', lieu: accueil }] : [],
      suggestions: ['Où manger ?', 'Qu’est-ce qui se passe maintenant ?'],
    };
  }

  if (/\b(parcours|favori|favoris|etoile|etoiles|mes evenements)\b/.test(q)) {
    const liste = evenements.filter((e) => favoris.has(e.id)).sort(compareEvenements);
    if (!liste.length) {
      return {
        texte: 'Votre parcours est encore vierge. Touchez ☆ à côté d’un évènement pour l’y consigner.',
        cartes: versCartes(evenements.filter((e) => e.phare).sort(compareEvenements)),
        suggestions: ['Les temps forts ?', 'Quels concerts ce soir ?'],
      };
    }
    const prochains = liste.filter((e) => new Date(`${e.jour}T${e.fin}:00`) > maintenant);
    return {
      texte: `Votre parcours compte ${pluriel(liste.length, 'escale')}${prochains.length < liste.length ? `, dont ${prochains.length} encore à venir` : ''}.`,
      cartes: versCartes(prochains.length ? prochains : liste),
      suggestions: ['Qu’est-ce qui se passe maintenant ?', 'Où est la Nef ?'],
    };
  }

  const lieu = trouverLieu(q);
  const demandeOu = /\b(ou|trouver|aller|chemin|plan|situe|se trouve)\b/.test(q);
  const veutProjets = /\b(projet|projets|travaux|travail|eleve|eleves|oeuvre|oeuvres|creation|creations|filiere|filieres)\b/.test(q);

  if (lieu && demandeOu && !veutProjets) {
    const aVenir = chercherEvenements({ lieuId: lieu.id }).filter((e) => new Date(`${e.jour}T${e.fin}:00`) > maintenant);
    return {
      texte: `${lieu.nom}, repère n° ${lieu.numero} sur le plan. ${lieu.description}`,
      cartes: [{ type: 'lieu', lieu }, ...versCartes(aVenir).slice(0, 3)],
      suggestions: [`Que se passe-t-il au repère ${lieu.numero} ?`, 'Où manger ?'],
    };
  }

  const demandeMaintenant = /\b(maintenant|en ce moment|actuellement|en cours|tout de suite)\b/.test(q);
  const demandeEnsuite = /\b(ensuite|prochain|prochains|prochaine|prochaines|apres|bientot|suivant|suite|a venir)\b/.test(q);
  if (demandeMaintenant || (demandeEnsuite && !/\bapres midi\b/.test(q))) {
    const enCours = evenementsEnCours(maintenant);
    const prochains = prochainsEvenements(maintenant);
    if (avantFestival) {
      const jours = Math.ceil((debutFestival.getTime() - maintenant.getTime()) / 86_400_000);
      return {
        texte: `Le festival ouvrira le jeudi 8 avril 2027 (dans ${jours} jours). Voici les premières escales de la journée :`,
        cartes: versCartes(prochains),
        suggestions: ['Les temps forts ?', 'Quels ateliers l’après-midi ?'],
      };
    }
    if (demandeMaintenant && enCours.length) {
      return {
        texte: `En ce moment, ${pluriel(enCours.length, 'évènement')} sur le campus.`,
        cartes: versCartes(enCours),
        suggestions: ['Et ensuite ?', 'Où manger ?'],
      };
    }
    if (maintenant > finFestival) {
      return {
        texte: 'Rideau ! La journée du festival est terminée, mais les travaux des élèves restent à découvrir.',
        cartes: [],
        suggestions: ['Montre-moi les travaux', 'Des projets de photographie ?'],
      };
    }
    return {
      texte: demandeMaintenant ? 'Entracte : rien en cours à cet instant. Voici la suite.' : 'Voici les prochaines escales de la journée :',
      cartes: versCartes(prochains),
      suggestions: ['Quoi ce soir ?', 'Mon parcours'],
    };
  }

  if (/\b(temps forts?|incontournable|incontournables|a ne pas manquer|phare|phares|meilleur|meilleurs|conseille|conseilles|recommande)\b/.test(q) && !veutProjets) {
    return {
      texte: 'Les escales incontournables du 8 avril, marquées ✦ dans le programme :',
      cartes: versCartes(evenements.filter((e) => e.phare).sort(compareEvenements)),
      suggestions: ['Quoi ce soir ?', 'Où est le Grand Amphithéâtre ?'],
    };
  }

  const heureDemandee = heureEnMinutes(q);
  const sansHeure = heureDemandee?.reste ?? q;
  const moment = lireMoment(sansHeure);
  const cats = categories.filter((c) => contient(sansHeure, MOTS_CATEGORIES[c]));

  const motsQuestion = q.split(' ');
  const filieresVisees = filieres.filter((f) => {
    const nom = normaliser(f);
    if (q.includes(nom)) return true;
    return (
      (veutProjets || !cats.length) &&
      nom.split(' ').some((mot) => mot.length >= 5 && motsQuestion.some((m) => m.startsWith(mot.slice(0, 5))))
    );
  });
  if (veutProjets || filieresVisees.length) {
    const liste = chercherProjets(q, filieresVisees);
    if (liste.length) {
      return {
        texte: filieresVisees.length
          ? `En ${filieresVisees.join(' et en ')}, ${pluriel(liste.length, 'projet')} présenté${liste.length > 1 ? 's' : ''} :`
          : `J’ai repéré ${pluriel(liste.length, 'projet')} qui pourrai${liste.length > 1 ? 'ent' : 't'} vous plaire :`,
        cartes: liste.slice(0, MAX_CARTES).map((projet) => ({ type: 'projet', projet })),
        suggestions: ['Où est la Nef ?', 'Une visite guidée ?'],
      };
    }
    if (veutProjets && !lieu) {
      return {
        texte: `Le cabinet des élèves réunit des projets en ${filieres.join(', ')}. Voici un premier aperçu :`,
        cartes: projets.slice(0, MAX_CARTES).map((projet) => ({ type: 'projet', projet })),
        suggestions: filieres.slice(0, 3).map((f) => `Des projets en ${f} ?`),
      };
    }
  }

  if (!moment && !heureDemandee && !lieu) {
    const mots = motsCles(q).filter((m) => !MOTS_CATEGORIES_TOUS.has(m));
    const motsDuTitre = (titre: string) => {
      const t = normaliser(titre).split(' ');
      return mots.filter((m) => t.some((w) => w === m || (m.length >= 5 && w.startsWith(m.slice(0, 5))))).length;
    };
    const meilleurEvenement = Math.max(0, ...evenements.map((e) => motsDuTitre(e.titre)));
    const meilleurProjet = Math.max(0, ...projets.map((p) => motsDuTitre(p.titre)));
    const parTitre =
      meilleurEvenement > 0 && meilleurEvenement >= meilleurProjet
        ? evenements.filter((e) => motsDuTitre(e.titre) === meilleurEvenement).sort(compareEvenements)
        : [];
    if (parTitre.length) {
      return {
        texte: parTitre.length === 1 ? decrireEvenement(parTitre[0]) : 'Plusieurs escales répondent à ce nom :',
        cartes: versCartes(parTitre),
        suggestions: ['Et ensuite ?', 'Mon parcours'],
      };
    }
  }

  if (moment || heureDemandee || cats.length || lieu) {
    const filtre: FiltreEvenements = {
      jours: [dateFest],
      categories: cats,
      lieuId: lieu?.id,
      debutEntre: moment?.intervalle,
      enCoursA: heureDemandee?.minutes,
    };
    const morceaux = [
      cats.length ? cats.map((c) => c.toLowerCase()).join(' ou ') : null,
      moment?.nom,
      heureDemandee ? `à ${enHeure(heureDemandee.minutes)}` : null,
      lieu ? lieu.nom : null,
    ].filter(Boolean);

    const relachements: [FiltreEvenements | null, string][] = [
      [filtre, ''],
      [
        heureDemandee ? { ...filtre, enCoursA: undefined, debutEntre: [heureDemandee.minutes, 24 * 60] } : null,
        'rien n’est en cours à cette heure-là ; voici ce qui commence ensuite.',
      ],
      [
        moment || heureDemandee ? { ...filtre, debutEntre: undefined, enCoursA: undefined } : null,
        'rien à ce moment-là ; voici le reste de la journée.',
      ],
    ];
    for (const [variante, precision] of relachements) {
      if (!variante) continue;
      const liste = chercherEvenements(variante);
      if (!liste.length) continue;
      return {
        texte:
          (precision
            ? `Pour « ${morceaux.join(', ')} », ${precision}`
            : `${liste.length === 1 ? 'Une escale' : pluriel(liste.length, 'escale')} — ${morceaux.join(', ')}.`) +
          plusQue(liste.length),
        cartes: [...(lieu && demandeOu ? [{ type: 'lieu' as const, lieu }] : []), ...versCartes(liste)],
        suggestions: ['Quoi ce soir ?', 'Où manger ?'],
      };
    }
    return {
      texte: `Je ne trouve rien pour : ${morceaux.join(', ')}. Essayez un autre créneau ou une autre catégorie.`,
      cartes: lieu ? [{ type: 'lieu', lieu }] : [],
      suggestions: ['Les temps forts ?', 'Qu’est-ce qui se passe maintenant ?'],
    };
  }

  const resultats = rechercheLibre(q);
  if (resultats.length) {
    const meilleurs = resultats.filter((r) => r.score >= resultats[0].score / 2).slice(0, MAX_CARTES);
    const premier = meilleurs[0];
    const texte =
      premier.type === 'evenement' && meilleurs.length === 1
        ? decrireEvenement(premier.evenement)
        : premier.type === 'lieu' && meilleurs.length === 1
          ? `${premier.lieu.nom}, repère n° ${premier.lieu.numero}. ${premier.lieu.description}`
          : 'Voici ce que j’ai trouvé dans le livre de bord :';
    return {
      texte,
      cartes: meilleurs.map((r): Carte =>
        r.type === 'evenement'
          ? { type: 'evenement', evenement: r.evenement }
          : r.type === 'projet'
            ? { type: 'projet', projet: r.projet }
            : { type: 'lieu', lieu: r.lieu }
      ),
      suggestions: ['Qu’est-ce qui se passe maintenant ?', 'Les temps forts ?'],
    };
  }

  return {
    texte: 'Mille sabords, je n’ai rien trouvé à ce sujet. Je connais le programme du 8 avril, les lieux du campus et les travaux des élèves : essayez l’une de ces questions.',
    cartes: [],
    suggestions: SUGGESTIONS_ACCUEIL,
  };
}

function aide(): Reponse {
  return {
    texte:
      'Je suis le Timonier, le guide du festival. Je réponds hors connexion pour la journée du jeudi 8 avril 2027. Demandez-moi par exemple ce qui se passe à 14h, où se trouve un lieu, ou quels travaux d’élèves voir en photographie.',
    cartes: [],
    suggestions: SUGGESTIONS_ACCUEIL,
  };
}