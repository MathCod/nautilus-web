import React from 'react';

export function Ornament({ glyph = '❦' }: { glyph?: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      margin: '16px 0',
      color: 'var(--color-border)',
      fontSize: '18px'
    }}>
      <span style={{ height: '1px', flex: 1, backgroundColor: 'var(--color-border)', opacity: 0.5 }} />
      <span>{glyph}</span>
      <span style={{ height: '1px', flex: 1, backgroundColor: 'var(--color-border)', opacity: 0.5 }} />
    </div>
  );
}

export function Plate({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--color-card)',
        border: '1.5px solid var(--color-border)',
        borderRadius: '4px',
        padding: '16px',
        margin: '12px 0',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.02)',
        transition: 'transform 0.15s ease',
      }}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: 'var(--font-sc)',
      fontSize: '20px',
      letterSpacing: '1px',
      color: 'var(--color-text)',
      margin: '24px 0 12px 0',
      borderBottom: '1px dashed var(--color-border)',
      paddingBottom: '4px',
    }}>
      {children}
    </h2>
  );
}

export function ScreenHeader({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        fontFamily: 'var(--font-sc)',
        fontSize: '13px',
        color: 'var(--color-accent)',
        letterSpacing: '1px',
        marginBottom: '2px',
      }}>
        {kicker}
      </div>
      <h1 style={{
        fontFamily: 'var(--font-sc)',
        fontSize: '36px',
        lineHeight: 1.1,
        letterSpacing: '1px',
        borderBottom: subtitle ? 'none' : '1.5px solid var(--color-border)',
        paddingBottom: subtitle ? '0' : '8px',
      }}>
        {title}
      </h1>
      {subtitle && (
        <div style={{
          fontStyle: 'italic',
          color: 'var(--color-text-muted)',
          fontSize: '16px',
          borderBottom: '1.5px solid var(--color-border)',
          paddingBottom: '8px',
          marginTop: '4px',
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

export function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 14px',
        borderRadius: '20px',
        border: '1px solid var(--color-border)',
        backgroundColor: selected ? 'var(--color-text)' : 'var(--color-card)',
        color: selected ? 'var(--color-bg)' : 'var(--color-text)',
        fontFamily: 'var(--font-display)',
        fontSize: '15px',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {label}
    </button>
  );
}