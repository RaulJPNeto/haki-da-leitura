import { spawn } from 'child_process';

const targetUrl = 'https://localhost:5173';

console.log('\n======================================================');
console.log('🏴‍☠️ HAKI DA LEITURA — TÚNEL TRYCLOUDFLARE HTTPS');
console.log(`📡 Conectando ao servidor local em ${targetUrl}...`);
console.log('======================================================\n');

const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

const cloudflared = spawn(npxCmd, ['--yes', 'cloudflared', 'tunnel', '--url', targetUrl, '--no-tls-verify'], {
  stdio: ['ignore', 'pipe', 'pipe']
});

let tunnelFound = false;

function handleOutput(data) {
  const text = data.toString();
  const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);

  if (match && !tunnelFound) {
    tunnelFound = true;
    const url = match[0];
    console.log('\n======================================================');
    console.log('🚀 SEU LINK HTTPS TRYCLOUDFLARE PARA O CELULAR:');
    console.log(`👉 ${url}`);
    console.log('======================================================');
    console.log('💡 Abra o link no Chrome/Safari do seu celular.');
    console.log('   Permita o acesso à câmera para testar o scanner.');
    console.log('   Pressione CTRL+C neste terminal para encerrar o túnel.');
    console.log('======================================================\n');
  }
}

cloudflared.stdout.on('data', handleOutput);
cloudflared.stderr.on('data', handleOutput);

cloudflared.on('close', (code) => {
  console.log(`\nTúnel Cloudflare finalizado (código ${code}).`);
});

process.on('SIGINT', () => {
  console.log('\nEncerrando túnel Cloudflare...');
  cloudflared.kill();
  process.exit();
});
