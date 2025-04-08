import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'Nom d\'utilisateur déjà utilisé' });
        }

        // Créer un nouvel utilisateur
        const user = new User({
            username,
            password,
            collection: []
        });

        await user.save();

        // Générer le token
        const token = jwt.sign(
            { _id: user._id, role: 'user' },
            'coucou',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Connexion
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Trouver l'utilisateur
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        // Générer le token
        const token = jwt.sign(
            { _id: user._id, role: 'user' },
            'coucou',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir la collection de l'utilisateur
router.get('/collection', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('collection');
        res.json(user.collection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ajouter un Pokémon à la collection
router.post('/collection/:pokemonId', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const pokemonId = parseInt(req.params.pokemonId);

        // Vérifier si le Pokémon n'est pas déjà dans la collection
        if (user.collection.some(p => p.pokemonId === pokemonId)) {
            return res.status(400).json({ message: 'Ce Pokémon est déjà dans votre collection' });
        }

        user.collection.push({ pokemonId });
        await user.save();

        res.status(201).json(user.collection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Supprimer un Pokémon de la collection
router.delete('/collection/:pokemonId', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const pokemonId = parseInt(req.params.pokemonId);

        user.collection = user.collection.filter(p => p.pokemonId !== pokemonId);
        await user.save();

        res.json(user.collection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 