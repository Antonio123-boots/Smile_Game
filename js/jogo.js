/**
 * Jogo "Encontre o Smile"
 * 
 * Objetivo: Encontrar o smile escondido entre as cartas
 * Regras:
 * - Começa com 3 cartas
 * - A cada acerto, aumenta 2 cartas (até máximo de 20)
 * - Só avança de nível quando acerta
 * - Se errar, precisa clicar em "Jogar Novamente" para tentar novamente no mesmo nível
 */

// Variáveis globais do jogo
let tentativas = 0;       // Contador de tentativas totais
let acertos = 0;          // Contador de acertos totais
let nivel = 1;            // Nível atual do jogo
let cartasAtuais = 3;     // Quantidade de cartas no nível atual
const MAX_CARTAS = 20;    // Número máximo de cartas
let jogoAtivo = true;     // Controla se o jogo está ativo
let cartaSmile = null;    // Guarda a carta que contém o smile

// Elementos DOM
const tabuleiro = document.getElementById('tabuleiro');
const btnReiniciar = document.getElementById('reiniciar');
const btnJogarNovamente = document.getElementById('joganovamente');
const nivelDisplay = document.getElementById('nivel');
const cartasDisplay = document.getElementById('cartasAtuais');
const acertosDisplay = document.getElementById('acertos');
const tentativasDisplay = document.getElementById('tentativas');
const desempenhoDisplay = document.getElementById('desempenho');

// Inicializa o jogo quando a página carrega
document.addEventListener('DOMContentLoaded', iniciarJogo);

/**
 * Inicia o jogo pela primeira vez
 */
function iniciarJogo() {
    reiniciarJogo();
    btnReiniciar.addEventListener('click', reiniciarJogo);
    btnJogarNovamente.addEventListener('click', jogarNovamente);
}

/**
 * Reinicia completamente o jogo (volta ao nível 1)
 */
function reiniciarJogo() {
    // Reseta todas as variáveis
    tentativas = 0;
    acertos = 0;
    nivel = 1;
    cartasAtuais = 3;
    jogoAtivo = true;
    
    // Atualiza a interface
    atualizarPlacar();
    atualizarNivel();
    criarCartas();
    
    // Esconde o botão "Jogar Novamente" (só aparece quando erra)
    btnJogarNovamente.style.display = 'none';
}

/**
 * Prepara um novo jogo no mesmo nível (quando o jogador erra)
 */
function jogarNovamente() {
    jogoAtivo = true;
    criarCartas();
    btnJogarNovamente.style.display = 'none';
}

/**
 * Cria as cartas no tabuleiro
 */
function criarCartas() {
    // Limpa o tabuleiro
    tabuleiro.innerHTML = '';
    
    // Sorteia qual carta terá o smile (0 a cartasAtuais-1)
    cartaSmile = Math.floor(Math.random() * cartasAtuais);
    
    // Cria cada carta
    for (let i = 0; i < cartasAtuais; i++) {
        const carta = document.createElement('div');
        carta.className = 'carta';
        
        // Cria a estrutura interna da carta (frente e verso)
        carta.innerHTML = `
            <div class="carta-inner">
                <div class="carta-frente">${i + 1}</div>
                <div class="carta-verso">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2e/Oxygen480-emotes-face-smile-big.svg" alt="Smile">
                </div>
            </div>
        `;
        
        // Adiciona o evento de clique
        carta.addEventListener('click', () => clicarCarta(carta, i));
        tabuleiro.appendChild(carta);
    }
}

/**
 * Processa o clique em uma carta
 * @param {HTMLElement} carta - Elemento DOM da carta clicada
 * @param {number} indice - Índice da carta (0 a cartasAtuais-1)
 */
function clicarCarta(carta, indice) {
    // Só processa se o jogo estiver ativo
    if (!jogoAtivo) return;
    
    // Incrementa as tentativas
    tentativas++;
    atualizarPlacar();
    
    // Vira a carta
    carta.classList.add('virada');
    
    // Verifica se acertou
    if (indice === cartaSmile) {
        // Acertou - animação e avança de nível
        carta.classList.add('acertou');
        acertos++;
        jogoAtivo = false;
        
        // Atualiza o placar
        atualizarPlacar();
        
        // Aumenta o nível após um pequeno delay para a animação
        setTimeout(() => {
            if (cartasAtuais < MAX_CARTAS) {
                nivel++;
                cartasAtuais = Math.min(cartasAtuais + 2, MAX_CARTAS);
                atualizarNivel();
                criarCartas();
                jogoAtivo = true;
            } else {
                // Jogo completo (atingiu o máximo de cartas)
                alert(`Parabéns! Você completou todos os níveis com ${acertos} acertos em ${tentativas} tentativas!`);
                reiniciarJogo();
            }
        }, 1500);
    } else {
        // Errou - mostra a imagem triste
        const verso = carta.querySelector('.carta-verso');
        verso.innerHTML = '<img src="https://thumbs.dreamstime.com/b/cara-triste-amarela-de-emoji-com-%C3%ADcone-de-grito-do-rasgo-95366354.jpg" alt="Triste">';
        
        carta.classList.add('errou');
        jogoAtivo = false;
        
        // Mostra a carta correta
        const cartas = document.querySelectorAll('.carta');
        cartas[cartaSmile].classList.add('virada', 'acertou');
        
        // Mostra o botão "Jogar Novamente"
        btnJogarNovamente.style.display = 'inline-block';
    }
}

 /* Atualiza o placar na tela*/
function atualizarPlacar() {
    acertosDisplay.textContent = acertos;
    tentativasDisplay.textContent = tentativas;
    
    // Calcula o desempenho (porcentagem de acertos)
    const desempenho = tentativas > 0 ? Math.round((acertos / tentativas) * 100) : 0;
    desempenhoDisplay.textContent = `${desempenho}%`;
    
    // Muda a cor baseado no desempenho
    if (desempenho >= 70) {
        desempenhoDisplay.style.color = '#43e97b';
    } else if (desempenho >= 40) {
        desempenhoDisplay.style.color = '#f6d365';
    } else {
        desempenhoDisplay.style.color = '#ff758c';
    }
}

/**
 * Atualiza a exibição do nível e quantidade de cartas
 */
function atualizarNivel() {
    nivelDisplay.textContent = nivel;
    cartasDisplay.textContent = cartasAtuais;
}