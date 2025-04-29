const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const fs = require('fs');
const classifier = require('./intents');
const removerAcentos = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const palavrasProibidas = [
    "bosta", "merda", "porra", "caralho", "puta", "puto", "fdp", "foda", "foda-se", "vai se fuder", "vai tomar no cu",
    "arrombado", "babaca", "imbecil", "idiota", "otário", "otaria", "lixo", "nojento", "nojenta", "escroto", "escrota",
    "moleque", "palhaço", "vagabundo", "vagabunda", "corno", "corna", "chifrudo", "miserável", "desgraçado", "desgraça",
    "capeta", "demônio", "inferno", "diabo", "maldito", "maldita", "maldição",
    "racista", "preconceituoso", "nazista", "fascista", "homofóbico", "homofobico", "homofobia", "hitler", "preto", "nazismo",
    "transfobia", "misoginia", "machismo", "machista", "sexista",
    "macaco", "preto imundo", "crioulo", "viado", "boiola", "bichinha", "bicha", "traveco", "sapatão",
    "retardado", "mongoloide", "aleijado", "deficiente", "aleijada", "cego", "surdo", "mudo", "anão", "nanico", "fuder", "escravo",
    "terrorista", "estuprador", "pedófilo", "nazismo", "racismo", "antissemita", "genocida",
    "maconheiro", "drogado", "viciado", "traficante", "assassino",
    "estuprador", "estupradora", "estupro", "molestador", "pervertido", "tarado", "assediador", "negro",
    "câncer", "doente mental", "louco", "maníaco", "psicopata", "racism"
  ];
  

// Carrega biblioteca FURIA
const furiaData = JSON.parse(fs.readFileSync('./furiaData.json', 'utf8'));

