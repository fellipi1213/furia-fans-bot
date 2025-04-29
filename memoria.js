const fs = require('fs');

function carregarMemoria() {
    try {
        if (fs.existsSync('./memoria/contextosMemoria.json')) {
            const dados = fs.readFileSync('./memoria/contextosMemoria.json', 'utf8');
            return JSON.parse(dados);
        }
    } catch (err) {
        console.log('Erro ao carregar memória:', err);
        return {};
    }
    return {};
}

function salvarMemoria() {
    try {
        fs.writeFileSync('./memoria/contextosMemoria.json', JSON.stringify(memoria, null, 2));
    } catch (err) {
        console.log('Erro ao salvar memória:', err);
    }
}

function adicionarMemoria(jid, chave, valor) {
    if (!memoria[jid]) {
        memoria[jid] = {};
    }
    memoria[jid][chave] = valor;
    salvarMemoria();
}

function recuperarMemoria(jid, chave) {
    return memoria[jid]?.[chave] || null;
}

let memoria = carregarMemoria();

module.exports = {
    adicionarMemoria,
    recuperarMemoria,
    salvarMemoria,
    carregarMemoria
};
