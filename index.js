const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal'); // Adicionando o QR Code Terminal
const fs = require('fs');

// Função para carregar a memória do arquivo contextosMemoria.json
function carregarMemoria() {
  try {
    if (fs.existsSync('./contextosMemoria.json')) {
      const dados = fs.readFileSync('./contextosMemoria.json', 'utf8');
      return JSON.parse(dados);
    }
  } catch (err) {
    console.log('Erro ao carregar memória:', err);
    return {};
  }
  return {};
}

// Função para salvar os dados de memória no arquivo contextosMemoria.json
function salvarMemoria(memoria) {
  try {
    fs.writeFileSync('./contextosMemoria.json', JSON.stringify(memoria, null, 2));
  } catch (err) {
    console.log('Erro ao salvar memória:', err);
  }
}

// Função para adicionar ou atualizar dados na memória
function adicionarMemoria(jid, chave, valor) {
  if (!memoria[jid]) {
    memoria[jid] = {};  // Cria uma entrada para o usuário, caso não exista
  }
  memoria[jid][chave] = valor;  // Atualiza ou adiciona a chave

  salvarMemoria(memoria);  // Salva a memória sempre que houver alteração
}

// Função para recuperar dados da memória
function recuperarMemoria(jid, chave) {
  return memoria[jid]?.[chave] || null;
}

// Inicializa a memória carregando os dados do arquivo
let memoria = carregarMemoria();

// Nova forma de autenticação
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true, // Agora vai gerar o QR Code no terminal
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const texto = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    console.log(`[${msg.key.remoteJid}] >> ${texto}`);

    // Exemplo de como o bot responde com base no contexto da memória
    if (texto.toLowerCase() === 'oi') {
      await sock.sendMessage(msg.key.remoteJid, {
        text: 'Salve, torcedor da FURIA! 🐍 Aqui é o bot oficial pra te manter no hype! 🔥',
      });
    }

    if (texto.toLowerCase() === '!furia') {
      await sock.sendMessage(msg.key.remoteJid, {
        text: 'A FURIA é braba! Quer saber do elenco, próximos jogos ou frases marcantes? Manda: !elenco, !jogo ou !fallen 😤',
      });
    }

    // Exemplo de como armazenar o time favorito
    if (texto.toLowerCase().startsWith('!time ')) {
      const timeFavorito = texto.replace('!time ', '').trim();
      adicionarMemoria(msg.key.remoteJid, 'time', timeFavorito);  // Armazena o time na memória
      await sock.sendMessage(msg.key.remoteJid, {
        text: `Seu time favorito agora é ${timeFavorito}.`,
      });
    }

    // Exemplo de como recuperar o time favorito
    if (texto.toLowerCase() === '!meutime') {
      const time = recuperarMemoria(msg.key.remoteJid, 'time');  // Recupera o time favorito da memória
      if (time) {
        await sock.sendMessage(msg.key.remoteJid, { text: `Você é fã do ${time}!` });
      } else {
        await sock.sendMessage(msg.key.remoteJid, { text: `Você ainda não me disse seu time favorito.` });
      }
    }
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Conexão encerrada, reconectando?', shouldReconnect);
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log('✅ Bot conectado com sucesso!');
    }
  });

  // Exibir o QR code no terminal
  sock.ev.on('qr', qr => {
    qrcode.generate(qr, { small: true }, (qrcode) => {
      console.log(qrcode);
    });
  });
}

startBot();
