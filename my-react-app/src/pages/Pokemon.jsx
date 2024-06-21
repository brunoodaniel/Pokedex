import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import DetalhesPokemon from '../components/DetalhesPokemon'

const Pokemon = () => {
  const { id } = useParams()
  const [pokemonData, setPokemonData] = useState(null)

  // Carrega os detalhes do Pokémon ao montar o componente
  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(response => response.json())
      .then(data => {
        setPokemonData(data)
      })
  }, [id])

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col">
          {pokemonData && <DetalhesPokemon pokemon={pokemonData} />}
        </div>
      </div>
    </div>
  )
}

export default Pokemon
