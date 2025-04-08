import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';

const DEFAULT_ADMIN = {
    username: 'admin',
    password: 'admin123'
};

export const initializeAdmin = async () => {
    try {
        // Vérifier si un admin existe déjà
        const adminExists = await Admin.findOne({});
        if (!adminExists) {
            // Hash du mot de passe
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, salt);

            // Création de l'admin
            const admin = new Admin({
                username: DEFAULT_ADMIN.username,
                password: hashedPassword
            });

            await admin.save();
            console.log('✅ Compte admin créé avec succès');
            console.log('Username:', DEFAULT_ADMIN.username);
            console.log('Password:', DEFAULT_ADMIN.password);
        } else {
            console.log('ℹ️ Le compte admin existe déjà');
        }
    } catch (error) {
        console.error('❌ Erreur lors de la création du compte admin:', error);
    }
}; 