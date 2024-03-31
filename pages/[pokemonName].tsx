import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

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
    return <p>Loading...</p>; // Or a loading spinner
  }

  if (!pokemonDetails) {
    return <p>Pokémon not found</p>;
  }

  return (
    <div>
      <h1>{pokemonDetails.name}</h1>
      {/* Display detailed information about the Pokémon here */}
    </div>
  );
};

export default PokemonDetailPage;
