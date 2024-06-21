import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Pokedex from './pages/Pokedex'
import Pokemon from './pages/Pokemon'

const App = () => {
  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:id" element={<Pokemon />} />
        </Routes>
      </div>
    </Router>
  )
}

const Home = () => {
  return (
    <>
      <h1 className="text-center mb-5">Pokédex</h1>
      <Pokedex />
    </>
  )
}

export default App
