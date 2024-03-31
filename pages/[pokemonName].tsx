import { Title, Loader, Stack, Center, Image, Group, Button, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { DarkThemeToggle } from '@/components/DarkThemeToggle';

const PokemonDetailPage = () => {
  const router = useRouter();
  const { pokemonName } = router.query;

  const [pokemonDetails, setPokemonDetails] = useState<{ name: string } | null>(null); // Updated type assertion
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pokemonName) return;

    const fetchPokemonDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const data = await response.json();
        setPokemonDetails(data);
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
              <Title order={2} mt="xl">Pokemon named <Text span c="blue" inherit>{pokemonName}</Text> not found</Title>
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
    <div>
      <h1>{pokemonDetails.name}</h1>
      {/* Display detailed information about the Pokémon here */}
    </div>
  );
};

export default PokemonDetailPage;
