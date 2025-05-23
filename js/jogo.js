/**
 * Jogo "Encontre o Smile"
 * 
 * Objetivo: Encontrar o smile escondido entre as cartas
 * Regras:
 * - Começa com 3 cartas
 * - A cada acerto, aumenta 2 cartas (até máximo de 20)
 * - Só avança de nível quando acerta
 * - Se errar, mostra rosto triste e precisa clicar em "Jogar Novamente"
 * - Após 10 erros no mesmo nível, reinicia automaticamente
 */

// Variáveis globais do jogo
let tentativas = 0;
let acertos = 0;
let nivel = 1;
let cartasAtuais = 3;
const MAX_CARTAS = 20;
let jogoAtivo = true;
let cartaSmile = null;
let tentativasNivel = 0;

// Elementos DOM
const tabuleiro = document.getElementById('tabuleiro');
const btnReiniciar = document.getElementById('reiniciar');
const btnJogarNovamente = document.getElementById('joganovamente');
const nivelDisplay = document.getElementById('nivel');
const cartasDisplay = document.getElementById('cartasAtuais');
const acertosDisplay = document.getElementById('acertos');
const tentativasDisplay = document.getElementById('tentativas');
const desempenhoDisplay = document.getElementById('desempenho');

// URLs das imagens
const SMILE_URL = 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Oxygen480-emotes-face-smile-big.svg';
const SAD_URL = 'https://png.pngtree.com/png-vector/20240731/ourlarge/pngtree-clipart-of-sad-emoji-png-image_13316922.png';

// Inicializa o jogo
document.addEventListener('DOMContentLoaded', iniciarJogo);

function iniciarJogo() {
    reiniciarJogo();
    btnReiniciar.addEventListener('click', reiniciarJogo);
    btnJogarNovamente.addEventListener('click', jogarNovamente);
}

function reiniciarJogo() {
    tentativas = 0;
    acertos = 0;
    nivel = 1;
    cartasAtuais = 3;
    jogoAtivo = true;
    tentativasNivel = 0;
    
    atualizarPlacar();
    atualizarNivel();
    criarCartas();
    
    btnJogarNovamente.style.display = 'none';
}

function jogarNovamente() {
    tentativasNivel++;
    
    if (tentativasNivel >= 10) {
        alert("Você errou muitas vezes no mesmo nível. Reiniciando o jogo...");
        reiniciarJogo();
        return;
    }
    
    jogoAtivo = true;
    criarCartas();
    btnJogarNovamente.style.display = 'none';
}

function criarCartas() {
    tabuleiro.innerHTML = '';
    cartaSmile = Math.floor(Math.random() * cartasAtuais);
    
    for (let i = 0; i < cartasAtuais; i++) {
        const carta = document.createElement('div');
        carta.className = 'carta';
        
        carta.innerHTML = `
            <div class="carta-inner">
                <div class="carta-frente">${i + 1}</div>
                <div class="carta-verso">
                    <img src="${SMILE_URL}" alt="Smile" class="carta-imagem">
                </div>
            </div>
        `;
        
        carta.addEventListener('click', () => clicarCarta(carta, i));
        tabuleiro.appendChild(carta);
    }
}

function clicarCarta(carta, indice) {
    if (!jogoAtivo) return;
    
    tentativas++;
    atualizarPlacar();
    carta.classList.add('virada');
    
    if (indice === cartaSmile) {
        // Acertou
        carta.classList.add('acertou');
        acertos++;
        jogoAtivo = false;
        tentativasNivel = 0;
        
        atualizarPlacar();
        
        setTimeout(() => {
            if (cartasAtuais < MAX_CARTAS) {
                nivel++;
                cartasAtuais = Math.min(cartasAtuais + 2, MAX_CARTAS);
                atualizarNivel();
                criarCartas();
                jogoAtivo = true;
            } else {
                alert(`Parabéns! Você completou todos os níveis com ${acertos} acertos em ${tentativas} tentativas!`);
                reiniciarJogo();
            }
        }, 1500);
    } else {
        // Errou - mostra rosto triste
        const img = carta.querySelector('.carta-imagem');
        img.src = SAD_URL;
        img.alt = "Triste";
        img.style.width = '80%';  // Ajusta o tamanho da imagem triste
        
        carta.classList.add('errou');
        jogoAtivo = false;
        
        // Mostra a carta correta
        const cartas = document.querySelectorAll('.carta');
        cartas[cartaSmile].classList.add('virada', 'acertou');
        
        btnJogarNovamente.style.display = 'inline-block';
    }
}

function atualizarPlacar() {
    acertosDisplay.textContent = acertos;
    tentativasDisplay.textContent = tentativas;
    
    const desempenho = tentativas > 0 ? Math.round((acertos / tentativas) * 100) : 0;
    desempenhoDisplay.textContent = `${desempenho}%`;
    
    if (desempenho >= 70) {
        desempenhoDisplay.style.color = '#43e97b';
    } else if (desempenho >= 40) {
        desempenhoDisplay.style.color = '#f6d365';
    } else {
        desempenhoDisplay.style.color = '#ff758c';
    }
}

function atualizarNivel() {
    nivelDisplay.textContent = nivel;
    cartasDisplay.textContent = cartasAtuais;
}