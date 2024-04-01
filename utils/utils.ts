export const getTypeColor = (typeName: string): string => {
    const typeColorMap: { [key: string]: string } = {
        fire: 'red',
        water: 'blue',
        grass: 'green',
        electric: 'yellow',
        psychic: 'grape',
        ice: 'cyan',
        dragon: 'violet',
        ghost: 'purple',
        steel: 'black',
        bug: 'lime',
        rock: 'dark',
        fighting: 'darkred',
        ground: 'tan',
        poison: 'teal',
        flying: 'indigo',
        fairy: 'pink',
        // Add more mappings as needed
      };
      return typeColorMap[typeName] || 'gray';
};

export const formatPokemonName = (name: string) => name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
