import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectMongoDB } from './utils/mongodb.js';
import { initializeAdmin } from './utils/initAdmin.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import pokemonRoutes from './routes/pokemonRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connexion à MongoDB et initialisation de l'admin
connectMongoDB().then(async () => {
  await initializeAdmin();
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pokemons', pokemonRoutes);

// Route de base
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Pokémon");
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
