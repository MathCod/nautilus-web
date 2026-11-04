import { useState, useRef, useEffect } from 'react';
import type { Reponse } from '../agent/timonier';
import { repondre, SUGGESTIONS_ACCUEIL } from '../agent/timonier';
import type { Evenement, Projet } from '../data/festival';
import { Plate, Ornament, Chip } from './Paper';
import { TimonierCarte } from './TimonierCarte';

type Message =
  | { id: number; auteur: 'visiteur'; texte: string }
  | { id: number; auteur: 'timonier'; reponse: Reponse };

const ACCUEIL: Message = {
  id: 0,
  auteur: 'timonier',
  reponse: {
    texte:
      'Bienvenue à bord ! Je suis le Timonier. Posez-moi vos questions sur le programme, le campus ou les travaux des élèves : je réponds même sans réseau.',
    cartes: [],
    suggestions: SUGGESTIONS_ACCUEIL,
  },
};

export function Timonier({
  favorites,
  onSelectEvent,
  onSelectProject,
  onSelectLieu,
}: {
  favorites: string[];
  onSelectEvent: (e: Evenement) => void;
  onSelectProject: (p: Projet) => void;
  onSelectLieu: (lieuId: string) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([ACCUEIL]);
  const [saisie, setSaisie] = useState('');
  const finDiscussionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finDiscussionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function demander(question: string) {
    const texte = question.trim();
    if (!texte) return;
    const reponse = repondre(texte, {
      maintenant: new Date(),
      favoris: new Set(favorites),
    });
    setMessages((liste) => [
      ...liste,
      { id: liste.length, auteur: 'visiteur', texte },
      { id: liste.length + 1, auteur: 'timonier', reponse },
    ]);
    setSaisie('');
  }

  const derniere = messages[messages.length - 1];
  const suggestions = derniere.auteur === 'timonier' ? derniere.reponse.suggestions : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* EN-TÊTE */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '38px', color: 'var(--color-accent)' }}>⚓</div>
        <div style={{ fontFamily: 'var(--font-sc)', fontSize: '13px', color: 'var(--color-accent)', letterSpacing: '1px' }}>
          Agent du festival
        </div>
        <h1 style={{ fontFamily: 'var(--font-sc)', fontSize: '32px', margin: '2px 0' }}>
          Le Timonier
        </h1>
        <Ornament glyph="✦" />
      </div>

      {/* LISTE DES MESSAGES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, marginBottom: '90px' }}>
        {messages.map((m) =>
          m.auteur === 'visiteur' ? (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{
                maxWidth: '82%',
                backgroundColor: 'var(--color-selected)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                borderBottomRightRadius: '3px',
                padding: '10px 14px',
                fontStyle: 'italic',
                fontSize: '16px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}>
                {m.texte}
              </div>
            </div>
          ) : (
            <Plate key={m.id}>
              <div style={{
                fontFamily: 'var(--font-sc)',
                fontSize: '12px',
                color: 'var(--color-accent)',
                letterSpacing: '0.5px',
                marginBottom: '4px'
              }}>
                Le Timonier
              </div>
              <p style={{ fontSize: '16px', lineHeight: 1.5 }}>
                {m.reponse.texte}
              </p>

              {m.reponse.cartes.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  {m.reponse.cartes.map((carte, i) => (
                    <TimonierCarte
                      key={i}
                      carte={carte}
                      onSelectEvent={onSelectEvent}
                      onSelectProject={onSelectProject}
                      onSelectLieu={onSelectLieu}
                    />
                  ))}
                </div>
              )}
            </Plate>
          )
        )}
        <div ref={finDiscussionRef} />
      </div>

      {/* ZONE FIXE DE SAISIE ET DE SUGGESTIONS (AU-DESSUS DES ONGLETS) */}
      <div style={{
        position: 'fixed',
        bottom: '58px', // Juste au-dessus de la nav bar
        left: 0,
        right: 0,
        maxWidth: '540px',
        margin: '0 auto',
        backgroundColor: 'var(--color-bg)',
        borderTop: '1px dashed var(--color-border)',
        padding: '8px 12px',
        zIndex: 40,
        boxShadow: '0 -4px 10px rgba(0,0,0,0.04)',
      }}>
        {suggestions.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollbarWidth: 'none',
          }}>
            {suggestions.map((s) => (
              <Chip key={s} label={s} selected={false} onClick={() => demander(s)} />
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            demander(saisie);
          }}
          style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
        >
          <input
            type="text"
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            placeholder="Demandez au Timonier…"
            style={{
              flex: 1,
              padding: '10px 14px',
              backgroundColor: 'var(--color-card)',
              border: '1.5px solid var(--color-text)',
              borderRadius: '4px',
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--color-text)',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={!saisie.trim()}
            style={{
              width: '42px',
              height: '42px',
              backgroundColor: saisie.trim() ? 'var(--color-accent)' : 'var(--color-border)',
              color: 'var(--color-bg)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              transition: 'background-color 0.2s',
            }}
            title="Envoyer la question"
          >
            ✒
          </button>
        </form>
      </div>
    </div>
  );
}