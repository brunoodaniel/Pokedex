import React from 'react'
import { Link } from 'react-router-dom'

const CartaoPokemon = ({ pokemon }) => {
  const pokemonId = pokemon.url.split('/')[6]

  return (
    <div className="card mb-4" style={{ maxWidth: '380px' }}>
      <div className="row-gutters align-items-center">
        <div className="text-center">
          <Link to={`/pokemon/${pokemonId}`}>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`}
              alt={pokemon.name}
              className="img-fluid"
            />
          </Link>
          <h5 className="card-title mt-2">{pokemon.name}</h5>
        </div>
      </div>
    </div>
  )
}

export default CartaoPokemon
