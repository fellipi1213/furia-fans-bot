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
function salvarMemoria() {
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

    salvarMemoria();  // Salva a memória sempre que houver alteração
}

// Função para recuperar dados da memória
function recuperarMemoria(jid, chave) {
    return memoria[jid]?.[chave] || null;
}

// Inicializa a memória carregando os dados do arquivo
let memoria = carregarMemoria();

// Exporta as funções para serem utilizadas em outros arquivos
module.exports = {
    adicionarMemoria,
    recuperarMemoria,
    salvarMemoria,
    carregarMemoria
};
