import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro';

// Verifica si el usuario tiene un token válido
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer <token>"

  if (!token) return res.status(403).json({ error: 'Acceso denegado: Token requerido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Inyecta { id, rol } en la petición
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Verifica si el usuario tiene el rol de administrador
export const requireAdmin = (req, res, next) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: Se requieren permisos de administrador' });
  }
  next();
};