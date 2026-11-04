import type { Evenement } from '../data/festival';
import { heure, jourLabel, lieuParId, projets } from '../data/festival';
import { X, Star, MapPin, Clock, Users } from 'lucide-react';
import { Ornament } from './Paper';

export function EventModal({
  evenement,
  onClose,
  isFav,
  onToggleFav,
}: {
  evenement: Evenement | null;
  onClose: () => void;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  if (!evenement) return null;

  const lieu = lieuParId(evenement.lieuId);
  const projetsLies = projets.filter((p) => evenement.projetIds?.includes(p.id));

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(23, 19, 14, 0.6)',
        backdropFilter: 'blur(3px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '540px',
          maxHeight: '85vh',
          backgroundColor: 'var(--color-bg)',
          borderTop: '2px solid var(--color-border)',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          padding: '24px 20px',
          overflowY: 'auto',
          boxShadow: '0 -10px 25px rgba(0,0,0,0.2)',
          position: 'relative',
        }}
      >
        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: 'var(--color-text-muted)',
            padding: '4px',
          }}
        >
          <X size={24} />
        </button>

        {/* Catégorie & Favori */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '36px' }}>
          <span style={{
            fontFamily: 'var(--font-sc)',
            fontSize: '13px',
            color: 'var(--color-accent)',
            letterSpacing: '1px'
          }}>
            {evenement.categorie} {evenement.phare && '✦ Incontournable'}
          </span>
          <button
            onClick={onToggleFav}
            style={{
              color: isFav ? 'var(--color-accent)' : 'var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px',
            }}
          >
            <Star size={18} fill={isFav ? 'currentColor' : 'none'} />
            <span>{isFav ? 'Dans mon parcours' : 'Ajouter'}</span>
          </button>
        </div>

        {/* Titre */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '26px',
          margin: '8px 0 16px 0',
          lineHeight: 1.2
        }}>
          {evenement.titre}
        </h2>

        {/* Méta-données (Horaire & Lieu) */}
        <div style={{
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '6px',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="var(--color-accent)" />
            <span><strong>{jourLabel(evenement.jour)}</strong> · {heure(evenement.debut)} — {heure(evenement.fin)}</span>
          </div>
          {lieu && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="var(--color-accent)" />
              <span><strong>{lieu.nom}</strong> ({lieu.description})</span>
            </div>
          )}
          {evenement.intervenants && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="var(--color-accent)" />
              <span style={{ fontStyle: 'italic' }}>{evenement.intervenants}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{ margin: '20px 0', fontSize: '17px', lineHeight: 1.6 }}>
          {evenement.description}
        </div>

        {/* Projets associés */}
        {projetsLies.length > 0 && (
          <div>
            <Ornament glyph="❦" />
            <div style={{ fontFamily: 'var(--font-sc)', fontSize: '14px', color: 'var(--color-accent)', marginBottom: '8px' }}>
              Travaux d'élèves présentés :
            </div>
            {projetsLies.map((p) => (
              <div key={p.id} style={{
                padding: '10px',
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                marginBottom: '8px',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold' }}>{p.titre}</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{p.filiere} — {p.eleves.join(', ')}</div>
                <div style={{ fontSize: '14px', marginTop: '4px' }}>{p.resume}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}