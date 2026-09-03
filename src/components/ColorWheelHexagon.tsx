import React from 'react';
import { CardColor } from '../types';

interface ColorWheelHexagonProps {
  colors: CardColor[];
  size?: number; // Tamanho em pixels (largura e altura)
  className?: string;
  showLabels?: boolean;
}

// Vértices do hexágono regular com topo pontiagudo (Centro em 50, 50 e Raio 44)
const V0 = { x: 50, y: 6 };    // Topo
const V1 = { x: 88.1, y: 28 }; // Topo-Direito
const V2 = { x: 88.1, y: 72 }; // Fundo-Direito
const V3 = { x: 50, y: 94 };   // Fundo
const V4 = { x: 11.9, y: 72 }; // Fundo-Esquerdo
const V5 = { x: 11.9, y: 28 }; // Topo-Esquerdo

// As 6 fatias triangulares puramente geométricas do hexágono oficial de OPTCG
const HEX_SLICES: {
  color: CardColor;
  labelPt: string;
  fill: string;
  glow: string;
  vStart: { x: number; y: number };
  vEnd: { x: number; y: number };
}[] = [
  {
    color: 'RED',
    labelPt: 'Vermelho',
    fill: '#dc2626',
    glow: 'rgba(239, 68, 68, 0.8)',
    vStart: V0,
    vEnd: V1
  },
  {
    color: 'GREEN',
    labelPt: 'Verde',
    fill: '#16a34a',
    glow: 'rgba(34, 197, 94, 0.8)',
    vStart: V1,
    vEnd: V2
  },
  {
    color: 'BLUE',
    labelPt: 'Azul',
    fill: '#0284c7',
    glow: 'rgba(56, 189, 248, 0.8)',
    vStart: V2,
    vEnd: V3
  },
  {
    color: 'PURPLE',
    labelPt: 'Roxo',
    fill: '#9333ea',
    glow: 'rgba(168, 85, 247, 0.8)',
    vStart: V3,
    vEnd: V4
  },
  {
    color: 'BLACK',
    labelPt: 'Preto',
    fill: '#1e293b',
    glow: 'rgba(148, 163, 184, 0.7)',
    vStart: V4,
    vEnd: V5
  },
  {
    color: 'YELLOW',
    labelPt: 'Amarelo',
    fill: '#eab308',
    glow: 'rgba(234, 179, 8, 0.8)',
    vStart: V5,
    vEnd: V0
  }
];

export const ColorWheelHexagon: React.FC<ColorWheelHexagonProps> = ({
  colors,
  size = 44,
  className = '',
  showLabels = false
}) => {
  const center = { x: 50, y: 50 };

  // Normalização do array de cores ativas
  const activeColorSet = new Set((colors || []).map((c) => c.toUpperCase()));

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div 
        className="relative shrink-0 flex items-center justify-center filter drop-shadow-md"
        style={{ width: size, height: size }}
        title={`Identidade de Cores OPTCG: ${colors.join('/')}`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
        >
          {/* Fundo Base do Hexágono */}
          <polygon
            points={`${V0.x},${V0.y} ${V1.x},${V1.y} ${V2.x},${V2.y} ${V3.x},${V3.y} ${V4.x},${V4.y} ${V5.x},${V5.y}`}
            fill="#0b0e14"
          />

          {/* As 6 Fatias Triangulares Geométricas com Linhas Retas */}
          {HEX_SLICES.map((slice) => {
            const isActive = activeColorSet.has(slice.color);
            const points = `${center.x},${center.y} ${slice.vStart.x},${slice.vStart.y} ${slice.vEnd.x},${slice.vEnd.y}`;

            return (
              <polygon
                key={slice.color}
                points={points}
                fill={isActive ? slice.fill : '#151b24'}
                stroke="#ffffff"
                strokeWidth={isActive ? '1.8' : '1.2'}
                strokeLinejoin="round"
                opacity={isActive ? 1 : 0.28}
                style={{
                  filter: isActive ? `drop-shadow(0 0 3px ${slice.glow})` : undefined,
                  transition: 'all 0.2s ease-in-out'
                }}
              />
            );
          })}

          {/* Borda Branca Externa Envolvente do Hexágono (Fiel ao verso da carta de OPTCG) */}
          <polygon
            points={`${V0.x},${V0.y} ${V1.x},${V1.y} ${V2.x},${V2.y} ${V3.x},${V3.y} ${V4.x},${V4.y} ${V5.x},${V5.y}`}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />

          {/* Núcleo Central Hexagonal/Circular com Borda Branca */}
          <circle
            cx={center.x}
            cy={center.y}
            r="6"
            fill="#080a0f"
            stroke="#ffffff"
            strokeWidth="1.8"
          />
        </svg>
      </div>

      {showLabels && (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Cor{colors.length > 1 ? 'es' : ''}
          </span>
          <span className="text-xs font-bold text-white leading-none">
            {colors.join(' / ')}
          </span>
        </div>
      )}
    </div>
  );
};
