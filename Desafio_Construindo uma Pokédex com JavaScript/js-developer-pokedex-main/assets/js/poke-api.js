// assets/js/poke-api.js

// Importe a classe Pokemon do pokemon-model.js para ser usada aqui
import { Pokemon } from './pokemon-model.js'; // Adicione esta linha

const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon() // Aqui usa a classe Pokemon do arquivo importado
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    // Usando a imagem de artwork oficial, que é mais bonita para detalhes
    pokemon.photo = pokeDetail.sprites.other['official-artwork'].front_default || pokeDetail.sprites.front_default;

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    // Esta função recebe um objeto com 'url'. No nosso caso, queremos buscar pelo ID.
    // Vamos adaptar para buscar pelo ID ou nome, se preferir.
    // Para nosso uso, vamos criar uma nova função que busca detalhes pelo ID
    console.warn("pokeApi.getPokemonDetail(pokemon) original da Pokedex está sendo chamado. Considere usar getPokemonDetailsById ou similar.");
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

// NOVA FUNÇÃO: Para buscar detalhes completos de um Pokémon pelo ID
pokeApi.getPokemonDetailsById = async (pokemonId) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao buscar detalhes do Pokémon ${pokemonId}: ${response.statusText}`);
        }
        const data = await response.json();
        return convertPokeApiDetailToPokemon(data); // Converte para o modelo Pokemon original
    } catch (error) {
        console.error('Erro ao buscar detalhes completos do Pokémon:', error);
        return null;
    }
};


pokeApi.getPokemons = (offset = 0, limit = 5) => {
    // Esta função é da listagem da Pokédex, não será usada diretamente no jogo de cartas
    // mas a manteremos aqui.
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

// Exporta o objeto pokeApi para que main.js possa usá-lo
export { pokeApi };