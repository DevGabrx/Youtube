import { supabase } from '../config/supabaseClient.js';

// ==========================================
// CRUD USUARIO ESTÁNDAR (Mi Perfil)
// ==========================================

// Obtener datos de mi propio perfil
export const getMyProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, fecha_creacion')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar mi propio perfil (nombre o email)
export const updateMyProfile = async (req, res) => {
  try {
    const { nombre, email } = req.body;
    
    const { data, error } = await supabase
      .from('usuarios')
      .update({ nombre, email })
      .eq('id', req.user.id)
      .select('id, nombre, email, rol');

    if (error) throw error;
    res.json({ message: 'Perfil actualizado', user: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar mi propia cuenta
export const deleteMyAccount = async (req, res) => {
  try {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Tu cuenta ha sido eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// CRUD ADMINISTRATIVO
// ==========================================

// Listar todos los usuarios registrados
export const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, fecha_creacion')
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar la cuenta de cualquier usuario
export const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Protección para evitar que el admin se borre a sí mismo por accidente
    if (id === req.user.id) {
      return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta desde el panel de administración' });
    }

    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Usuario eliminado correctamente por el administrador' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};