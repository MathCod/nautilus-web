import type { Projet } from '../data/festival';
import { lieuParId } from '../data/festival';
import { MapPin } from 'lucide-react';

export function ProjectCard({
  projet,
  onClick,
}: {
  projet: Projet;
  onClick: () => void;
}) {
  const lieu = lieuParId(projet.lieuId);

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--color-card)',
        border: '1.5px solid var(--color-border)',
        borderRadius: '4px',
        padding: '16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        transition: 'transform 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{
          fontFamily: 'var(--font-sc)',
          fontSize: '12px',
          color: 'var(--color-accent)',
          letterSpacing: '0.5px'
        }}>
          {projet.filiere} · {projet.annee}
        </div>
        {lieu && (
          <div style={{
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <MapPin size={12} />
            <span>{lieu.nom}</span>
          </div>
        )}
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'var(--color-text)',
        lineHeight: 1.2
      }}>
        {projet.titre}
      </h3>

      <div style={{ fontStyle: 'italic', fontSize: '14px', color: 'var(--color-text-muted)' }}>
        Par {projet.eleves.join(', ')}
      </div>

      <p style={{ fontSize: '15px', color: 'var(--color-text)', lineHeight: 1.4 }}>
        {projet.resume}
      </p>

      {/* Badges techniques */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
        {projet.techniques.map((t) => (
          <span
            key={t}
            style={{
              fontSize: '12px',
              fontFamily: 'var(--font-body)',
              backgroundColor: 'rgba(74, 106, 126, 0.12)',
              color: 'var(--color-sea)',
              padding: '2px 8px',
              borderRadius: '3px',
              border: '1px solid rgba(74, 106, 126, 0.3)',
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}