import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Pokemon from '../models/Pokemon.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importData = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect("mongodb+srv://Kyungjin:583962@cluster0.cqj3r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 ", {
      dbName: "PokemonDB",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');

    // Lire le fichier JSON
    const pokemonsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/pokemons.json'), 'utf8')
    );

    // Supprimer toutes les données existantes
    await Pokemon.deleteMany({});
    console.log('🗑️ Données existantes supprimées');

    // Insérer les nouvelles données
    await Pokemon.insertMany(pokemonsData);
    console.log('✅ Données importées avec succès');

    // Fermer la connexion
    await mongoose.connection.close();
    console.log('👋 Connexion fermée');
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error);
    process.exit(1);
  }
};

importData(); 