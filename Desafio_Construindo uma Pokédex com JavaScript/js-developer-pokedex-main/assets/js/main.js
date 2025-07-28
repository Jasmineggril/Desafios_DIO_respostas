// assets/js/main.js

// Importa todas as cartas definidas em card-data.js
import { ALL_GAME_CARDS } from './card-data.js';
// Importa a API de imagens que busca URLs de sprites
import { pokeImageApi } from './poke-image-api.js';
// Importa a API da Pokédex original (para detalhes completos)
import { pokeApi } from './poke-api.js';


// --- Funções Auxiliares ---

// Função para embaralhar um array (algoritmo de Fisher-Yates)
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

// --- Elementos do DOM ---
// IMPORTANTE: Estes elementos são selecionados APÓS a definição das funções auxiliares
const gameMessages = document.getElementById('game-messages');
const nextTurnBtn = document.getElementById('next-turn-btn');
const playerHandElements = {
    'Ash': document.getElementById('player-1-hand'),
    'Misty': document.getElementById('player-2-hand'),
    'Brock': document.getElementById('player-3-hand'),
    'Jessie': document.getElementById('player-4-hand')
};
const playerActivePokemonSlots = {
    'Ash': document.querySelector('#player-1-area .active-pokemon-slot'),
    'Misty': document.querySelector('#player-2-area .active-pokemon-slot'),
    'Brock': document.querySelector('#player-3-area .active-pokemon-slot'),
    'Jessie': document.querySelector('#player-4-area .active-pokemon-slot')
};
const playerBenchSlots = {
    'Ash': document.querySelector('#player-1-area .bench-slot'),
    'Misty': document.querySelector('#player-2-area .bench-slot'),
    'Brock': document.querySelector('#player-3-area .bench-slot'),
    'Jessie': document.querySelector('#player-4-area .bench-slot')
};

// Elementos do Modal de Regras e seu botão de ativação
const rulesModal = document.getElementById('rules-modal');
const closeRulesModalBtn = document.getElementById('close-rules-modal-btn');
const showRulesBtn = document.getElementById('show-rules-btn');


// --- Exibição de Detalhes do Pokémon (Modal) ---
// Este código cria o modal de detalhes do Pokémon dinamicamente
const pokemonDetailModal = document.createElement('div');
pokemonDetailModal.id = 'pokemon-detail-modal';
pokemonDetailModal.style.cssText = `
    display: none; 
    position: fixed; 
    z-index: 1000; 
    left: 0; 
    top: 0; 
    width: 100%; 
    height: 100%; 
    overflow: auto; 
    background-color: rgba(0,0,0,0.8);
    justify-content: center;
    align-items: center;
`;
document.body.appendChild(pokemonDetailModal);

