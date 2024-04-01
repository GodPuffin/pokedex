import React, { useState, useEffect } from 'react';
import { Card, Image, Text, Badge, Button, Group, LoadingOverlay } from '@mantine/core';
import { useRouter } from 'next/router';
import { getTypeColor, formatPokemonName } from '../../utils/utils';

interface Pokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: { other: { 'home': { front_default: string } } };
}

interface PokeCardProps {
  name: string;
}

const PokeCard: React.FC<PokeCardProps> = ({ name }) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleViewMoreClick = () => {
    router.push(`/${name.toLowerCase()}`);
  };

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        const data: Pokemon = await response.json();
        setPokemon(data);

        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.id}`);
        const speciesData = await speciesResponse.json();
        const flavorTextEntry = speciesData.flavor_text_entries.find((entry: any) => entry.language.name === 'en');
        setDescription(flavorTextEntry ? flavorTextEntry.flavor_text : '');
      } catch (error) {
        // console.error('Failed to fetch Pokémon data:', error);
      }
      setLoading(false);
    };

    fetchPokemon();
  }, [name]);

  return (
    <div style={{ width: 300, minHeight: 335 }}>
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <LoadingOverlay visible={loading} transitionProps={{ transition: 'fade', duration: 1 }} loaderProps={{ type: 'dots' }} />
      {pokemon && (
        <>
          <Card.Section>
            <Image
              loading="lazy"
              src={pokemon.sprites.other.home.front_default}
              h={150}
              alt={pokemon.name}
              style={{ objectFit: 'contain' }}
            />
          </Card.Section>

          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>{formatPokemonName(pokemon.name)}</Text>
            <Group>
              {pokemon.types.map((typeInfo) => (
                <Badge key={typeInfo.type.name} color={getTypeColor(typeInfo.type.name)}>
                  {typeInfo.type.name.toUpperCase()}
                </Badge>
              ))}
            </Group>
          </Group>

          <Text size="sm" c="dimmed">
            {description.replace(/[\n\f]/g, ' ')}
          </Text>

          <Button fullWidth mt="md" radius="md" onClick={handleViewMoreClick}>
            View more
          </Button>
        </>
      )}
    </Card>
    </div>
  );
};

export default PokeCard;
