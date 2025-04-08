import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: {
    french: { type: String, required: true },
    english: { type: String, required: true }
  },
  type: [{ type: String, required: true }],
  base: {
    HP: { type: Number, required: true },
    Attack: { type: Number, required: true },
    Defense: { type: Number, required: true },
    Speed: { type: Number, required: true },
     
    SpAttack: { type: Number, required: true },
    SpDefense: { type: Number, required: true }
    
  },
  image: { type: String }
});

export default mongoose.model('Pokemon', pokemonSchema); 