import localtunnel from 'localtunnel';

const port = 5174;

console.log('Iniciando túnel seguro HTTPS para o celular...');

try {
  const tunnel = await localtunnel({ port });

  console.log('\n======================================================');
  console.log('🚀 SEU LINK HTTPS PARA TESTAR NO CELULAR:');
  console.log(`👉 ${tunnel.url}`);
  console.log('======================================================');
  console.log('💡 DICA: Ao abrir pela 1ª vez, se o site pedir uma senha');
  console.log('   (Tunnel Password), acesse https://loca.lt/mytunnelpassword');
  console.log('   no seu computador e cole o IP que aparecer lá.');
  console.log('======================================================\n');

  tunnel.on('close', () => {
    console.log('Túnel encerrado.');
  });
} catch (err) {
  console.error('Erro ao abrir túnel:', err);
}
