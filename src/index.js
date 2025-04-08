import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Pokemon from './models/Pokemon.js';
import verifyToken from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import { initializeAdmin } from './utils/initAdmin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const mongoURI = process.env.MONGO_URI; 
mongoose.connect(mongoURI, {
  dbname:"PokemonDB",
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log("✅ [MongoDB] Connexion réussie !");
    console.log(`🌐 Base de données connectée : ${mongoURI.split('@')[1].split('/')[0]}`);
    await initializeAdmin();
  })
  .catch((err) => {
    console.error("❌ [MongoDB] Erreur de connexion :");
    console.error(err);
  });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
//pour les images
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Routes d'authentification
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Routes publiques pour la lecture des Pokémon
app.get("/api/pokemons", async (req, res) => {
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

app.get("/api/pokemons/:id", async (req, res) => {
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
app.post('/api/pokemons', verifyToken, async (req, res) => {
  try {
    const newPokemon = new Pokemon(req.body);
    await newPokemon.save();
    res.status(201).send(newPokemon);
  } catch (error) {
    res.status(400).send({ error: "Données Pokémon invalides" });
  }
});

app.put('/api/pokemons/:id', verifyToken, async (req, res) => {
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

app.delete('/api/pokemons/:id', verifyToken, async (req, res) => {
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

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Pokémon");
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
