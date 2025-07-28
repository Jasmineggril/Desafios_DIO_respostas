// assets/js/card-data.js

// Importa as classes de cartas que definimos
import { BasicPokemonCard, EvolutionPokemonCard, EnergyCard, TrainerCard } from './card-models.js';

// --- Cartas de Pokémon Básico (10) ---
const p001 = new BasicPokemonCard('P001', 'Pikachu', 60, 'Eletrico', 'Choque do Trovão', 20, { eletrico: 1 }, 25); // ID do Pikachu é 25
const p002 = new BasicPokemonCard('P002', 'Charmander', 70, 'Fogo', 'Brasas', 10, { fogo: 1 }, 4); // ID do Charmander é 4
const p003 = new BasicPokemonCard('P003', 'Squirtle', 60, 'Agua', 'Jato de Água', 20, { agua: 1 }, 7); // ID do Squirtle é 7
const p004 = new BasicPokemonCard('P004', 'Bulbasaur', 70, 'Grama', 'Chicotada', 10, { grama: 1 }, 1); // ID do Bulbasaur é 1
const p005 = new BasicPokemonCard('P005', 'Jigglypuff', 80, 'Fada', 'Canção de Ninar', 10, { incolor: 1 }, 39);
const p006 = new BasicPokemonCard('P006', 'Meowth', 60, 'Incolor', 'Arranhão', 20, { incolor: 1 }, 52);
const p007 = new BasicPokemonCard('P007', 'Abra', 50, 'Psiquico', 'Confusão', 10, { psiquico: 1 }, 63);
const p008 = new BasicPokemonCard('P008', 'Geodude', 80, 'Pedra', 'Ataque de Pedra', 20, { pedra: 1 }, 74);
const p009 = new BasicPokemonCard('P009', 'Onix', 100, 'Pedra', 'Esmagar', 30, { pedra: 2, incolor: 1 }, 95);
const p010 = new BasicPokemonCard('P010', 'Magikarp', 30, 'Agua', 'Salpicar', 0, { agua: 1 }, 129);


// --- Cartas de Evolução (Estágio 1) (5) ---
const e001 = new EvolutionPokemonCard('E001', 'Raichu', 120, 'Eletrico', 'Pikachu', 'Trovão', 80, { eletrico: 2, incolor: 1 }, 26); // ID do Raichu é 26
const e002 = new EvolutionPokemonCard('E002', 'Charmeleon', 100, 'Fogo', 'Charmander', 'Garras de Fogo', 50, { fogo: 2 }, 5); // ID do Charmeleon é 5
const e003 = new EvolutionPokemonCard('E003', 'Wartortle', 100, 'Agua', 'Squirtle', 'Torção da Concha', 40, { agua: 2 }, 8); // ID do Wartortle é 8
const e004 = new EvolutionPokemonCard('E004', 'Ivysaur', 110, 'Grama', 'Bulbasaur', 'Folha Navalha', 40, { grama: 2 }, 2); // ID do Ivysaur é 2
const e005 = new EvolutionPokemonCard('E005', 'Gyarados', 150, 'Agua', 'Magikarp', 'Fúria do Dragão', 100, { agua: 3, incolor: 1 }, 130);


// --- Cartas de Energia (3 tipos únicos) ---
const en001 = new EnergyCard('EN001', 'Energia de Fogo', 'fogo');
const en002 = new EnergyCard('EN002', 'Energia de Água', 'agua');
const en003 = new EnergyCard('EN003', 'Energia de Grama', 'grama');


// --- Cartas de Treinador/Item (5) ---
const t001 = new TrainerCard('T001', 'Poção', 'Cura 30 HP de 1 dos seus Pokémon.', (game, player) => {
    console.log(`${player.name} usou Poção. (Lógica de cura a ser implementada)`);
});
const t002 = new TrainerCard('T002', 'Pesquisa do Professor', 'Descarte sua mão e compre 7 cartas novas.', (game, player) => {
    console.log(`${player.name} usou Pesquisa do Professor. (Lógica de descarte e compra a ser implementada)`);
});
const t003 = new TrainerCard('T003', 'Bola de Nível', 'Procure no seu baralho por 1 Pokémon Básico com até 60 HP e coloque-o na sua mão.', (game, player) => {
    console.log(`${player.name} usou Bola de Nível. (Lógica de busca no baralho a ser implementada)`);
});
const t004 = new TrainerCard('T004', 'Troca', 'Troque seu Pokémon Ativo por um dos Pokémon no seu Banco.', (game, player) => {
    console.log(`${player.name} usou Troca. (Lógica de troca de Pokémon a ser implementada)`);
});
const t005 = new TrainerCard('T005', 'Captura de Energia', 'Olhe as 3 primeiras cartas do seu baralho. Se encontrar uma Energia, anexe-a a um dos seus Pokémon.', (game, player) => {
    console.log(`${player.name} usou Captura de Energia. (Lógica de busca e anexo de energia a ser implementada)`);
});


// Exporta todas as cartas únicas como um array para serem usadas no main.js
export const ALL_GAME_CARDS = [
    p001, p002, p003, p004, p005, p006, p007, p008, p009, p010, // 10 Básicos
    e001, e002, e003, e004, e005, // 5 Evoluções
    en001, en002, en003, // 3 Tipos de Energia únicos
    t001, t002, t003, t004, t005 // 5 Treinadores
];
// Total: 10 + 5 + 3 + 5 = 23 cartas únicas