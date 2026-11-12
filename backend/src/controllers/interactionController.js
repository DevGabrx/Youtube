import { supabase } from '../config/supabaseClient.js';

// Listar comentarios de un video específico
export const getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { data, error } = await supabase
      .from('interacciones')
      .select(`
        id, texto, fecha,
        usuarios ( nombre )
      `)
      .eq('video_id', videoId)
      .order('fecha', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Guardar un nuevo comentario
export const createComment = async (req, res) => {
  try {
    const { texto, video_id, usuario_id } = req.body;

    // Si el frontend aún no envía usuario_id por sesión, buscamos el primer usuario disponible en la BD para que no falle la llave foránea
    let finalUserId = usuario_id;
    if (!finalUserId) {
      const { data: users } = await supabase.from('usuarios').select('id').limit(1);
      finalUserId = users?.[0]?.id;
    }

    const { data, error } = await supabase
      .from('interacciones')
      .insert([{ texto, video_id, usuario_id: finalUserId }])
      .select(`
        id, texto, fecha,
        usuarios ( nombre )
      `);

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};