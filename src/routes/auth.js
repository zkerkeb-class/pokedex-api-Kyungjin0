import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

// Route pour créer un admin (à utiliser une seule fois pour créer le compte admin)
router.post('/register', async (req, res) => {
    try {
        // Vérifier si un admin existe déjà
        const adminExists = await Admin.findOne({});
        if (adminExists) {
            return res.status(400).json({ message: 'Un admin existe déjà' });
        }

        // Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Création de l'admin
        const admin = new Admin({
            username: req.body.username,
            password: hashedPassword
        });

        const savedAdmin = await admin.save();
        res.status(201).json({ message: 'Admin créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    try {
        // Vérifier si l'admin existe
        const admin = await Admin.findOne({ username: req.body.username });
        if (!admin) {
            return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(req.body.password, admin.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        // Créer et assigner un token
        const token = jwt.sign(
            { _id: admin._id },
            'coucou',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            message: 'Connexion réussie'
        });
    } catch (error) {
        console.error('Erreur de connexion:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
    }
});

// Route pour vérifier si le token est valide
router.get('/verify', async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ valid: false });
    }

    try {
        jwt.verify(token, 'coucou');
        res.json({ valid: true });
    } catch (error) {
        res.status(401).json({ valid: false });
    }
});

export default router; 