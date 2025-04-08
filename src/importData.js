import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pokemon from './models/Pokemon.js';
import pokemons from './data/pokemons.json' assert { type: "json" };

dotenv.config();

const mongoURI = process.env.MONGO_URI;

async function importData() {
  try {
    await mongoose.connect(mongoURI, {
      dbname: "PokemonDB",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Supprimer les données existantes
    await Pokemon.deleteMany({});

    // Importer les nouvelles données
    for (const pokemon of pokemons) {
      // Restructurer les stats spéciales
      const base = {
        ...pokemon.base,
        Sp: {
          Attack: pokemon.base["Sp. Attack"],
          Defense: pokemon.base["Sp. Defense"]
        }
      };
      delete base["Sp. Attack"];
      delete base["Sp. Defense"];

      const newPokemon = new Pokemon({
        ...pokemon,
        base
      });
      await newPokemon.save();
    }

    console.log("✅ Données importées avec succès !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de l'importation des données:", error);
    process.exit(1);
  }
}

importData(); 