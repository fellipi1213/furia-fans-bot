const natural = require('natural');
const classifier = new natural.BayesClassifier();


//proximoJogo: 
classifier.addDocument('proximo jogo', 'proximoJogo');
classifier.addDocument('próximo jogo', 'proximoJogo');
classifier.addDocument('quando a furia joga', 'proximoJogo');
classifier.addDocument('quando tem jogo', 'proximoJogo');
classifier.addDocument('quando tem partida', 'proximoJogo');
classifier.addDocument('quando é o próximo jogo', 'proximoJogo');
classifier.addDocument('prox jogo', 'proximoJogo');
classifier.addDocument('furia vai jogar', 'proximoJogo');
classifier.addDocument('horário do jogo da furia', 'proximoJogo');
classifier.addDocument('qual o próximo jogo', 'proximoJogo');
classifier.addDocument('tem jogo da furia hoje', 'proximoJogo');

// Mouse
classifier.addDocument(' o mouse do fallen', 'mouse');
classifier.addDocument('onde compro mouse gamer', 'mouse');
classifier.addDocument('melhor mouse para csgo', 'mouse');

// Teclado
classifier.addDocument('teclado do kscerato', 'teclado');
classifier.addDocument('me indica um teclado bom', 'teclado');
classifier.addDocument(' teclado o yuurih usa', 'teclado');

// Fone
classifier.addDocument('fone do fallen', 'fone');
classifier.addDocument('headset gamer recomendado', 'fone');
classifier.addDocument(' headset os pro usam', 'fone');

// Monitor
classifier.addDocument('monitor bom para csgo', 'monitor');
classifier.addDocument('monitor o molodoy usa', 'monitor');

// Cadeira
classifier.addDocument('cadeira confortável gamer', 'cadeira');
classifier.addDocument('melhor cadeira pra jogar', 'cadeira');

// Setup
classifier.addDocument('como montar um setup', 'setup');
classifier.addDocument('dicas de setup completo', 'setup');

// História da FURIA
classifier.addDocument('qual a história da furia?', 'historia');
classifier.addDocument('como a furia começou?', 'historia');
classifier.addDocument('me conta sobre a furia', 'historia');
classifier.addDocument('quando a furia foi criada?', 'historia');
classifier.addDocument('quem fundou a furia?', 'historia');

// Elenco atual
classifier.addDocument('quem tá no time da furia em 2024?', 'elenco');
classifier.addDocument('formação da furia 2024', 'elenco');
classifier.addDocument('jogadores da furia agora', 'elenco');
classifier.addDocument('lineup atual da furia', 'elenco');

// Majors
classifier.addDocument('a furia já jogou major?', 'majors');
classifier.addDocument('quantos majors a furia participou?', 'majors');
classifier.addDocument('furia no major', 'majors');
classifier.addDocument('furia já chegou em semifinal de major?', 'majors');

// Frases icônicas
classifier.addDocument('manda uma frase braba', 'frase');
classifier.addDocument('fala algo marcante do cs', 'frase');
classifier.addDocument('tem alguma frase do fallen?', 'frase');
classifier.addDocument('alguma frase icônica da furia', 'frase');

// Utilidades - HE (granada explosiva)
classifier.addDocument('pra que serve a he?', 'utilidade');
classifier.addDocument('o que faz a granada explosiva?', 'utilidade');
classifier.addDocument('como usar a he?', 'utilidade');
classifier.addDocument('dano da he', 'utilidade');
classifier.addDocument('quando jogar a he?', 'utilidade');
classifier.addDocument('he mata direto?', 'utilidade');
classifier.addDocument('a he tira quanto de dano?', 'utilidade');
classifier.addDocument('oq é granda', 'utilidade');
classifier.addDocument('oq é he', 'utilidade');

// Utilidades - Flash
classifier.addDocument('pra que serve a flash?', 'utilidade');
classifier.addDocument('como usar a flash?', 'utilidade');
classifier.addDocument('o que é flashbang?', 'utilidade');
classifier.addDocument('o que a flash faz no cs?', 'utilidade');
classifier.addDocument('bang cega por quanto tempo?', 'utilidade');
classifier.addDocument('quando bangar?', 'utilidade');
classifier.addDocument('como cegar com a flash?', 'utilidade');
classifier.addDocument('granada de luz serve pra quê?', 'utilidade');
classifier.addDocument('oq é bang?');

// Utilidades - Smoke
classifier.addDocument('o que a smoke faz?', 'utilidade');
classifier.addDocument('como usar a fumaça no cs?', 'utilidade');
classifier.addDocument('pra que serve a smoke?', 'utilidade');
classifier.addDocument('quando tacar a smoke?', 'utilidade');
classifier.addDocument('smoke ajuda a avançar?', 'utilidade');
classifier.addDocument('o que é granada de fumaça?', 'utilidade');

// Utilidades - Molotov
classifier.addDocument('pra que serve a molotov?', 'utilidade');
classifier.addDocument('como usar a molotov no cs?', 'utilidade');
classifier.addDocument('molotov serve pra travar avanço?', 'utilidade');
classifier.addDocument('o que faz a molotov?', 'utilidade');
classifier.addDocument('molotov pega fogo onde?', 'utilidade');
classifier.addDocument('como counterar a molotov?', 'utilidade');
classifier.addDocument('molotov segura o rush?', 'utilidade');
classifier.addDocument('qual a diferença entre molotov e incendiária?', 'utilidade');

// Utilidades - Geral
classifier.addDocument('quais são as granadas do cs?', 'utilidade');
classifier.addDocument('pra que servem as utilitárias no cs?', 'utilidade');
classifier.addDocument('como aprender a usar granadas?', 'utilidade');
classifier.addDocument('me ensina a jogar granada no cs?', 'utilidade');

// Curiosidades
classifier.addDocument('me conta uma curiosidade da furia', 'curiosidade');
classifier.addDocument('curiosidade sobre cs', 'curiosidade');
classifier.addDocument('sabia que...', 'curiosidade');
classifier.addDocument('fala algo curioso', 'curiosidade');

// Gírias do CS
classifier.addDocument('o que é clutch?', 'giria');
classifier.addDocument('me explica o que é clutch', 'giria');
classifier.addDocument('clutch no cs significa o que?', 'giria');
classifier.addDocument('clutchando o round', 'giria');

// Respeito e proteção
classifier.addDocument('palavrão', 'respeito');
classifier.addDocument('xingamento', 'respeito');
classifier.addDocument('ofensa', 'respeito');
classifier.addDocument('fala feia', 'respeito');
classifier.addDocument('racismo', 'respeito');

classifier.train();

// Exporta o classificador treinado
module.exports = classifier;
