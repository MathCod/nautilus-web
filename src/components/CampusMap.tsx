import { useState, useRef } from "react";
import type { Lieu } from "../data/festival";
import { lieux } from "../data/festival";

const VB_W = 1000;
const VB_H = 710;

const POSITIONS_REELLES: Record<
  string,
  { x: number; y: number; label: string }
> = {
  accueil: { x: 550, y: 210, label: "Accueil / Entrée" },
  cour: { x: 505, y: 390, label: "Scène extérieure" },
  studio: { x: 735, y: 330, label: "Studio" },
  ateliers: { x: 830, y: 330, label: "Ateliers" },
  bibliotheque: { x: 655, y: 430, label: "Bibliothèque" },
  nef: { x: 735, y: 430, label: "La Nef (Expo)" },
  amphi: { x: 815, y: 430, label: "Grand Amphi" },
  refectoire: { x: 735, y: 515, label: "Réfectoire" },
  jardin: { x: 835, y: 535, label: "Théâtre Jardin" },
};

export function CampusMap({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const zoomIn = () => setScale((s) => Math.min(s * 1.35, 3.5));
  const zoomOut = () => setScale((s) => Math.max(s / 1.35, 1));
  const resetZoom = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPos({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1000 / 710",
        border: "2px solid var(--color-text)",
        backgroundColor: "#EFE3C6",
        overflow: "hidden",
        borderRadius: "4px",
        userSelect: "none",
        boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
      }}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          width: "100%",
          height: "100%",
          cursor: isDragging ? "grabbing" : "grab",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          touchAction: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <image
              href="/plan.png"
              x="0"
              y="0"
              width={VB_W}
              height={VB_H}
              preserveAspectRatio="none"
            />

            <g transform="translate(370, 420)">
              <rect
                x="-55"
                y="-25"
                width="110"
                height="50"
                fill="rgba(42, 30, 20, 0.5)"
                rx="3"
                stroke="#2A1E14"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text
                x="0"
                y="-3"
                textAnchor="middle"
                fill="#F2E8D0"
                fontSize="13"
                fontFamily="var(--font-sc)"
                letterSpacing="1"
                fontWeight="bold"
              >
                Accès réservé
              </text>
              <text
                x="0"
                y="14"
                textAnchor="middle"
                fill="#F2E8D0"
                fontSize="11"
                fontFamily="var(--font-display)"
                fontStyle="italic"
              >
                (Hors festival)
              </text>
            </g>

            {lieux.map((lieu) => {
              const posReelle = POSITIONS_REELLES[lieu.id] || {
                x: lieu.x,
                y: lieu.y,
                label: lieu.nom,
              };
              const isSelected = lieu.id === selectedId;

              return (
                <MarkerItem
                  key={lieu.id}
                  lieu={lieu}
                  x={posReelle.x}
                  y={posReelle.y}
                  labelCourt={posReelle.label}
                  selected={isSelected}
                  onClick={() => onSelect(lieu.id)}
                />
              );
            })}
          </svg>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "12px",
          bottom: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          zIndex: 10,
        }}
      >
        <button
          onClick={zoomIn}
          style={{
            width: "36px",
            height: "36px",
            backgroundColor: "var(--color-bg)",
            border: "1.5px solid var(--color-text)",
            borderRadius: "4px",
            fontSize: "20px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
          }}
        >
          +
        </button>
        <button
          onClick={zoomOut}
          style={{
            width: "36px",
            height: "36px",
            backgroundColor: "var(--color-bg)",
            border: "1.5px solid var(--color-text)",
            borderRadius: "4px",
            fontSize: "20px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
          }}
        >
          −
        </button>
        <button
          onClick={resetZoom}
          style={{
            width: "36px",
            height: "36px",
            backgroundColor: "var(--color-bg)",
            border: "1.5px solid var(--color-text)",
            borderRadius: "4px",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
          }}
        >
          ⟲
        </button>
      </div>
    </div>
  );
}

function MarkerItem({
  lieu,
  x,
  y,
  labelCourt,
  selected,
  onClick,
}: {
  lieu: Lieu;
  x: number;
  y: number;
  labelCourt: string;
  selected: boolean;
  onClick: () => void;
}) {
  const r = selected ? 20 : 15;

  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}>
      {selected && (
        <circle
          cx={x}
          cy={y}
          r={r + 10}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeDasharray="4 3"
        />
      )}

      <circle cx={x + 1} cy={y + 2} r={r} fill="#2A1E14" opacity="0.35" />

      <circle
        cx={x}
        cy={y}
        r={r}
        fill={selected ? "#D9714F" : "#8C2F1B"}
        stroke="#F2E8D0"
        strokeWidth="2.2"
      />

      <text
        x={x}
        y={y + (selected ? 6 : 5)}
        textAnchor="middle"
        fill="#F2E8D0"
        fontSize={selected ? 17 : 14}
        fontFamily="var(--font-display)"
        fontWeight="bold"
      >
        {lieu.numero}
      </text>

      <text
        x={x}
        y={y + r + 14}
        textAnchor="middle"
        fontSize="13"
        fontFamily="var(--font-display)"
        fontStyle="italic"
        fill="#F2E8D0"
        stroke="#F2E8D0"
        strokeWidth="4"
        paintOrder="stroke"
        strokeLinejoin="round"
      >
        {labelCourt}
      </text>
      <text
        x={x}
        y={y + r + 14}
        textAnchor="middle"
        fontSize="13"
        fontFamily="var(--font-display)"
        fontStyle="italic"
        fill={selected ? "#8C2F1B" : "#2A1E14"}
        fontWeight={selected ? "bold" : "normal"}
      >
        {labelCourt}
      </text>
    </g>
  );
}