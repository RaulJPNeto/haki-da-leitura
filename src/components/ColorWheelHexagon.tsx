import React from 'react';
import { CardColor } from '../types';

interface ColorWheelHexagonProps {
  colors: CardColor[];
  size?: number; // Tamanho em pixels (largura e altura)
  className?: string;
  showLabels?: boolean;
}

// Ordem canônica do hexágono da Color Wheel de One Piece Card Game (sentido horário)
const WHEEL_SLICES: {
  color: CardColor;
  labelPt: string;
  fill: string;
  glow: string;
  // Ângulos inicial e final em radianos para a fatia
  startAngle: number;
  endAngle: number;
}[] = [
  {
    color: 'RED',
    labelPt: 'Vermelho',
    fill: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.7)',
    startAngle: -Math.PI / 2, // -90° (Topo)
    endAngle: -Math.PI / 6    // -30° (Topo-Direito)
  },
  {
    color: 'GREEN',
    labelPt: 'Verde',
    fill: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.7)',
    startAngle: -Math.PI / 6, // -30°
    endAngle: Math.PI / 6     // +30° (Direita)
  },
  {
    color: 'BLUE',
    labelPt: 'Azul',
    fill: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.7)',
    startAngle: Math.PI / 6,  // +30°
    endAngle: Math.PI / 2     // +90° (Fundo-Direito)
  },
  {
    color: 'PURPLE',
    labelPt: 'Roxo',
    fill: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.7)',
    startAngle: Math.PI / 2,  // +90°
    endAngle: (5 * Math.PI) / 6 // +150° (Fundo-Esquerdo)
  },
  {
    color: 'BLACK',
    labelPt: 'Preto',
    fill: '#64748b', // Slate metálico para destaque sobre fundo escuro
    glow: 'rgba(148, 163, 184, 0.6)',
    startAngle: (5 * Math.PI) / 6, // +150°
    endAngle: (7 * Math.PI) / 6    // +210° (Esquerda)
  },
  {
    color: 'YELLOW',
    labelPt: 'Amarelo',
    fill: '#facc15',
    glow: 'rgba(250, 204, 21, 0.7)',
    startAngle: (7 * Math.PI) / 6, // +210°
    endAngle: (9 * Math.PI) / 6    // +270° (-90°, Topo-Esquerdo)
  }
];

export const ColorWheelHexagon: React.FC<ColorWheelHexagonProps> = ({
  colors,
  size = 44,
  className = '',
  showLabels = false
}) => {
  const center = 50;
  const radius = 42;

  // Normalização do array de cores para checagem rápida
  const activeColorSet = new Set(colors.map((c) => c.toUpperCase()));

  // Função para gerar o caminho de uma fatia triangular com pequena folga
  const getSlicePath = (startAngle: number, endAngle: number) => {
    // Adiciona uma leve contração angular para criar o espaçamento entre fatias
    const anglePadding = 0.04;
    const a1 = startAngle + anglePadding;
    const a2 = endAngle - anglePadding;

    const x1 = center + radius * Math.cos(a1);
    const y1 = center + radius * Math.sin(a1);
    const x2 = center + radius * Math.cos(a2);
    const y2 = center + radius * Math.sin(a2);

    return `M ${center} ${center} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div 
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: size, height: size }}
        title={`Identidade de Cores OPTCG: ${colors.join('/')}`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          {/* Fundo do Hexágono */}
          <polygon
            points="50,6 92,28 92,72 50,94 8,72 8,28"
            fill="#0b0e14"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="2.5"
          />

          {/* As 6 Fatias da Color Wheel */}
          {WHEEL_SLICES.map((slice) => {
            const isActive = activeColorSet.has(slice.color);
            return (
              <path
                key={slice.color}
                d={getSlicePath(slice.startAngle, slice.endAngle)}
                fill={isActive ? slice.fill : '#151b26'}
                stroke={isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.05)'}
                strokeWidth={isActive ? '1.5' : '0.8'}
                opacity={isActive ? 1 : 0.35}
                style={{
                  filter: isActive ? `drop-shadow(0 0 4px ${slice.glow})` : undefined,
                  transition: 'all 0.25s ease-in-out'
                }}
              />
            );
          })}

          {/* Núcleo Central (Pin do Hexágono) */}
          <circle
            cx={center}
            cy={center}
            r="7"
            fill="#080a0f"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1.5"
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
