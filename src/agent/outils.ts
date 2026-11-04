import {
  categories,
  compareEvenements,
  debutDate,
  evenements,
  festival,
  finDate,
  lieux,
  projets,
} from '../data/festival';
import type {
  Categorie,
  Evenement,
  JourDate,
  Lieu,
  Projet,
} from '../data/festival';

export function normaliser(texte: string) {
  return texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9:&\s]/g, ' ')
    .replace(/\bintelligences? artificielles?\b/g, 'ia')
    .replace(/\s+/g, ' ')
    .trim();
}

const MOTS_VIDES = new Set(
  (
    'les des une est que qui quoi quel quelle quels quelles pour sur dans avec ces cet cette mon mes ' +
    'ton tes son ses nous vous ils elles peut peux faire voir aller trouve trouver lieu lieux heure ' +
    'festival programme quand comment ici bien tout tous toute toutes pas plus moins aussi alors donc ' +
    'chez par entre vers avoir etre sont sera ont eux elle lui leur leurs moi toi suis cherche veux ' +
    'voudrais aimerais dire montre montrer savoir connaitre parle parler propose proposes passe'
  ).split(' ')
);

export function motsCles(texte: string) {
  return normaliser(texte)
    .split(' ')
    .filter((m) => (m.length >= 3 || m === 'ia') && !MOTS_VIDES.has(m));
}

function score(mots: string[], ...champs: (string | undefined)[]) {
  const texte = normaliser(champs.filter(Boolean).join(' '));
  const vocabulaire = texte.split(' ');
  return mots.reduce((total, mot) => {
    if (mot.length < 4) return vocabulaire.includes(mot) ? total + 1 : total;
    if (texte.includes(mot)) return total + (mot.length >= 5 ? 2 : 1);
    const racine = mot.slice(0, 5);
    return mot.length >= 5 && vocabulaire.some((v) => v.startsWith(racine)) ? total + 1 : total;
  }, 0);
}

export type FiltreEvenements = {
  jours?: JourDate[];
  categories?: Categorie[];
  lieuId?: string;
  debutEntre?: [number, number];
  enCoursA?: number;
};

const minutes = (h: string) => {
  const [hh, mm] = h.split(':').map(Number);
  return hh * 60 + mm;
};

export function chercherEvenements(filtre: FiltreEvenements): Evenement[] {
  return evenements
    .filter((e) => !filtre.jours?.length || filtre.jours.includes(e.jour))
    .filter((e) => !filtre.categories?.length || filtre.categories.includes(e.categorie))
    .filter((e) => !filtre.lieuId || e.lieuId === filtre.lieuId)
    .filter((e) => {
      if (!filtre.debutEntre) return true;
      const d = minutes(e.debut);
      return d >= filtre.debutEntre[0] && d < filtre.debutEntre[1];
    })
    .filter((e) => filtre.enCoursA === undefined || (minutes(e.debut) <= filtre.enCoursA && filtre.enCoursA < minutes(e.fin)))
    .sort(compareEvenements);
}

export function evenementsEnCours(maintenant: Date) {
  return evenements.filter((e) => debutDate(e) <= maintenant && maintenant < finDate(e)).sort(compareEvenements);
}

export function prochainsEvenements(maintenant: Date, nombre = 4) {
  return evenements
    .filter((e) => debutDate(e) > maintenant)
    .sort(compareEvenements)
    .slice(0, nombre);
}

export function chercherProjets(question: string, filieres: string[] = []): Projet[] {
  const mots = motsCles(question);
  return projets
    .filter((p) => !filieres.length || filieres.includes(p.filiere))
    .map((p) => ({ p, s: score(mots, p.titre, p.resume, p.description, p.filiere, p.eleves.join(' '), p.techniques.join(' ')) }))
    .filter(({ s }) => filieres.length || s > 0)
    .sort((a, b) => b.s - a.s)
    .map(({ p }) => p);
}

const ALIAS_LIEUX: Record<string, string[]> = {
  amphi: ['amphi', 'amphitheatre'],
  studio: ['studio', 'son et image', 'son & image', 'immersive'],
  nef: ['nef', 'galerie'],
  ateliers: ['fablab', 'fabrication', 'laser', 'imprimante'],
  cour: ['cour', 'honneur', 'plein air', 'scene exterieure', 'dehors', 'scene'],
  bibliotheque: ['bibliotheque', 'salle des cartes', 'curiosites', 'livre'],
  jardin: ['jardin', 'bassin', 'theatre jardin', 'theatre'],
  refectoire: ['refectoire', 'manger', 'mange', 'repas', 'buvette', 'restauration', 'dejeuner', 'diner', 'faim', 'soif', 'boire', 'cafe', 'sandwich'],
  accueil: ['accueil', 'billetterie', 'billet', 'objet trouve', 'objets trouves', 'perdu', 'renseignement', 'information', 'infos', 'entree', 'porte'],
};

export function trouverLieu(question: string): Lieu | undefined {
  const q = ` ${normaliser(question)} `;
  const numero = q.match(/\b(?:lieu|repere|batiment|numero|n)\s*(\d)\b/);
  if (numero) return lieux.find((l) => l.numero === Number(numero[1]));
  return lieux.find((l) => ALIAS_LIEUX[l.id]?.some((alias) => q.includes(` ${alias}`)));
}

export type Resultat =
  | { type: 'evenement'; evenement: Evenement; score: number }
  | { type: 'projet'; projet: Projet; score: number }
  | { type: 'lieu'; lieu: Lieu; score: number };

export function rechercheLibre(question: string): Resultat[] {
  const mots = motsCles(question);
  if (!mots.length) return [];
  const resultats: Resultat[] = [
    ...evenements.map((e) => ({
      type: 'evenement' as const,
      evenement: e,
      score: score(mots, e.titre, e.titre, e.description, e.intervenants, e.categorie),
    })),
    ...projets.map((p) => ({
      type: 'projet' as const,
      projet: p,
      score: score(mots, p.titre, p.titre, p.resume, p.filiere, p.eleves.join(' '), p.techniques.join(' ')),
    })),
    ...lieux.map((l) => ({ type: 'lieu' as const, lieu: l, score: score(mots, l.nom, l.nom, l.description) })),
  ];
  return resultats.filter((r) => r.score > 0).sort((a, b) => b.score - a.score);
}