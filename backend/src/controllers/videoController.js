import { supabase } from '../config/supabaseClient.js';

// Listar todos los videos (Público)
export const getVideos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        id, titulo, descripcion, url_video, thumbnail_url, fecha_subida,
        usuarios ( nombre )
      `)
      .order('fecha_subida', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Subir un nuevo video (Requiere Autenticación)
export const createVideo = async (req, res) => {
  try {
    const { titulo, descripcion, url_video, thumbnail_url } = req.body;
    const usuario_id = req.user.id; // Obtenido del JWT

    const { data, error } = await supabase
      .from('videos')
      .insert([{ titulo, descripcion, url_video, thumbnail_url, usuario_id }])
      .select();

    if (error) throw error;
    res.status(201).json({ message: 'Video publicado exitosamente', video: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un video (Requiere ser Admin)
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Video eliminado correctamente por administración' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};