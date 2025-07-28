// assets/js/card-models.js

/**
 * Classe base para todas as cartas do jogo.
 */
class Card {
    constructor(id, name, cardType) {
        this.id = id; // Ex: "P001", "E001", "T001"
        this.name = name; // Nome da carta (ex: "Pikachu", "Energia de Fogo", "Poção")
        this.cardType = cardType; // Tipo geral da carta (ex: "pokemon", "energia", "treinador")
    }
}

/**
 * Representa um Pokémon Básico.
 * Herda de Card.
 */
class BasicPokemonCard extends Card {
    constructor(id, name, hp, pokemonType, attackName, attackDamage, attackCost, apiId) {
        super(id, name, "pokemon");
        this.hp = hp; // Pontos de Vida Máximos
        this.pokemonType = pokemonType; // Tipo específico do Pokémon (ex: "Eletrico", "Fogo", "Agua")
        this.attackName = attackName; // Nome do ataque
        this.attackDamage = attackDamage; // Dano que o ataque causa
        this.attackCost = attackCost; // Objeto de custo de energia (ex: { eletrico: 1, incolor: 1 })
        this.apiId = apiId; // ID do Pokémon na PokeAPI (ex: 25 para Pikachu)
        this.imageUrl = ''; // URL da imagem, que será preenchida pela API

        // Atributos de Jogo (não salvos nas definições da carta, mas úteis para instâncias em jogo)
        this.currentHp = hp; // HP atual durante o jogo
        this.attachedEnergies = []; // Array para armazenar energias anexadas (ex: [{ type: "Fogo" }, { type: "Incolor" }])
        this.isBasic = true; // Indica que é um Pokémon Básico
        this.evolvesFrom = null; // Pokémon Básico não evolui de nada
    }
}

/**
 * Representa um Pokémon de Estágio 1 (Evolução).
 * Herda de BasicPokemonCard para compartilhar propriedades de batalha.
 */
class EvolutionPokemonCard extends BasicPokemonCard {
    constructor(id, name, hp, pokemonType, evolvesFrom, attackName, attackDamage, attackCost, apiId) {
        // 'super' chama o construtor da classe pai (BasicPokemonCard)
        super(id, name, hp, pokemonType, attackName, attackDamage, attackCost, apiId); 
        this.evolvesFrom = evolvesFrom; // Nome do Pokémon Básico que ele evolui (ex: "Pikachu" para "Raichu")
        this.isBasic = false; // Indica que é uma evolução
    }
}

/**
 * Representa uma carta de Energia.
 * Herda de Card.
 */
class EnergyCard extends Card {
    constructor(id, name, energyType) {
        super(id, name, "energia");
        this.energyType = energyType; // Tipo de energia (ex: "Eletrico", "Fogo", "Agua", "Incolor")
    }
}

/**
 * Representa uma carta de Treinador (Item).
 * Herda de Card.
 */
class TrainerCard extends Card {
    constructor(id, name, effectDescription, effectFunction) {
        super(id, name, "treinador");
        this.effectDescription = effectDescription; // Descrição textual do efeito
        // effectFunction: uma função JS que será executada para o efeito (passa o 'game' e 'player' como argumentos)
        // Por enquanto, é um console.log. A lógica real virá depois.
        this.effectFunction = effectFunction; 
    }
}

// Exportar todas as classes para que possam ser usadas em outros arquivos JS
export { Card, BasicPokemonCard, EvolutionPokemonCard, EnergyCard, TrainerCard };