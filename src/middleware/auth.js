import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

    try {
        console.log('token', token);
        const verified = jwt.verify(token, 'coucou');
        req.user = verified;
        next();
    } catch (error) {
        console.log(error);

        res.status(401).json({ message: 'Token invalide' });
    }
};

export default verifyToken; 