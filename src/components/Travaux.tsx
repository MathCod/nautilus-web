import { useState } from 'react';
import { Search } from 'lucide-react';
import type { Projet } from '../data/festival';
import { filieres, projets } from '../data/festival';
import { Chip, ScreenHeader } from './Paper';
import { ProjectCard } from './ProjectCard';

const normaliser = (texte: string) =>
  texte.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function Travaux({
  onSelectProject,
}: {
  onSelectProject: (p: Projet) => void;
}) {
  const [recherche, setRecherche] = useState('');
  const [filiere, setFiliere] = useState<string | null>(null);

  const q = normaliser(recherche.trim());
  const liste = projets.filter(
    (p) =>
      (!filiere || p.filiere === filiere) &&
      (!q ||
        normaliser([p.titre, p.resume, p.eleves.join(' '), p.techniques.join(' ')].join(' ')).includes(q))
  );

  return (
    <div>
      <ScreenHeader
        kicker="Cabinet des élèves"
        title="Travaux des élèves"
        subtitle="Projets présentés pendant le festival"
      />

      {/* CHAMP DE RECHERCHE */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un projet, un élève, une technique…"
          style={{
            width: '100%',
            padding: '10px 14px 10px 38px',
            backgroundColor: 'var(--color-card)',
            border: '1.5px solid var(--color-text)',
            borderRadius: '4px',
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
            fontSize: '16px',
            color: 'var(--color-text)',
            outline: 'none',
          }}
        />
        <Search
          size={18}
          color="var(--color-text-muted)"
          style={{ position: 'absolute', left: '12px' }}
        />
      </div>

      {/* FILTRES PAR FILIÈRE */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '16px',
        scrollbarWidth: 'none',
      }}>
        <Chip label="Toutes filières" selected={!filiere} onClick={() => setFiliere(null)} />
        {filieres.map((f) => (
          <Chip
            key={f}
            label={f}
            selected={filiere === f}
            onClick={() => setFiliere(filiere === f ? null : f)}
          />
        ))}
      </div>

      {/* LISTE DES CARTES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {liste.map((p) => (
          <ProjectCard key={p.id} projet={p} onClick={() => onSelectProject(p)} />
        ))}

        {liste.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 16px',
            fontStyle: 'italic',
            color: 'var(--color-text-muted)',
          }}>
            Aucun projet ne correspond à cette recherche.
          </div>
        )}
      </div>
    </div>
  );
}