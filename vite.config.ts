import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import basicSsl from '@vitejs/plugin-basic-ssl';

function debugLoggerPlugin() {
  return {
    name: 'debug-logger',
    configureServer(server: any) {
      server.middlewares.use('/api/debug-log', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const logDir = path.resolve(process.cwd(), 'logs');
              if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
              const logPath = path.join(logDir, 'debug_ocr.log');
              const isMeaningful =
                Boolean(data.cardFound) ||
                (Array.isArray(data.candidates) && data.candidates.length > 0) ||
                (data.rawText && data.rawText.trim().length >= 10 && data.signals && (data.signals.power || data.signals.cost || data.signals.cardType));

              if (!isMeaningful) {
                res.statusCode = 200;
                res.end('ignored');
                return;
              }

              const signalsStr = data.signals ? JSON.stringify(data.signals) : '{}';
              const candStr = data.candidates ? JSON.stringify(data.candidates) : '[]';
              const entry = `[${new Date().toISOString()}] OCR Raw: ${JSON.stringify(data.rawText)} | Signals: ${signalsStr} | Result: ${data.cardFound || 'Nenhum'} | Candidates: ${candStr}\n`;
              fs.appendFileSync(logPath, entry);

              // Auto-Rotação: Limita o arquivo aos 150 registros mais recentes para não pesar
              const currentContent = fs.readFileSync(logPath, 'utf8');
              const lines = currentContent.trim().split('\n');
              if (lines.length > 200) {
                fs.writeFileSync(logPath, lines.slice(-150).join('\n') + '\n');
              }
            } catch (e) {
              console.error('Debug log error:', e);
            }
            res.statusCode = 200;
            res.end('ok');
          });
        } else {
          res.statusCode = 200;
          res.end('ok');
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    basicSsl(),
    debugLoggerPlugin(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
      },
      manifest: {
        name: 'Haki da Leitura - Tradutor OPTCG',
        short_name: 'HakiLeitura',
        description: 'Scanner e Tradutor Instantâneo com Guia de Regras para One Piece Card Game (OPTCG)',
        theme_color: '#080a0f',
        background_color: '#080a0f',
        display: 'standalone',
        icons: [
          {
            src: '/favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    watch: {
      usePolling: true
    }
  }
});