const modalContent = document.createElement('div');
modalContent.style.cssText = `
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 500px;
    border-radius: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
pokemonDetailModal.appendChild(modalContent);

const closeModalBtn = document.createElement('span');
closeModalBtn.innerHTML = '&times;';
closeModalBtn.style.cssText = `
    position: absolute;
    right: 15px;
    top: 5px;
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
`;
closeModalBtn.onclick = () => { pokemonDetailModal.style.display = 'none'; };
modalContent.appendChild(closeModalBtn);

const detailContentArea = document.createElement('div');
modalContent.appendChild(detailContentArea);


async function showPokemonDetails(pokemonCard) {
    if (!pokemonCard || !pokemonCard.apiId) {
        console.error("Carta de Pokémon inválida ou sem API ID.");
        return;
    }

    detailContentArea.innerHTML = 'Carregando detalhes...';
    pokemonDetailModal.style.display = 'flex'; // Exibe o modal

    try {
        const fullPokemonDetails = await pokeApi.getPokemonDetailsById(pokemonCard.apiId);

        if (fullPokemonDetails) {
            // Certifique-se de que os atributos existem antes de tentar acessá-los
            const typesDisplay = fullPokemonDetails.types ? fullPokemonDetails.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)).join(', ') : 'N/A';
            const abilitiesDisplay = fullPokemonDetails.abilities ? fullPokemonDetails.abilities.map(a => a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1)).join(', ') : 'N/A';

            detailContentArea.innerHTML = `
                <h2>${fullPokemonDetails.name.toUpperCase()} (#${fullPokemonDetails.number})</h2>
                <img src="${fullPokemonDetails.photo}" alt="${fullPokemonDetails.name}" style="max-width: 150px; margin: 10px 0;">
                <p><strong>Tipo:</strong> ${typesDisplay}</p>
                <p><strong>Altura:</strong> ${fullPokemonDetails.height ? fullPokemonDetails.height / 10 : 'N/A'} m</p>
                <p><strong>Peso:</strong> ${fullPokemonDetails.weight ? fullPokemonDetails.weight / 10 : 'N/A'} kg</p>
                <p><strong>Habilidades:</strong> ${abilitiesDisplay}</p>
            `;
        } else {
            detailContentArea.innerHTML = 'Não foi possível carregar os detalhes deste Pokémon.';
        }
    } catch (error) {
        console.error("Erro ao mostrar detalhes do Pokémon:", error);
        detailContentArea.innerHTML = 'Ocorreu um erro ao carregar os detalhes.';
    }
}


// --- Funções de Renderização Visual ---

// Função para criar o elemento HTML de uma carta
function createCardElement(card) {
    const cardEl = document.createElement('div');
    cardEl.classList.add('card'); // Aplica a classe CSS 'card'
    cardEl.dataset.cardId = card.id; // Guarda o ID da carta para referência

    // Conteúdo da carta
    if (card.cardType === 'pokemon') {
        cardEl.classList.add(`pokemon-card`); // Adiciona classe específica para Pokémon
        // Adiciona classe do tipo principal do Pokémon para estilização (ex: 'electric', 'fire')
        cardEl.classList.add(card.pokemonType.toLowerCase()); 
        cardEl.innerHTML = `
            <img src="${card.imageUrl || 'https://via.placeholder.com/80x80?text=?'}" alt="${card.name}">
            <span class="name">${card.name}</span>
            <span class="hp">${card.currentHp}/${card.hp} HP</span>
            <span class="attack-name">${card.attackName}</span>
            <span class="attack-damage">${card.attackDamage} DMG</span>
        `;
        // Adiciona evento de clique para mostrar detalhes da Pokédex
        cardEl.addEventListener('click', () => showPokemonDetails(card));
    } else if (card.cardType === 'energia') {
        cardEl.classList.add(`energy-card`); 
        cardEl.classList.add(card.energyType); 
        cardEl.innerHTML = `
            <span class="name">${card.name}</span>
            <img src="https://via.placeholder.com/80x80?text=${card.energyType.toUpperCase()}" alt="${card.name}">
        `;
        cardEl.addEventListener('click', () => console.log(`Clicou na carta de Energia: ${card.name}`));
    } else if (card.cardType === 'treinador') {
        cardEl.classList.add(`trainer-card`); 
        cardEl.innerHTML = `
            <span class="name">${card.name}</span>
            <img src="https://via.placeholder.com/80x80?text=Item" alt="${card.name}">
            <p style="font-size:0.6em; text-align: center;">${card.effectDescription}</p>
        `;
        cardEl.addEventListener('click', () => console.log(`Clicou na carta de Treinador: ${card.name}`));
    }

    return cardEl;
}

// Função para renderizar a mão de um jogador
function renderHand(player) {
    const handEl = playerHandElements[player.name];
    if (!handEl) {
        console.error(`Elemento da mão para o jogador ${player.name} não encontrado.`);
        return;
    }
    handEl.innerHTML = ''; // Limpa a mão atual
    player.hand.forEach(card => {
        handEl.appendChild(createCardElement(card));
    });
}

// Função para renderizar o Pokémon Ativo
function renderActivePokemon(player) {
    const activeSlotEl = playerActivePokemonSlots[player.name];
    if (!activeSlotEl) return;

    activeSlotEl.innerHTML = ''; // Limpa o slot
    if (player.activePokemon) {
        activeSlotEl.appendChild(createCardElement(player.activePokemon));
    } else {
        activeSlotEl.innerHTML = 'Pokémon Ativo'; // Placeholder
    }
}

// Função para renderizar o Banco
function renderBench(player) {
    const benchSlotEl = playerBenchSlots[player.name];
    if (!benchSlotEl) return;

    benchSlotEl.innerHTML = ''; // Limpa o slot
    if (player.bench.length > 0) {
        player.bench.forEach(pokemon => {
             benchSlotEl.appendChild(createCardElement(pokemon));
        });
    } else {
        benchSlotEl.innerHTML = 'Banco'; // Placeholder
    }
}

// Função para atualizar a interface de todos os jogadores
function updateUI(game) {
    game.players.forEach(player => {
        renderHand(player);
        renderActivePokemon(player);
        renderBench(player);
        // TODO: Renderizar decks, descartes, etc.
    });
    gameMessages.textContent = `É a vez de ${game.players[game.currentPlayerIndex].name}. Turno ${game.turn}.`;
}


// --- Classes do Jogo ---

// Classe para representar um jogador
class Player {
    constructor(name) {
        this.name = name;
        this.deck = []; // Array de objetos Card (cartas no deck)
        this.hand = []; // Array de objetos Card (cartas na mão)
        this.activePokemon = null; // Objeto BasicPokemonCard (Pokémon ativo em campo)
        this.bench = []; // Array de objetos BasicPokemonCard (Pokémon no banco, limitado a 1)
        this.discardPile = []; // Array de objetos Card (pilha de descarte)
        this.knockedOutPokemonCount = 0; // Para a condição de vitória (contagem de Pokémon nocauteados do oponente)
    }

    // Método para sacar uma carta
    drawCard() {
        if (this.deck.length > 0) {
            const card = this.deck.pop(); // Pega a última carta do deck (topo)
            this.hand.push(card);
            console.log(`${this.name} sacou ${card.name}.`);
            return card;
        } else {
            console.log(`${this.name} não tem mais cartas no deck!`);
            // Lógica de derrota por falta de cartas (se aplicável nas regras)
            return null;
        }
    }

    // Métodos de jogo (serão implementados nas próximas etapas)
    playBasicPokemon(pokemonCard) {
        // Lógica para colocar Pokémon Básico no campo (ativo ou banco)
        console.log(`${this.name} tentou jogar ${pokemonCard.name}. (Lógica a ser implementada)`);
    }

    attachEnergy(energyCard, targetPokemon) {
        // Lógica para anexar energia a um Pokémon
        console.log(`${this.name} tentou anexar ${energyCard.name} a ${targetPokemon.name}. (Lógica a ser implementada)`);
    }

    useTrainerCard(trainerCard) {
        // Lógica para usar uma carta de treinador
        console.log(`${this.name} usou ${trainerCard.name}. (Lógica a ser implementada)`);
        trainerCard.effectFunction(game, this); // Chama a função de efeito da carta
    }

    attack(targetPlayer) {
        // Lógica de ataque do Pokémon ativo
        if (this.activePokemon) {
            console.log(`${this.name}'s ${this.activePokemon.name} atacou ${targetPlayer.activePokemon.name}!`);
            // Exemplo simples de dano:
            // targetPlayer.activePokemon.currentHp -= this.activePokemon.attackDamage;
            // console.log(`${targetPlayer.activePokemon.name} agora tem ${targetPlayer.activePokemon.currentHp} HP.`);
            // game.checkKnockout(targetPlayer); // Verifica se o Pokémon foi nocauteado
        } else {
            console.log(`${this.name} não tem Pokémon Ativo para atacar.`);
        }
    }

    // ... outros métodos do jogador (descartar, evoluir, etc.)
}

