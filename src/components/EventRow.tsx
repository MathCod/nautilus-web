import type { Evenement } from '../data/festival';
import { heure, jourLabel, lieuParId } from '../data/festival';
import { Star } from 'lucide-react';

interface EventRowProps {
  evenement: Evenement;
  showDay?: boolean;
  isFav?: boolean;
  onToggleFav?: () => void;
  onClick?: () => void;
}

export function EventRow({ evenement, showDay, isFav, onToggleFav, onClick }: EventRowProps) {
  const lieu = lieuParId(evenement.lieuId);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: '12px 8px',
      borderBottom: '1px solid rgba(180, 157, 115, 0.3)',
      gap: '12px'
    }}>
      <div onClick={onClick} style={{ flex: 1, cursor: 'pointer' }}>
        <div style={{
          fontSize: '13px',
          fontFamily: 'var(--font-sc)',
          color: 'var(--color-accent)',
          letterSpacing: '0.5px'
        }}>
          {showDay ? `${jourLabel(evenement.jour)} · ` : ''}
          {heure(evenement.debut)} — {heure(evenement.fin)}
        </div>
        
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--color-text)',
          margin: '2px 0'
        }}>
          {evenement.titre}
        </div>

        <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
          <span style={{ fontStyle: 'italic' }}>{evenement.categorie}</span>
          {lieu && <span> · {lieu.nom}</span>}
        </div>
      </div>

      {onToggleFav && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav();
          }}
          aria-label="Favori"
          style={{
            padding: '6px',
            color: isFav ? 'var(--color-accent)' : 'var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Star size={20} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      )}
    </div>
  );
}