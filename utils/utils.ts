export const getTypeColor = (typeName: string): string => {
    const typeColorMap: { [key: string]: string } = {
        fire: 'red',
        water: 'blue',
        grass: 'green',
        electric: 'yellow',
        psychic: 'pink',
        ice: 'cyan',
        dragon: 'violet',
        ghost: 'purple',
        steel: 'darkgray',
        bug: 'lime',
        rock: 'saddlebrown',
        fighting: 'darkred',
        ground: 'tan',
        poison: 'grape',
        flying: 'indigo',
        fairy: 'lightpink',
        dark: 'black',
        // Add more mappings as needed
      };
      return typeColorMap[typeName] || 'lightgray';
};

export const formatPokemonName = (name: string) => name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
