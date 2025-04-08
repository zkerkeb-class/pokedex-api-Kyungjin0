import express from 'express';
import Pokemon from '../models/Pokemon.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Routes publiques pour la lecture des Pokémon
router.get('/', async (req, res) => {
  try {
    const pokemons = await Pokemon.find().sort({ id: 1 });
    console.log(`Nombre de Pokémon trouvés : ${pokemons.length}`);
    res.status(200).send({
      types: [
        "fire", "water", "grass", "electric", "ice", "fighting", "poison",
        "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon",
        "dark", "steel", "fairy"
      ],
      pokemons: pokemons
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des Pokémon:", error);
    res.status(500).send({ error: "Erreur lors de la récupération des Pokémon" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ id: parseInt(req.params.id) });
    if (pokemon) {
      res.status(200).send(pokemon);
    } else {
      res.status(404).send({ error: "Pokémon non trouvé" });
    }
  } catch (error) {
    res.status(500).send({ error: "Erreur lors de la récupération du Pokémon" });
  }
});

// Routes protégées pour la modification des Pokémon
router.post('/', verifyToken, async (req, res) => {
  try {
    const newPokemon = new Pokemon(req.body);
    await newPokemon.save();
    res.status(201).send(newPokemon);
  } catch (error) {
    res.status(400).send({ error: "Données Pokémon invalides" });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedPokemon = await Pokemon.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true }
    );
    if (updatedPokemon) {
      res.status(200).send(updatedPokemon);
    } else {
      res.status(404).send({ error: "Pokémon non trouvé" });
    }
  } catch (error) {
    res.status(400).send({ error: "Données Pokémon invalides" });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  console.log('id', req.params.id);
  try {
    const deletedPokemon = await Pokemon.findOneAndDelete({ id: parseInt(req.params.id) });
    if (deletedPokemon) {
      res.status(204).send();
    } else {
      res.status(404).send({ error: "Pokémon non trouvé" });
    }
  } catch (error) {
    res.status(500).send({ error: "Erreur lors de la suppression du Pokémon" });
  }
});

export default router; 