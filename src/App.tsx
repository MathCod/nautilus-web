import { useState, useEffect } from 'react';
import { Home, Calendar, MapPin, Compass, FolderGit2 } from 'lucide-react';
import type { Evenement, Projet } from './data/festival';
import {
  festival,
  evenements,
  compareEvenements,
  debutDate,
  finDate,
  lieux,
  projets,
} from './data/festival';
import { useFavorites } from './hooks/useFavorites';
import { Plate, Ornament, SectionTitle } from './components/Paper';
import { EventRow } from './components/EventRow';
import { Programme } from './components/Programme';
import { EventModal } from './components/EventModal';
import { Travaux } from './components/Travaux';
import { ProjectModal } from './components/ProjectModal';
import { Plan } from './components/Plan';
import { Timonier } from './components/Timonier';

function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'accueil' | 'programme' | 'plan' | 'travaux' | 'timonier'>('accueil');
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null);
  const [selectedProject, setSelectedProject] = useState<Projet | null>(null);

  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const now = useNow();

  // Logique d'accueil
  const tries = [...evenements].sort(compareEvenements);
  const premier = festival.jours[0].date;
  const dernier = festival.jours[festival.jours.length - 1].date;
  const debutFestival = new Date(`${premier}T00:00:00`);
  const finFestival = new Date(`${dernier}T23:59:59`);

  const enCours = tries.filter((e) => debutDate(e) <= now && now < finDate(e));
  const aSuivre = tries.filter((e) => debutDate(e) > now).slice(0, 3);
  const phares = tries.filter((e) => e.phare);

  let statut: { titre: string; texte: string };
  if (now < debutFestival) {
    const jours = Math.ceil((debutFestival.getTime() - now.getTime()) / 86_400_000);
    statut = {
      titre: jours <= 1 ? 'Ouverture demain' : `Ouverture dans ${jours} jours`,
      texte: 'Préparez votre parcours : touchez ☆ pour garder un évènement en mémoire.',
    };
  } else if (now <= finFestival) {
    statut = {
      titre: 'Le festival bat son plein',
      texte: enCours.length ? 'Voici ce qui se passe en ce moment sur le campus.' : 'Entracte : voici la suite du programme.',
    };
  } else {
    statut = {
      titre: 'Rideau !',
      texte: 'Merci pour votre visite. Les travaux des élèves restent consultables ici.',
    };
  }

  const allerAuLieuSurPlan = () => {
    setActiveTab('plan');
  };

  return (
    <div id="app-container">
      {/* Contenu principal */}
      <main style={{ flex: 1, padding: '20px 16px 90px 16px', overflowY: 'auto' }}>

        {/* 1. ACCUEIL */}
        {activeTab === 'accueil' && (
          <div>
            <div style={{ textAlign: 'center', margin: '20px 0 10px 0' }}>
              <div style={{ fontSize: '48px', color: 'var(--color-accent)', marginBottom: '8px' }}>⚓</div>
              <div style={{ fontFamily: 'var(--font-sc)', fontSize: '14px', color: 'var(--color-accent)', letterSpacing: '1px' }}>
                Festival · {festival.edition}
              </div>
              <h1 style={{ fontFamily: 'var(--font-sc)', fontSize: '44px', lineHeight: 1.1, letterSpacing: '2px', margin: '6px 0' }}>
                {festival.nom}
              </h1>
              <div style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '17px', marginBottom: '8px' }}>
                {festival.sousTitre}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600 }}>
                19 · 20 · 21 novembre 2026
              </div>
              <div style={{ fontSize: '15px', color: 'var(--color-text-muted)' }}>
                {festival.lieu}
              </div>
              <Ornament />
            </div>

            <Plate>
              <div style={{ fontFamily: 'var(--font-sc)', fontSize: '13px', color: 'var(--color-accent)', letterSpacing: '0.5px' }}>
                Dépêche du jour
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 'bold', margin: '4px 0' }}>
                {statut.titre}
              </div>
              <div style={{ fontSize: '15px', color: 'var(--color-text)' }}>
                {statut.texte}
              </div>
            </Plate>

            {enCours.length > 0 && (
              <section>
                <SectionTitle>En ce moment</SectionTitle>
                {enCours.map((e) => (
                  <EventRow
                    key={e.id}
                    evenement={e}
                    isFav={isFavorite(e.id)}
                    onToggleFav={() => toggleFavorite(e.id)}
                    onClick={() => setSelectedEvent(e)}
                  />
                ))}
              </section>
            )}

            {aSuivre.length > 0 && (
              <section>
                <SectionTitle>À suivre</SectionTitle>
                {aSuivre.map((e) => (
                  <EventRow
                    key={e.id}
                    evenement={e}
                    showDay
                    isFav={isFavorite(e.id)}
                    onToggleFav={() => toggleFavorite(e.id)}
                    onClick={() => setSelectedEvent(e)}
                  />
                ))}
              </section>
            )}

            <section>
              <SectionTitle>À ne pas manquer ✦</SectionTitle>
              {phares.map((e) => (
                <EventRow
                  key={e.id}
                  evenement={e}
                  showDay
                  isFav={isFavorite(e.id)}
                  onToggleFav={() => toggleFavorite(e.id)}
                  onClick={() => setSelectedEvent(e)}
                />
              ))}
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '20px 0' }}>
              <div
                onClick={() => setActiveTab('plan')}
                style={{
                  border: '1.5px solid var(--color-text)',
                  backgroundColor: 'var(--color-card)',
                  padding: '16px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '26px', color: 'var(--color-accent)' }}>⌖</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold' }}>Plan du campus</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{lieux.length} lieux</div>
              </div>

              <div
                onClick={() => setActiveTab('travaux')}
                style={{
                  border: '1.5px solid var(--color-text)',
                  backgroundColor: 'var(--color-card)',
                  padding: '16px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '26px', color: 'var(--color-accent)' }}>❦</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold' }}>Travaux d'élèves</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{projets.length} projets</div>
              </div>
            </div>

            <Plate onClick={() => setActiveTab('timonier')}>
              <div style={{ fontFamily: 'var(--font-sc)', fontSize: '13px', color: 'var(--color-accent)' }}>
                Agent du festival ⚓
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 'bold', margin: '2px 0' }}>
                Demandez au Timonier
              </div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                « Quoi ce soir ? », « Où manger ? », « Des projets de photo ? » : le guide répond en direct.
              </div>
            </Plate>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <Ornament glyph="⚓" />
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontStyle: 'italic', maxWidth: '380px', margin: '0 auto' }}>
                Programme, plan et travaux sont embarqués : fonctionne sans réseau, même au fond de la cale.
              </p>
            </div>
          </div>
        )}

        {/* 2. PROGRAMME */}
        {activeTab === 'programme' && (
          <Programme
            favorites={favorites}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            onSelectEvent={(e) => setSelectedEvent(e)}
          />
        )}

        {/* 3. PLAN */}
        {activeTab === 'plan' && (
          <Plan
            onSelectEvent={(e) => setSelectedEvent(e)}
            onSelectProject={(p) => setSelectedProject(p)}
          />
        )}

        {/* 4. TRAVAUX */}
        {activeTab === 'travaux' && (
          <Travaux onSelectProject={(p) => setSelectedProject(p)} />
        )}

        {/* 5. TIMONIER */}
        {activeTab === 'timonier' && (
          <Timonier
            favorites={favorites}
            onSelectEvent={(e) => setSelectedEvent(e)}
            onSelectProject={(p) => setSelectedProject(p)}
            onSelectLieu={allerAuLieuSurPlan}
          />
        )}
      </main>

      {/* MODAL FICHE DÉTAIL D'UN ÉVÉNEMENT */}
      <EventModal
        evenement={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        isFav={selectedEvent ? isFavorite(selectedEvent.id) : false}
        onToggleFav={() => selectedEvent && toggleFavorite(selectedEvent.id)}
      />

      {/* MODAL FICHE DÉTAIL D'UN PROJET */}
      <ProjectModal
        projet={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectEvent={(e) => setSelectedEvent(e)}
      />

      {/* NAVIGATION BAS */}
      <nav style={{
        position: 'sticky',
        bottom: 0,
        backgroundColor: 'var(--color-bg)',
        borderTop: '1.5px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 0',
        zIndex: 50,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
      }}>
        {[
          { id: 'accueil', label: 'Accueil', icon: Home },
          { id: 'programme', label: 'Programme', icon: Calendar },
          { id: 'plan', label: 'Plan', icon: MapPin },
          { id: 'travaux', label: 'Travaux', icon: FolderGit2 },
          { id: 'timonier', label: 'Timonier', icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)',
                flex: 1,
                opacity: isSelected ? 1 : 0.75,
              }}
            >
              <Icon size={20} />
              <span style={{
                fontFamily: 'var(--font-sc)',
                fontSize: '11px',
                letterSpacing: '0.5px',
                fontWeight: isSelected ? 'bold' : 'normal',
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}