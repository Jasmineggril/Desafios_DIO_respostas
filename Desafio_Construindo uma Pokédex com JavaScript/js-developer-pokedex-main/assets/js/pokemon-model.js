// assets/js/pokemon-model.js

class Pokemon {
    number;
    name;
    type;
    types = [];
    photo;
    // Adicione mais atributos se quiser mais detalhes da PokeAPI
    height; 
    weight;
    abilities = [];
    stats = [];
}

// Exporta a classe Pokemon
export { Pokemon };