// filepath: c:\Users\akrz3\Desktop\ING4\S2\Pokemon\BackEnd\pokedex-api-Kyungjin0\src\routes\pokemon.js
import express from 'express';
import Pokemon from '../models/Pokemon.js';

const router = express.Router();

// Exemple de route GET pour récupérer tous les Pokémon
router.get('/', async (req, res) => {
  try {
    const pokemons = await Pokemon.find();
    res.status(200).json(pokemons);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des Pokémon' });
  }
});

export default router;