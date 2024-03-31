import React, { useState, useEffect } from 'react';
import { IconSearch, IconArrowUp, IconBrandGithub, IconWorld } from '@tabler/icons-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Container, Flex, Loader, Center, Select, TextInput, Stack, Title, Group, Affix, Button, Transition, rem, ActionIcon } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import PokeCard from '@/components/Card/PokeCard';
import { DarkThemeToggle } from '@/components/DarkThemeToggle';

interface PokemonBasicInfo {
  name: string;
  id: number;
  weight: number;
}

const HomePage: React.FC = () => {
  const [pokemonData, setPokemonData] = useState<PokemonBasicInfo[]>([]);
  const [displayList, setDisplayList] = useState<PokemonBasicInfo[]>([]);
  const [loadedIndices, setLoadedIndices] = useState<number>(20);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('idAsc');
  const [isLoading, setIsLoading] = useState(true);
  const [scroll, scrollTo] = useWindowScroll();

  const fetchInitialPokemonData = async () => {
    setIsLoading(true);
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=905'); // up gen 8
    const data = await response.json();

    const pokemonBasicInfo = await Promise.all(
      data.results.map(async (pokemon: { url: string | URL | Request; }) => {
        const detailsResponse = await fetch(pokemon.url);
        const detailsData = await detailsResponse.json();
        return {
          name: detailsData.name,
          id: detailsData.id,
          weight: detailsData.weight,
        };
      })
    );

    setPokemonData(pokemonBasicInfo);
    setDisplayList(pokemonBasicInfo);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInitialPokemonData();
  }, []);

  const sortData = () => {
    const sortedData = [...pokemonData];
    switch (sortOrder) {
      case 'nameAsc':
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        sortedData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'idAsc':
        sortedData.sort((a, b) => a.id - b.id);
        break;
      case 'idDesc':
        sortedData.sort((a, b) => b.id - a.id);
        break;
      case 'weightAsc':
        sortedData.sort((a, b) => a.weight - b.weight);
        break;
      case 'weightDesc':
        sortedData.sort((a, b) => b.weight - a.weight);
        break;
      default:
        break;
    }
    setDisplayList(sortedData);
  };

  useEffect(() => {
    sortData();
  }, [sortOrder, pokemonData]);

  useEffect(() => {
    const filteredData = pokemonData.filter(pokemon =>
      pokemon.name.toLowerCase().includes(search.toLowerCase())
    );
    setDisplayList(filteredData);
  }, [search, pokemonData]);

  const fetchMoreData = () => {
    setLoadedIndices(prev => Math.min(prev + 20, displayList.length));
  };

  if (isLoading) {
    return <Stack h={300} justify="center" align="center">
              <Loader type="dots" size="xl" />
              <Title order={1}>Loading Pokémons...</Title>
           </Stack>;
}

  return (
    <Container size="xl">
      <Group justify="space-between">
        <Group m={20}>
          <TextInput
            placeholder="Search Pokémon by name..."
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            mb="md"
            leftSection={<IconSearch />}
          />
          <Select
            placeholder="Sort by"
            value={sortOrder}
            onChange={(value) => setSortOrder(value || 'idAsc')}
            data={[
              { value: 'nameAsc', label: 'Name A-Z' },
              { value: 'nameDesc', label: 'Name Z-A' },
              { value: 'idAsc', label: 'ID Ascending' },
              { value: 'idDesc', label: 'ID Descending' },
              { value: 'weightAsc', label: 'Weight Ascending' },
              { value: 'weightDesc', label: 'Weight Descending' },
            ]}
            mb="md"
          />
        </Group>
        <Group justify="flex-end" gap="xs">
        <DarkThemeToggle />
          <ActionIcon
            component="a"
            href="https://github.com/GodPuffin"
            target="_blank"
            variant="light"
          >
            <IconBrandGithub />
          </ActionIcon>
          <ActionIcon
            component="a"
            href="https://web-puffinprojects.vercel.app/"
            target="_blank"
            variant="light"
          >
            <IconWorld />
          </ActionIcon>
        </Group>
      </Group>
      <InfiniteScroll
        dataLength={loadedIndices}
        next={fetchMoreData}
        hasMore={loadedIndices < displayList.length}
        loader={<Center h={200}><Loader type="dots" /></Center>}
      >
        <Flex
          gap="sm"
          justify="center"
          align="flex-start"
          direction="row"
          wrap="wrap"
        >
          {displayList.slice(0, loadedIndices).map((pokemon, index) => (
            <PokeCard key={index} name={pokemon.name} />
          ))}
        </Flex>
      </InfiniteScroll>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <Button
              leftSection={<IconArrowUp style={{ width: rem(16), height: rem(16) }} />}
              style={transitionStyles}
              onClick={() => scrollTo({ y: 0 })}
            >
              Scroll to top
            </Button>
          )}
        </Transition>
      </Affix>
    </Container>
  );
};

export default HomePage;
