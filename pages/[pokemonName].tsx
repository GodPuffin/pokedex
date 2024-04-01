import { IconArrowLeft } from '@tabler/icons-react';
import { Title, Loader, Stack, Center, Image, Group, Button, Text, Container, Paper, Card, Badge } from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { DarkThemeToggle } from '@/components/DarkThemeToggle';
import { Links } from '@/components/Links';
import { getTypeColor, formatPokemonName } from '../utils/utils';

interface PokemonDetails {
  name: string;
  types: { type: { name: string } }[];
  sprites: {
    other: {
      home: {
        front_default: string;
        front_shiny: string;
      };
      showdown: {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  abilities: { ability: { name: string, url: string } }[];
  stats: { base_stat: number, stat: { name: string } }[];
}

const PokemonDetailPage = () => {
  const router = useRouter();
  const { pokemonName } = router.query;

  const [loading, setLoading] = useState(false);
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);
  const [description, setDescription] = useState('');
  const [abilityDescriptions, setAbilityDescriptions] = useState<{ [key: string]: string }>({});

  const fetchAbilityDetails = async (url: string) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.effect_entries.find((entry: { language: { name: string } }) => entry.language.name === 'en').effect;
    } catch (error) {
      return 'Description not available';
    }
  };

  useEffect(() => {
    if (!pokemonName) return;

    const fetchPokemonDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const data = await response.json();
        setPokemonDetails(data);

        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.id}`);
        const speciesData = await speciesResponse.json();
        const flavorTextEntry = speciesData.flavor_text_entries.find((entry: { language: { name: string; }; }) => entry.language.name === 'en');
        setDescription(flavorTextEntry ? flavorTextEntry.flavor_text.replace(/[\n\f]/g, ' ') : '');

        data.abilities.forEach(async (ability: { ability: { url: string; name: any; }; }) => {
          const details = await fetchAbilityDetails(ability.ability.url);
          setAbilityDescriptions(prev => ({ ...prev, [ability.ability.name]: details }));
        });
      } catch (error) {
        // Handle error
      }
      setLoading(false);
    };

    fetchPokemonDetails();
  }, [pokemonName]);

  if (loading) {
    return <Stack h={300} justify="center" align="center">
              <Loader type="dots" size="xl" />
              <Title order={1}>Loading {pokemonName}`&apos;`s info</Title>
           </Stack>;
  }

  if (!pokemonDetails) {
    return <Center>
              <Stack align="center">
              <Title order={2} mt="xl">Pokemon named <Text span color="blue" inherit>{pokemonName}</Text> not found</Title>
                <Image
                  component={NextImage}
                  src="/404.gif"
                  alt="Squirtle crying"
                  radius="md"
                  width={400}
                  height={400}
                />
                <Group>
                    <Button
                      component={Link}
                      href="/"
                      variant="filled"
                      color="blue"
                      size="md"
                    >
                        Go back home
                    </Button>
                    <DarkThemeToggle />
                </Group>
              </Stack>
           </Center>;
  }

  return (
    <Container size="xl">
      <Group justify="space-between" m={20}>
        <Button
          component={Link}
          href="/"
          variant="filled"
          color="blue"
          size="md"
          leftSection={<IconArrowLeft />}
        >
            Go back home
        </Button>
        <Links />
      </Group>
      <Stack justify="center" align="center">
        <Title fw={800} size={50} mt={50} order={1}>
          <Text
            inherit
            variant="gradient"
            component="span"
            gradient={{
              from: getTypeColor(pokemonDetails.types[0].type.name),
              to: pokemonDetails.types.length > 1 ? getTypeColor(pokemonDetails.types[1].type.name) : getTypeColor(pokemonDetails.types[0].type.name),
            }}
          >
            {formatPokemonName(pokemonDetails.name)}
          </Text>
        </Title>
        <Paper p="lg" shadow="xl" radius="lg" withBorder>
          <Image
            src={pokemonDetails.sprites.other.home.front_default}
            alt={pokemonDetails.name}
            style={{ objectFit: 'contain' }}
          />
          <Group>
            {pokemonDetails.types.map((type) => (
              <Badge key={type.type.name} color={getTypeColor(type.type.name)} variant="filled" size="xl">
                {type.type.name.toUpperCase()}
              </Badge>
            ))}
          </Group>
          <Text size="lg" mt="md">{description}</Text>
        </Paper>
        <Group>
            {pokemonDetails.abilities.map((ability) => (
              <div style={{ width: 400 }} key={ability.ability.name}>
              <Card key={ability.ability.name}>
                <Text fw={500} size="lg">{formatPokemonName(ability.ability.name)}</Text>
                <Text size="sm">{abilityDescriptions[ability.ability.name] || 'Loading...'}</Text>
              </Card>
              </div>
            ))}
        </Group>
      </Stack>
    </Container>
  );
};

export default PokemonDetailPage;
