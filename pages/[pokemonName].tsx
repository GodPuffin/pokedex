import { IconArrowLeft } from '@tabler/icons-react';
import { Title, Stack, Center, Image, Group, Button, Text, Container, Paper, Badge, Space, SimpleGrid } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { BarChart } from '@mantine/charts';
import React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { DarkThemeToggle } from '@/components/DarkThemeToggle';
import { Links } from '@/components/Links';
import { getTypeColor, formatPokemonName } from '../utils/utils';

const fetchAbilityDetails = async (url: string | URL | Request) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.effect_entries.find((entry: { language: { name: string; }; }) => entry.language.name === 'en').effect;
  } catch (error) {
    return 'Description not available';
  }
};

export async function getServerSideProps(context: { query: { pokemonName: string; }; }) {
  const { pokemonName } = context.query;
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await response.json();

    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.id}`);
    const speciesData = await speciesResponse.json();
    const flavorTextEntry = speciesData.flavor_text_entries.find((entry: { language: { name: string; }; }) => entry.language.name === 'en');

    const abilities = await Promise.all(
      data.abilities.map(async (ability: { ability: { url: string | URL | Request; name: string; }; }) => {
        const details = await fetchAbilityDetails(ability.ability.url);
        return { name: ability.ability.name, details };
      })
    );

    // Fetch Evolution Chain
    const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionChainData = await evolutionChainResponse.json();

    return {
      props: {
        pokemonDetails: data,
        description: flavorTextEntry ? flavorTextEntry.flavor_text.replace(/[\n\f]/g, ' ') : '',
        abilityDetails: abilities,
        evolutionChain: evolutionChainData.chain,
      },
    };
  } catch (error) {
    // console.error("Failed to fetch pokemon data", error);
    return { props: { pokemonDetails: null, description: '', abilityDetails: [] } };
  }
}

const EvolutionTree = ({ evolutionChain }: { evolutionChain: any }) => {
  // Function to recursively process the evolution chain
  const processChain = (chain: any, depth: number = 0) => {
    let evolutions: any[] = [];
    if (chain.species) {
      evolutions.push({
        speciesName: chain.species.name,
        spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${chain.species.url.split('/').slice(-2, -1)[0]}.png`,
        depth,
      });
    }

    if (chain.evolves_to && chain.evolves_to.length) {
      chain.evolves_to.forEach((evolution: any) => {
        evolutions = evolutions.concat(processChain(evolution, depth + 1));
      });
    }

    return evolutions;
  };

  const evolutionData = processChain(evolutionChain);

  return (
    <>
      <Paper p="lg" shadow="xl" radius="lg" withBorder>
        <Title order={3}>Evolution Chain</Title>
        <Group justify="center">
          {evolutionData.map((evolution, index) => (
                <Stack align="center">
                  <Link href={`/${evolution.speciesName}`} key={index} passHref>
                  <Image
                    src={evolution.spriteUrl}
                    alt={formatPokemonName(evolution.speciesName)}
                    style={{ cursor: 'pointer' }}
                  />
                  </Link>
                  <Text size="sm">{formatPokemonName(evolution.speciesName)}</Text>
                </Stack>
          ))}
        </Group>
      </Paper>
    </>
  );
};

const PokemonDetailPage = ({ pokemonDetails, description, abilityDetails, evolutionChain }: { pokemonDetails: any, description: string, abilityDetails: any[], evolutionChain: any }) => {
  if (!pokemonDetails) {
    return (
      <Center>
        <Stack align="center">
          <Title order={2} mt="xl">Pokemon not found</Title>
          <Image
            component={NextImage}
            src="/404.gif" // Replace with your 404 image
            alt="Not found"
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
      </Center>
    );
  }

  const statsData = pokemonDetails.stats.map((stat: { stat: { name: string; }; base_stat: number; }) => ({
    statName: stat.stat.name.replace(/-/g, ' ').replace('special', 'Sp').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value: stat.base_stat,
}));

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
        <Carousel withIndicators maw={500} loop>
            <Carousel.Slide>
              <Image
                src={pokemonDetails.sprites.other.home.front_default}
                alt={`${pokemonDetails.name} Home`}
              />
            </Carousel.Slide>
            {pokemonDetails.sprites.other.home.front_shiny && (
              <Carousel.Slide>
                <Image
                  src={pokemonDetails.sprites.other.home.front_shiny}
                  alt={`${pokemonDetails.name} Shiny Home`}
                />
              </Carousel.Slide>
            )}
            {pokemonDetails.sprites.other.home.front_female && (
              <Carousel.Slide>
                <Image
                  src={pokemonDetails.sprites.other.home.front_female}
                  alt={`${pokemonDetails.name} Female Home`}
                />
              </Carousel.Slide>
            )}
            {pokemonDetails.sprites.other.home.front_shiny_female && (
              <Carousel.Slide>
                <Image
                  src={pokemonDetails.sprites.other.home.front_shiny_female}
                  alt={`${pokemonDetails.name} Shiny Female Home`}
                />
              </Carousel.Slide>
            )}
        </Carousel>
          <Group>
            {pokemonDetails.types.map((type: { type: { name: string; }; }) => (
              <Badge key={type.type.name} color={getTypeColor(type.type.name)} variant="filled" size="xl">
                {type.type.name.toUpperCase()}
              </Badge>
            ))}
          </Group>
          <Text size="lg" mt="md" maw={500}>{description}</Text>
          <Text size="lg" mt="md" maw={500}>Weight: {pokemonDetails.weight / 10} kg</Text>
        </Paper>
        <Paper p="lg" shadow="xl" radius="lg" maw={800} w="100%" withBorder>
        <Title order={3}>Stats</Title>
        <BarChart
          h={300}
          orientation="vertical"
          yAxisProps={{ width: 80 }}
          barProps={{ radius: 10 }}
          data={statsData}
          dataKey="statName"
          series={[{ name: 'value', color: 'var(--mantine-primary-color-filled)' }]}
        />
        </Paper>
        <Paper p="lg" shadow="xl" radius="lg" withBorder maw={800}>
        <Title order={3}>Abilities</Title>
        <SimpleGrid
          cols={{ base: 1, sm: 2 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {abilityDetails.map((ability: { name: string; details: string; }) => (
              <Paper p="lg" shadow="xl" radius="lg" withBorder>
                <Text fw={500} size="lg">{formatPokemonName(ability.name)}</Text>
                <Text size="sm" lineClamp={3}>{ability.details || 'Loading...'}</Text>
              </Paper>
          ))}
        </SimpleGrid>
        </Paper>
        <EvolutionTree evolutionChain={evolutionChain} />
      </Stack>
      <Space h={200} />
    </Container>
  );
};

export default PokemonDetailPage;