// Classe principal do jogo
class Game {
    constructor(playersNames) {
        this.players = playersNames.map(name => new Player(name));
        this.currentPlayerIndex = 0;
        this.turn = 0;
        this.isGameOver = false;
        this.winner = null;
        // Referência global ao objeto game para ser acessível pelas funções de efeito das TrainerCard
        window.game = this; // Permite que a TrainerCard.effectFunction acesse 'game'
    }

    async initializeGame() { // Tornar initializeGame assíncrona
        console.log('--- Inicializando o jogo ---');

        // 1. Pré-carregar as imagens dos Pokémon usando a API
        const imagePromises = ALL_GAME_CARDS.map(async card => {
            if (card.cardType === 'pokemon' && card.apiId) {
                const imageUrl = await pokeImageApi.getPokemonImageUrl(card.apiId);
                card.imageUrl = imageUrl; // Atribui a URL da imagem à carta
            }
        });
        await Promise.all(imagePromises); // Espera todas as imagens serem carregadas

        console.log('Todas as imagens de Pokémon pré-carregadas.');
        // Agora, você pode ver as URLs das imagens nas suas cartas
        console.log('Exemplo de Pikachu com imagem:', ALL_GAME_CARDS.find(card => card.name === 'Pikachu'));

        // 2. Montar o deck de cada jogador e distribuir mãos
        this.players.forEach(player => {
            let playerBaseDeck = [];
            for(let i = 0; i < 20; i++) {
                playerBaseDeck.push(ALL_GAME_CARDS[Math.floor(Math.random() * ALL_GAME_CARDS.length)]);
            }
            player.deck = shuffle(playerBaseDeck);
            
            for (let i = 0; i < 5; i++) {
                player.drawCard();
            }
            
            console.log(`${player.name} deck:`, player.deck.length, 'cartas.');
            console.log(`${player.name} mão inicial:`, player.hand.map(c => c.name));

            const firstBasicPokemonInHand = player.hand.find(card => card.cardType === 'pokemon' && card.isBasic);
            if(firstBasicPokemonInHand) {
                player.activePokemon = firstBasicPokemonInHand;
                player.hand = player.hand.filter(card => card.id !== firstBasicPokemonInHand.id); 
                console.log(`${player.name} Pokémon Ativo inicial: ${player.activePokemon.name}`);
            } else {
                console.warn(`${player.name} não tinha Pokémon Básico na mão inicial para colocar como Ativo.`);
            }
        });

        // 3. Renderizar a interface inicial
        updateUI(this); // Chamar a função de atualização da UI após setup inicial

        // 4. Conectar o botão "Próximo Turno"
        nextTurnBtn.addEventListener('click', () => this.nextTurn());

        // 5. Conectar o botão "Ver Regras"
        showRulesBtn.addEventListener('click', () => {
            rulesModal.style.display = 'flex'; // Exibe o modal de regras
        });
        closeRulesModalBtn.addEventListener('click', () => {
            rulesModal.style.display = 'none'; // Esconde o modal de regras
        });
        // Fechar modal clicando fora
        rulesModal.addEventListener('click', (event) => {
            if (event.target === rulesModal) {
                rulesModal.style.display = 'none';
            }
        });

        // 6. Iniciar o primeiro turno (a partir daqui o fluxo de jogo começa)
        this.startTurn();
    }

