import type { Projet, Evenement } from '../data/festival';
import { lieuParId, evenementsDuProjet } from '../data/festival';
import { X, MapPin, Users, Calendar } from 'lucide-react';
import { Ornament } from './Paper';

export function ProjectModal({
  projet,
  onClose,
  onSelectEvent,
}: {
  projet: Projet | null;
  onClose: () => void;
  onSelectEvent?: (e: Evenement) => void;
}) {
  if (!projet) return null;

  const lieu = lieuParId(projet.lieuId);
  const evenementsLies = evenementsDuProjet(projet.id);

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

        <div style={{
          fontFamily: 'var(--font-sc)',
          fontSize: '13px',
          color: 'var(--color-accent)',
          letterSpacing: '1px'
        }}>
          {projet.filiere} · {projet.annee}
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          margin: '6px 0 12px 0',
          lineHeight: 1.2
        }}>
          {projet.titre}
        </h2>

        {/* Encadré Lieu & Auteurs */}
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
            <Users size={16} color="var(--color-accent)" />
            <span><strong>Auteurs :</strong> {projet.eleves.join(', ')}</span>
          </div>
          {lieu && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="var(--color-accent)" />
              <span><strong>Exposé à :</strong> {lieu.nom} ({lieu.description})</span>
            </div>
          )}
        </div>

        {/* Description longue */}
        <div style={{ margin: '20px 0', fontSize: '17px', lineHeight: 1.6 }}>
          <p style={{ fontStyle: 'italic', marginBottom: '12px', color: 'var(--color-text-muted)' }}>
            « {projet.resume} »
          </p>
          <p>{projet.description}</p>
        </div>

        {/* Techniques */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontFamily: 'var(--font-sc)', fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
            Techniques & outils employés :
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {projet.techniques.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: '13px',
                  backgroundColor: 'var(--color-card)',
                  color: 'var(--color-sea)',
                  padding: '3px 10px',
                  borderRadius: '3px',
                  border: '1px solid var(--color-border)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Événements liés (ex: vernissage, mapping) */}
        {evenementsLies.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <Ornament glyph="✦" />
            <div style={{ fontFamily: 'var(--font-sc)', fontSize: '13px', color: 'var(--color-accent)', marginBottom: '8px' }}>
              Rencontres ou diffusions au programme :
            </div>
            {evenementsLies.map((ev) => (
              <div
                key={ev.id}
                onClick={() => {
                  if (onSelectEvent) {
                    onClose();
                    onSelectEvent(ev);
                  }
                }}
                style={{
                  padding: '10px',
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  cursor: onSelectEvent ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold' }}>{ev.titre}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{ev.categorie} · {ev.debut}</div>
                </div>
                <Calendar size={18} color="var(--color-accent)" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}