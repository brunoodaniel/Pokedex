import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerVertical, faWeightHanging, faFire, faVenusMars, faStar, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const DetalhesPokemon = ({ pokemon }) => {
  const [speciesData, setSpeciesData] = useState(null);
  const [typeData, setTypeData] = useState([]);
  const [evolutionData, setEvolutionData] = useState([]);
  const [loadingSpecies, setLoadingSpecies] = useState(true);

  useEffect(() => {
    setLoadingSpecies(true);

    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
      .then(response => response.json())
      .then(data => {
        setSpeciesData(data);
        setLoadingSpecies(false);
        fetchEvolutionChain(data.evolution_chain.url);
      })
      .catch(error => {
        console.error('Error fetching Pokémon species details:', error);
        setLoadingSpecies(false);
      });

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`)
      .then(response => response.json())
      .then(data => {
        setTypeData(data.types.map(type => type.type.name));
      })
      .catch(error => {
        console.error('Error fetching Pokémon type details:', error);
      });
  }, [pokemon.id]);

  const fetchEvolutionChain = (url) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const evoChain = [];
        let evoData = data.chain;

        do {
          const evoDetails = evoData['evolution_details'][0];
          evoChain.push({
            species_name: evoData.species.name,
            min_level: !evoDetails ? 1 : evoDetails.min_level,
            trigger_name: !evoDetails ? null : evoDetails.trigger.name,
            item: !evoDetails ? null : evoDetails.item
          });

          evoData = evoData['evolves_to'][0];
        } while (!!evoData && evoData.hasOwnProperty('evolves_to'));

        const promises = evoChain.map(evo =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${evo.species_name}`)
            .then(response => response.json())
        );

        Promise.all(promises).then(results => {
          setEvolutionData(results);
        });
      })
      .catch(error => {
        console.error('Error fetching evolution chain details:', error);
      });
  };

  const imageUrl = pokemon.sprites.other['official-artwork'].front_default;
  const height = pokemon.height / 10;
  const weight = pokemon.weight / 10;

  const getWeaknesses = (types) => {
    const typeWeaknesses = {
      grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
      fire: ['water', 'ground', 'rock'],
      water: ['electric', 'grass'],
    };

    let weaknesses = [];
    types.forEach(type => {
      if (typeWeaknesses[type]) {
        weaknesses = [...weaknesses, ...typeWeaknesses[type]];
      }
    });

    return [...new Set(weaknesses)];
  };

  const getGenderRatio = (rate) => {
    switch (rate) {
      case -1:
        return "Sem gênero";
      case 0:
        return "Apenas macho";
      case 8:
        return "Apenas fêmea";
      default:
        return "Ambos gêneros";
    }
  };

  const data = {
    labels: ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'],
    datasets: [
      {
        label: 'Stats',
        data: pokemon.stats.map(stat => stat.base_stat),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-5">{pokemon.name}</h1>
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <img src={imageUrl} alt={pokemon.name} className="card-img-top" />
          </div>
        </div>
        <div className="col-md-8">
          <div className="bg-light rounded p-4 mb-4">
            <div className="d-flex justify-content-between mb-2">
              <div>
                <p><FontAwesomeIcon icon={faRulerVertical} /> <strong>Altura:</strong> {height} m</p>
                <p><FontAwesomeIcon icon={faWeightHanging} /> <strong>Peso:</strong> {weight} kg</p>
                <p><FontAwesomeIcon icon={faVenusMars} /> <strong>Gênero:</strong> {getGenderRatio(speciesData?.gender_rate)}</p>
              </div>
              {!loadingSpecies && (
                <div>
                  <p><FontAwesomeIcon icon={faFire} /> <strong>Categoria:</strong> {speciesData.genera.find(genus => genus.language.name === 'en').genus}</p>
                  <p><FontAwesomeIcon icon={faStar} /> <strong>Habilidades:</strong> {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
                </div>
              )}
            </div>
            {loadingSpecies && <p>Carregando informações...</p>}
          </div>
          <div className="bg-light rounded p-4">
            <h5><strong>Tipo:</strong></h5>
            <p>{typeData.join(', ')}</p>
            <h5><strong>Fraquezas:</strong></h5>
            <p>{getWeaknesses(typeData).join(', ')}</p>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="bg-light rounded p-4">
            <h5><strong>Stats:</strong></h5>
            <div style={{ height: '200px' }}>
              <Bar data={data} options={options} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="bg-light rounded p-4">
            <h5><strong>Evoluções:</strong></h5>
            <div className="d-flex align-items-center justify-content-around">
              {evolutionData.map((evo, index) => (
                <React.Fragment key={index}>
                  <div className="card m-2" style={{ width: '150px' }}>
                    <img src={evo.sprites.other['official-artwork'].front_default} alt={evo.name} className="card-img-top" />
                    <div className="card-body">
                      <h6 className="card-title text-center">{evo.name}</h6>
                      <p className="text-center">{evo.types.map(type => type.type.name).join(', ')}</p>
                    </div>
                  </div>
                  {index < evolutionData.length - 1 && (
                    <FontAwesomeIcon icon={faArrowRight} size="2x" className="mx-2" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesPokemon;