// Armazena contexto por usuário
const contextos = {};

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');
        const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('Conexão encerrada. Reconnectar?', shouldReconnect);
        if (shouldReconnect) startBot();
        } else if (connection === 'open') {
        console.log('✅ Bot conectado com sucesso!');
        }
        });

        sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;
        let texto = '';
        if (msg.message.conversation) {
        texto = msg.message.conversation.toLowerCase();
        } else if (msg.message.extendedTextMessage?.text) {
        texto = msg.message.extendedTextMessage.text.toLowerCase();
        } else if (msg.message.imageMessage?.caption) {
        texto = msg.message.imageMessage.caption.toLowerCase();
        }

        const jid = msg.key.remoteJid;
        console.log('🟡 Texto detectado:', texto);

        const contemPalavraProibida = palavrasProibidas.some(p => texto.includes(p));
        if (contemPalavraProibida) {
        await sock.sendMessage(jid, { text: '🚫 Eita! Aqui é só respeito, irmão. Sem palavrões, por favor. Lembre que isso aqui é furia' });
        return;
}


        let resposta = null;
        // 🧠 Classifica intenção com NLP
        const intent = classifier.classify(texto);
        if (furiaData.Anuncios[intent]) {
        resposta = furiaData.Anuncios[intent];
        contextos[jid] = null;
        }

        


        // 🤝 Cumprimentos com variações
        const cumprimentos = [
            '🐺 Fala, meu consagrado! Bora trocar uma ideia sobre a FURIA no CS?',
            '🔥 Salve! Já tá na mira do clutch ou quer saber da line da FURIA?',
            '🖤 Seja bem-vindo! Aqui é só FURIA no CS, irmão!',
            '💣 Pronto pra plantar info? Manda sua pergunta aí!',
            '👊 Tamo junto! Pergunta aí que é só pedrada sobre a FURIA.',
        ];

        if (
        texto.match(/\b(oi|olá|ola|salve|eae|opa|oii|alo|hello|hi|oiii|bom dia|boa tarde|boa noite)\b/i)
        ) {
        resposta = cumprimentos[Math.floor(Math.random() * cumprimentos.length)];
        contextos[jid] = null;
        }
        // 💥 Utilidades (granadas)
        const limparTexto = (texto) => texto.toLowerCase().replace(/[^\w\s]/gi, '');

        const utilidades = {
          "molotov": "🔥A Molotov é usada pra forçar o adversário a sair de uma posição ou impedir que entre. Tanto a granada incendiária do CT como o cocktail Molotov do TR duram exatamente 7 segundos.",
          "smoke": "🌫️A smoke cria uma cortina de fumaça que bloqueia a visão. Perfeita pra entradas ou escapes. Sua duração é limitada, girando em torno de vinte segundos, o que deve ser levado em consideração na hora de usar para que você não acabe perdendo a cobertura e ficando vulnerável.",
          "flash": "💥A flash (ou bang) serve pra cegar o inimigo por alguns segundos e abrir espaço pra agressão. Ela tem duração de 4,87 segundos se olhar diretamente para ela",
          "he": "💣A HE é uma granada de fragmentação, usada pra causar dano em área. Um máximo de uma dessas granadas pode causar 98 de dano a um jogador sem colete e 57 a um com colete.",
          "decoy":"🎆A decoy ou granada de distração, é uma granada pouco utilizada no CS, com o objetivo de confundir os adversarios.",
        };
        
        const apelidosUtilidade = {
          "molotov": ["molotov", "molo", "fire"],
          "smoke": ["smoke", "fumaça", "granada de fumaça"],
          "flash": ["flash", "bang", "flashbang"],
          "he": ["he", "explosiva", "granada de dano"],
          "decoy": ["granada de distração", "decoy", "decoi"]
        };
        const raw = 
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        "";
        const textoMensagem = raw.toLowerCase();
        const textoLimpo = removerAcentos(textoMensagem);

        
        // 👇 granadas do cs
        if (
          textoMensagem.includes("quais granadas do cs") ||
          textoMensagem.includes("granadas do cs") ||
          textoMensagem.includes("granadas cs") ||
          textoMensagem.includes("quais sao as granadas do cs") ||
          textoMensagem.includes("quais são as granadas do cs")
        ) {
          await sock.sendMessage(msg.key.remoteJid, {
            text: "As granadas do CS são: 💣HE, 🔥Molotov, 💥Flash, 🌫️Smoke e 🎆Decoy."
          });
          return; // evita resposta errada
        }
        
        // 🔁 Verifica se alguma palavra corresponde às granadas individuais
        for (const [tipo, apelidos] of Object.entries(apelidosUtilidade)) {
          if (apelidos.some(apelido => textoMensagem.includes(apelido))) {
            await sock.sendMessage(msg.key.remoteJid, {
              text: utilidades[tipo]
            });
            return;
          }
        }

            // 📅 Próximo jogo da FURIA
        if (
            textoLimpo.includes("proximo jogo") ||
            textoLimpo.includes("esta classificada") ||
            textoLimpo.includes("esta classificado") ||
            textoLimpo.includes("proximos jogo") ||
            textoLimpo.includes("quando tem") ||
            textoLimpo.includes("quando a furia joga") ||
            textoLimpo.includes("quando vai ser o jogo") ||
            textoLimpo.includes("quando e o proximo jogo") || 
            textoLimpo.includes("qual o proximo") ||
            textoLimpo.includes("qual proximo")
            ) {
            await sock.sendMessage(msg.key.remoteJid, {
            text: "🎯 Quer saber quando a FURIA volta pro servidor? Confere os próximos jogos aqui:\n🔗 https://www.hltv.org/team/8297/furia#tab-matchesBox"
            });
            return;
        }
  
        // 🎯 Históricos
        if (!resposta && (
            texto.includes('historia') ||
            texto.includes('história') ||
            texto.includes('lore') ||
            texto.includes('sobre a furia') ||
            texto.includes('fala da furia') ||
            texto.includes('origem da furia') ||
            texto.includes('história da furia')
        )) {
            resposta = furiaData.historia.fundacao + '\n\n' + furiaData.historia.furia_antiga;
            contextos[jid] = null;

        } else if (
            texto.includes('primeiro major') || 
            texto.includes('estreia em major')
        ) {
            resposta = furiaData.historia.primeiro_major;
            contextos[jid] = null;

        } else if (
            texto.includes('melhor resultado') || 
            texto.includes('top 4') || 
            texto.includes('melhor colocação')
        ) {
            resposta = furiaData.historia.melhor_resultado_major;
            contextos[jid] = null;

        } else if (
            texto.includes('mouse')
        ) {
            resposta = furiaData.Anuncios.mouse;
            contextos[jid] = null;
        
        } else if (
            texto.includes('teclado')
        ) {
            resposta = furiaData.Anuncios.teclado;
            contextos[jid] = null;
        
        } else if (
            texto.includes('monitor')
        ) {
            resposta = furiaData.Anuncios.monitor;
            contextos[jid] = null;
        
        } else if (
            texto.includes('fone') || texto.includes('headset')
        ) {
            resposta = furiaData.Anuncios.fone;
            contextos[jid] = null;
        
        } else if (
            texto.includes('cadeira')
        ) {
            resposta = furiaData.Anuncios.cadeira;
            contextos[jid] = null;
        
        } else if (
            texto.includes('setup') || texto.includes('equipamento') || texto.includes('periférico')
        ) {
            resposta = furiaData.Anuncios.setup;
            contextos[jid] = null;  

        } else if (
            texto.includes('fallen') || 
            texto.includes('transferência do fallen') || 
            texto.includes('contratação') || 
            texto.includes('quando o fallen entrou')
        ) {
            resposta = furiaData.historia.transferencia_fallen;
            contextos[jid] = null;

        } else if (
            texto.includes('formação original') || 
            texto.includes('line inicial') || 
            texto.includes('primeiro time') ||
            texto.includes('primeira line')
        ) {
            resposta = '🔰 A formação original da FURIA no CS: arT, yuurih, VINI, ableJ, KSCERATO, com guerri de coach.';
            contextos[jid] = null;

        } else if (
            texto.includes('ano da fundação') ||
            texto.includes('quando foi fundada') || 
            texto.includes('quando foi criada') || 
            texto.includes('ano foi criada') || 
            texto.includes('foi formada') || 
            texto.includes('foi criada') || 
            texto.includes('criação') || 
            texto.includes('fundação da furia')
        ) {
            resposta = '📅 A FURIA foi fundada em 2017, com foco total em evoluir o cenário brasileiro de CS:GO.';
            contextos[jid] = null;

        } else if (
            texto.includes('quem é o dono') || 
            texto.includes('fundador furia') ||
            texto.includes('fundador da furia') ||
            texto.includes('fundador da org') ||
            texto.includes('dono da furia') || 
            texto.includes('quem criou a furia')
        ) {
            resposta = '👑 A FURIA foi criada por Jaime Pádua, junto de guerri e André Akkari. Um projeto ambicioso desde o começo.';
            contextos[jid] = null;

        } else if (
            texto.includes('melhor jogador')||
            texto.includes('melhor player')
        ){
            resposta = '🎯 Não existe um melhor jogador, cada pantera da FURIA é essencial no seu papel! Mas se liga: o KSCERATO 💥 já entrou na lista dos melhores do mundo, 🌎 e o nosso capitão FalleN 🧙‍♂️ foi considerado o 2º melhor jogador do mundo em 2016! 🔥'
            contextos[jid] = null;
            
            
        }else if (
            texto.includes('elenco') || 
            texto.includes('membros') || 
            texto.includes('line') || 
            texto.includes('jogadores') || 
            texto.includes('time atual') || 
            texto.includes('time da furia') ||
            texto.includes('time de') ||
            texto.includes('escalação')
        ) {
            const anosDetectados = texto.match(/\d{4}/g);
            contextos[jid] = { tipo: 'elenco' };

        if (anosDetectados?.length >= 2) {
            let [inicio, fim] = anosDetectados.map(Number);
        if (inicio > fim) [inicio, fim] = [fim, inicio];

            const respostaArray = [];
        for (let ano = inicio; ano <= fim; ano++) {
        if (furiaData.elencos[ano]) {
            respostaArray.push(`Elenco ${ano}: ${furiaData.elencos[ano].join(', ')}`);
        } else {
            respostaArray.push(`Elenco ${ano}: dados não encontrados.`);
        }
        }

        resposta = respostaArray.join('\n');

        } else {
            const ano = anosDetectados?.[0] || "2025";
        if (furiaData.elencos[ano]) {
            resposta = `Elenco ${ano}: ${furiaData.elencos[ano].join(', ')}`;
        } else {
            resposta = `Elenco não encontrado para o ano de ${ano}.`;
        }
        }

        } else if (!resposta && texto.match(/\d{4}/)) {
            const ano = texto.match(/\d{4}/)[0];
        if (contextos[jid]?.tipo === 'elenco') {
        if (furiaData.elencos[ano]) {
            resposta = `Elenco ${ano}: ${furiaData.elencos[ano].join(', ')}`;
        } else {
            resposta = `Elenco não encontrado para o ano de ${ano}.`;
        }
        }

        } else if (
            texto.includes('curiosidade') || 
            texto.includes('fato interessante') || 
            texto.includes('me conta algo')
        ) {
            const aleatoria = furiaData.curiosidades[Math.floor(Math.random() * furiaData.curiosidades.length)];
            resposta = `🔎 Curiosidade: ${aleatoria}`;
            contextos[jid] = null;

        } else if (
            texto.includes('majors') ||
            texto.includes('participação em major') || 
            texto.includes('colocação') || 
            texto.includes('camp mundial')
        ) {
            resposta = furiaData.majors.map(m => `📌 ${m.ano} - ${m.torneio}: ${m.colocacao}`).join('\n');
            contextos[jid] = null;

        } else if (
            texto.includes('o que é um major') || 
            texto.includes('o que é um major') || 
            texto.includes('oq é um major') ||
            texto.includes('oq é major') ||  
            texto.includes('oq é o major') ||  
            texto.includes('o que é o major') ||  
            texto.includes('explicação sobre major') || 
            texto.includes('o que significa major')
        ) {
            resposta = '🎮 Um Major é um torneio de Counter-Strike 2 (CS2) organizado pela Valve. Ele é um dos maiores e mais importantes torneios do cenário de CS2, com as melhores equipes do mundo competindo por grandes prêmios e pela glória de ser campeão. Os Majors são eventos anuais e representam um marco no calendário competitivo do jogo.';
            contextos[jid] = null;

        } else if (
            texto.includes('frase') || 
            texto.includes('fala famosa') || 
            texto.includes('icônica')
        ) {
            const frase = furiaData.frases_icônicas[Math.floor(Math.random() * furiaData.frases_icônicas.length)];
            resposta = `💬 "${frase}"`;
            contextos[jid] = null;

        } else if (
            texto.includes('o que é') || texto.includes('oq é') || texto.includes('significa') || texto.includes('quer dizer') || texto.includes('explica')
        ) {
            const palavras = texto.split(/\s+/);
            const giria = palavras.find(p => furiaData.gírias_cs[p]);
        if (giria) {
            resposta = furiaData.gírias_cs[giria];
        } else {
            resposta = '🤔 Não achei essa gíria no meu glossário. Tenta outra ou diz “explica clutch”, por exemplo.';
        }
            contextos[jid] = null;
            


        } else if (texto.startsWith('!')) {
            resposta = furiaData.comandos_utilidade[texto] || '❌ Comando não encontrado. Tente !setup, !drip, !live ou !proximojogo.';
            contextos[jid] = null;
        }

        if (!resposta) {
            resposta = furiaData.respostas_genericas.fora_do_escopo;
            contextos[jid] = null;
        }

        await sock.sendMessage(jid, { text: resposta });
    });
}

startBot();
