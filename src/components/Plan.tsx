import { useState } from 'react';
import type { Evenement, Projet } from '../data/festival';
import { lieux, lieuParId, evenementsDuLieu, projetsDuLieu, jourLabel, heure } from '../data/festival';
import { CampusMap } from './CampusMap';
import { Chip, ScreenHeader } from './Paper';
import { X, Calendar } from 'lucide-react';

export function Plan({
  onSelectEvent,
  onSelectProject,
}: {
  onSelectEvent: (e: Evenement) => void;
  onSelectProject: (p: Projet) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const lieu = selectedId ? lieuParId(selectedId) : null;

  return (
    <div>
      <ScreenHeader
        kicker="Glissez pour naviguer · touchez un repère"
        title="Plan du campus"
      />

      {/* CARTE SVG INTERACTIVE */}
      <CampusMap selectedId={selectedId} onSelect={setSelectedId} />

      {/* PANNEAU INFÉRIEUR (DÉTAILS OU LÉGENDE) */}
      <div style={{
        backgroundColor: 'var(--color-card)',
        border: '1.5px solid var(--color-text)',
        borderRadius: '4px',
        marginTop: '16px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}>
        {lieu ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '22px',
                fontWeight: 'bold',
                color: 'var(--color-text)',
              }}>
                {lieu.numero}. {lieu.nom}
              </h3>
              <button
                onClick={() => setSelectedId(null)}
                style={{ padding: '4px', color: 'var(--color-text-muted)' }}
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', margin: '4px 0 14px 0', fontStyle: 'italic' }}>
              {lieu.description}
            </p>

            {/* ÉVÉNEMENTS DU LIEU */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {evenementsDuLieu(lieu.id).map((e) => (
                <div
                  key={e.id}
                  onClick={() => onSelectEvent(e)}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '10px',
                    padding: '6px 0',
                    borderBottom: '1px dashed rgba(180, 157, 115, 0.4)',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-sc)',
                    fontSize: '13px',
                    color: 'var(--color-accent)',
                    whiteSpace: 'nowrap',
                    width: '90px'
                  }}>
                    {jourLabel(e.jour).slice(0, 3)}. {heure(e.debut)}
                  </span>
                  <span style={{ fontSize: '15px', color: 'var(--color-text)', flex: 1 }}>
                    {e.titre}
                  </span>
                  <Calendar size={14} color="var(--color-accent)" />
                </div>
              ))}
            </div>

            {/* TRAVAUX EXPOSÉS */}
            {projetsDuLieu(lieu.id).length > 0 && (
              <div style={{ marginTop: '14px' }}>
                <div style={{
                  fontFamily: 'var(--font-sc)',
                  fontSize: '12px',
                  color: 'var(--color-accent)',
                  letterSpacing: '0.5px',
                  marginBottom: '6px'
                }}>
                  Travaux exposés ici :
                </div>
                {projetsDuLieu(lieu.id).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 0',
                      cursor: 'pointer',
                      fontSize: '15px',
                    }}
                  >
                    <span style={{ color: 'var(--color-accent)' }}>❦</span>
                    <span style={{ fontStyle: 'italic', textDecoration: 'underline' }}>{p.titre}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{
              fontFamily: 'var(--font-sc)',
              fontSize: '13px',
              color: 'var(--color-accent)',
              letterSpacing: '0.5px',
              marginBottom: '10px'
            }}>
              Légende des 9 lieux
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '8px',
              scrollbarWidth: 'none',
            }}>
              {lieux.map((l) => (
                <Chip
                  key={l.id}
                  label={`${l.numero}. ${l.nom.split(' — ')[0]}`}
                  selected={false}
                  onClick={() => setSelectedId(l.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}