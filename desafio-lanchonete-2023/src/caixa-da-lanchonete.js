class CaixaDaLanchonete {
    constructor() {
        this.cardapio = {
            cafe: { descricao: 'Café', valor: 3.00 },
            chantily: { descricao: 'Chantily (extra do Café)', valor: 1.50 },
            suco: { descricao: 'Suco Natural', valor: 6.20 },
            sanduiche: { descricao: 'Sanduíche', valor: 6.50 },
            queijo: { descricao: 'Queijo (extra do Sanduíche)', valor: 2.00 },
            salgado: { descricao: 'Salgado', valor: 7.25 },
            combo1: { descricao: '1 Suco e 1 Sanduíche', valor: 9.50 },
            combo2: { descricao: '1 Café e 1 Sanduíche', valor: 7.50 }
        };

        this.formasDePagamento = ['dinheiro', 'debito', 'credito'];
    }


    calcularValorDaCompra(metodoDePagamento, itens) {
        if (!this.formasDePagamento.includes(metodoDePagamento)) {
            return 'Forma de pagamento inválida!';
        }

        if (itens.length === 0) {
            return 'Não há itens no carrinho de compra!';
        }

        let total = 0;
        const principaisPedidos = new Set();

        for (const item of itens) {
            const [codigo, quantidade] = item.split(',');

            if (!this.cardapio[codigo]) {
                return 'Item inválido!';
            }

            const precoUnitario = this.cardapio[codigo].valor;

            if (quantidade <= 0) {
                return 'Quantidade inválida!';
            }

            if (!this.cardapio[codigo].descricao.includes('extra')) {
                principaisPedidos.add(codigo);
            }

            total += precoUnitario * quantidade;
        }

        for (const item of itens) {
            const [codigo] = item.split(',');

            if (this.cardapio[codigo].descricao.includes('extra')) {
                const principal = codigo.split(' ')[0];
                if (principal === 'chantily') {
                    if (!principaisPedidos.has('cafe')) {
                        return 'Item extra não pode ser pedido sem o principal';
                    }
                } else if (principal === 'queijo') {
                    if (!principaisPedidos.has('sanduiche')) {
                        return 'Item extra não pode ser pedido sem o principal';
                    }
                } else {
                    if (!principaisPedidos.has(principal)) {
                        return 'Item extra não pode ser pedido sem o principal';
                    }
                }
            }
        }
        if (metodoDePagamento === 'dinheiro') {
            total *= 0.95; // 5% de desconto
        } else if (metodoDePagamento === 'credito') {
            total *= 1.03; // 3% de acréscimo
        }

        return `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
}

//export { CaixaDaLanchonete };

let caixa = new CaixaDaLanchonete(); 

function exibirCardapio() {
    const cardapioElement = document.getElementById('cardapio');
    const cardapioList = document.createElement('ul');

    for (const codigo in caixa.cardapio) {
        const item = caixa.cardapio[codigo];
        const listItem = document.createElement('li');
        listItem.textContent = `${codigo} - ${item.descricao} - R$ ${item.valor.toFixed(2)}`;
        cardapioList.appendChild(listItem);
    }

    cardapioElement.innerHTML = '';
    cardapioElement.appendChild(cardapioList);

    cardapioElement.style.display = 'block';
}


function calcularValor() {
    const itensInput = document.getElementById('itens');
    const metodoPagamentoSelect = document.getElementById('metodo-pagamento');
    const resultadoElement = document.getElementById('resultado');

    const itensTexto = itensInput.value.trim();
    const metodoPagamento = metodoPagamentoSelect.value;

    if (!itensTexto || !metodoPagamento) {
        resultadoElement.textContent = 'Por favor, preencha todos os campos.';
        return;
    }

    const itens = itensTexto.split(';').map(item => item.trim());
    const caixa = new CaixaDaLanchonete();

    const resultado = caixa.calcularValorDaCompra(metodoPagamento, itens);
    resultadoElement.textContent = resultado;
}

//export { CaixaDaLanchonete };
