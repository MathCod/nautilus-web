import type { Carte } from '../agent/timonier';
import type { Evenement, Projet } from '../data/festival';
import { lieuParId } from '../data/festival';
import { EventRow } from './EventRow';
import { MapPin } from 'lucide-react';

export function TimonierCarte({
  carte,
  onSelectEvent,
  onSelectProject,
  onSelectLieu,
}: {
  carte: Carte;
  onSelectEvent: (e: Evenement) => void;
  onSelectProject: (p: Projet) => void;
  onSelectLieu: (lieuId: string) => void;
}) {
  if (carte.type === 'evenement') {
    return (
      <EventRow
        evenement={carte.evenement}
        showDay
        onClick={() => onSelectEvent(carte.evenement)}
      />
    );
  }

  if (carte.type === 'projet') {
    const { projet } = carte;
    const lieu = lieuParId(projet.lieuId);
    return (
      <div
        onClick={() => onSelectProject(projet)}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '12px 8px',
          borderBottom: '1px solid rgba(180, 157, 115, 0.4)',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '20px', color: 'var(--color-accent)' }}>❦</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-sc)', fontSize: '12px', color: 'var(--color-accent)' }}>
            {projet.filiere}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 'bold' }}>
            {projet.titre}
          </div>
          <div style={{ fontStyle: 'italic', fontSize: '14px', color: 'var(--color-text-muted)' }}>
            {projet.resume} {lieu && `— ${lieu.numero}. ${lieu.nom}`}
          </div>
        </div>
      </div>
    );
  }

  const { lieu } = carte;
  return (
    <div
      onClick={() => onSelectLieu(lieu.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 8px',
        borderBottom: '1px solid rgba(180, 157, 115, 0.4)',
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        border: '1.5px solid var(--color-accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-accent)',
        fontWeight: 'bold',
        fontSize: '14px',
      }}>
        {lieu.numero}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-sc)', fontSize: '11px', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={12} />
          <span>Voir sur le plan</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 'bold' }}>
          {lieu.nom}
        </div>
      </div>
    </div>
  );
}