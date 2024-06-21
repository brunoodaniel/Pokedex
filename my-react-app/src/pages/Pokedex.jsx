import React, { useState, useEffect } from 'react'
import CartaoPokemon from '../components/CartaoPokemon'

const Pokedex = () => {
  const [listaPokemon, setListaPokemon] = useState([])

  // Carrega a lista de Pokémons ao montar o componente
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=57')
      .then(response => response.json())
      .then(data => {
        setListaPokemon(data.results)
      })
  }, [])

  return (
    <div className="container">
      <div className="row justify-content-center">
        {listaPokemon.map((pokemon, index) => (
          <div className="col-md-4 mb-4 mx-auto" key={index}>
            <CartaoPokemon pokemon={pokemon} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pokedex
