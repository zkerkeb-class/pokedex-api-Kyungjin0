import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      dbname: "PokemonDB",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ [MongoDB] Connexion réussie !");
    console.log(`🌐 Base de données connectée : ${mongoURI.split('@')[1].split('/')[0]}`);
  } catch (err) {
    console.error("❌ [MongoDB] Erreur de connexion :");
    console.error(err);
    process.exit(1);
  }
}; 