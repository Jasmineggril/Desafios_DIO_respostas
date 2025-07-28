// assets/js/poke-image-api.js

export const pokeImageApi = {
   async getPokemonImageUrl(pokemonId) {
       const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
       try {
           const response = await fetch(url);
           if (!response.ok) {
               console.error(`Erro ao buscar detalhes do Pokémon ${pokemonId}: ${response.status}`);
               return null;
           }
           const data = await response.json();

           // Tenta pegar a arte oficial (artwork)
           if (data.sprites.other['official-artwork'] && data.sprites.other['official-artwork'].front_default) {
               return data.sprites.other['official-artwork'].front_default;
           }

           // Se a arte oficial não estiver disponível, usa o sprite frontal padrão
           if (data.sprites.front_default) {
               return data.sprites.front_default;
           }

           console.warn(`Nenhuma imagem encontrada para o Pokémon ${pokemonId}`);
           return null;

       } catch (error) {
           console.error(`Erro ao buscar imagem do Pokémon ${pokemonId}:`, error);
           return null;
       }
   }
};