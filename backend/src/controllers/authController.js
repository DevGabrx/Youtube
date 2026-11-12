import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabaseClient.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro';

// Registro de Usuario
export const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // 1. Validar que el usuario no exista
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // 2. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Crear usuario (usamos un ID ficticio o delegamos en auth.users si usáramos la API completa de Supabase Auth)
    // Para simplificar el MVP con la tabla que creamos:
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        { 
          id: crypto.randomUUID(), // Genera un UUID v4
          nombre, 
          email, 
          password_hash, 
          rol: rol || 'user' 
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login de Usuario
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 2. Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3. Generar JWT
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};