    startTurn() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        this.turn++;
        gameMessages.textContent = `É a vez de ${currentPlayer.name}. Turno ${this.turn}.`; // Atualiza a mensagem na tela
        console.log(`\n--- Turno ${this.turn} ---`);
        console.log(`É a vez de ${currentPlayer.name}.`);
        
        currentPlayer.drawCard(); 
        updateUI(this); // Atualiza a UI após comprar carta
        
        console.log(`${currentPlayer.name} tem as seguintes cartas na mão:`, currentPlayer.hand.map(c => c.name));
        if(currentPlayer.activePokemon) {
            console.log(`${currentPlayer.name}'s Pokémon Ativo: ${currentPlayer.activePokemon.name} (${currentPlayer.activePokemon.currentHp} HP)`);
        }
        
        console.log('Aguardando ações do jogador...');
       
    }

    nextTurn() {
        if (this.isGameOver) {
            gameMessages.textContent = `FIM DE JOGO! O vencedor é ${this.winner.name}!`;
            console.log(`\n--- FIM DE JOGO! O vencedor é ${this.winner.name}! ---`);
            nextTurnBtn.disabled = true; // Desabilita o botão
            return;
        }
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.startTurn();
    }

    checkKnockout(playerBeingAttacked) {
        if (playerBeingAttacked.activePokemon && playerBeingAttacked.activePokemon.currentHp <= 0) {
            console.log(`${playerBeingAttacked.activePokemon.name} de ${playerBeingAttacked.name} foi NOCAUEADO!`);
            playerBeingAttacked.discardPile.push(playerBeingAttacked.activePokemon); // Mover para descarte
            playerBeingAttacked.activePokemon = null; // Remover do campo ativo
            
            const attackingPlayer = this.players[this.currentPlayerIndex];
            attackingPlayer.knockedOutPokemonCount++;
            console.log(`${attackingPlayer.name} nocauteou ${attackingPlayer.knockedOutPokemonCount} Pokémon.`);

            if (this.checkWinCondition()) {
                this.isGameOver = true;
                this.winner = attackingPlayer;
                return;
            }

            if (playerBeingAttacked.bench.length === 0 && !playerBeingAttacked.activePokemon) {
                console.log(`${playerBeingAttacked.name} não tem mais Pokémon em campo. ${playerBeingAttacked.name} perdeu!`);
                this.isGameOver = true;
                this.winner = attackingPlayer;
            } else {
                console.log(`${playerBeingAttacked.name} deve escolher um novo Pokémon Ativo do banco.`);
            }
        }
    }

    checkWinCondition() {
        const attackingPlayer = this.players[this.currentPlayerIndex];
        return attackingPlayer.knockedOutPokemonCount >= 2;
    }

}

// --- Iniciar o Jogo ---
const game = new Game(['Ash', 'Misty', 'Brock', 'Jessie']);
game.initializeGame().then(() => {
    console.log('Jogo pronto e interface atualizada!');
}).catch(error => {
    console.error('Falha ao iniciar o jogo:', error);
});