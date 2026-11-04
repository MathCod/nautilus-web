import { useState } from 'react';
import type { Categorie, JourDate, Evenement } from '../data/festival';
import { categories, compareEvenements, evenements, festival } from '../data/festival';
import { Chip, ScreenHeader } from './Paper';
import { EventRow } from './EventRow';

function jourParDefaut(): JourDate {
  return festival.jours[0].date;
}

export function Programme({
  favorites,
  isFavorite,
  toggleFavorite,
  onSelectEvent,
}: {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  onSelectEvent: (e: Evenement) => void;
}) {
  const [jour, setJour] = useState<JourDate>(jourParDefaut);
  const [categorie, setCategorie] = useState<Categorie | null>(null);
  const [parcours, setParcours] = useState(false);

  const liste = evenements
    .filter((e) => (parcours ? favorites.includes(e.id) : e.jour === jour))
    .filter((e) => !categorie || e.categorie === categorie)
    .sort(compareEvenements);

  return (
    <div>
      <ScreenHeader kicker="Trois jours, neuf lieux" title="Programme" />

      {/* SÉLECTEUR DE JOURS & MON PARCOURS */}
      <div style={{
        display: 'flex',
        border: '1.5px solid var(--color-text)',
        backgroundColor: 'var(--color-card)',
        marginBottom: '16px',
      }}>
        {festival.jours.map((j, i) => {
          const selected = !parcours && j.date === jour;
          return (
            <button
              key={j.date}
              onClick={() => {
                setParcours(false);
                setJour(j.date);
              }}
              style={{
                flex: 1,
                padding: '10px 4px',
                textAlign: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '16px',
                borderLeft: i > 0 ? '1px solid var(--color-text)' : 'none',
                backgroundColor: selected ? 'var(--color-text)' : 'transparent',
                color: selected ? 'var(--color-bg)' : 'var(--color-text)',
                fontWeight: selected ? 'bold' : 'normal',
                cursor: 'pointer',
              }}
            >
              {j.court}
            </button>
          );
        })}

        <button
          onClick={() => setParcours(true)}
          style={{
            flex: 1,
            padding: '10px 4px',
            textAlign: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            borderLeft: '1px solid var(--color-text)',
            backgroundColor: parcours ? 'var(--color-accent)' : 'transparent',
            color: parcours ? 'white' : 'var(--color-text)',
            fontWeight: parcours ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          ★ {favorites.length}
        </button>
      </div>

      {/* DÉFILEMENT DES CATÉGORIES (CHIPS) */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '12px',
        scrollbarWidth: 'none',
      }}>
        <Chip label="Tout" selected={!categorie} onClick={() => setCategorie(null)} />
        {categories.map((c) => (
          <Chip
            key={c}
            label={c}
            selected={categorie === c}
            onClick={() => setCategorie(categorie === c ? null : c)}
          />
        ))}
      </div>

      {parcours && (
        <div style={{
          fontFamily: 'var(--font-sc)',
          fontSize: '13px',
          color: 'var(--color-accent)',
          letterSpacing: '0.5px',
          marginBottom: '8px',
        }}>
          Mon parcours — tous les jours
        </div>
      )}

      {/* LISTE DES ÉVÉNEMENTS */}
      <div>
        {liste.map((e) => (
          <EventRow
            key={e.id}
            evenement={e}
            showDay={parcours}
            isFav={isFavorite(e.id)}
            onToggleFav={() => toggleFavorite(e.id)}
            onClick={() => onSelectEvent(e)}
          />
        ))}

        {liste.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 16px',
            fontStyle: 'italic',
            color: 'var(--color-text-muted)'
          }}>
            {parcours
              ? 'Votre parcours est vide. Touchez ☆ à côté d’un évènement pour l’y ajouter.'
              : 'Aucun évènement de ce genre ce jour-là.'}
          </div>
        )}
      </div>
    </div>
  );
}