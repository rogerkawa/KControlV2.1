import conect from "../config/database.js";

async function atualizarAvatar(id_usuario, avatar_url) {
    const sql = `
        UPDATE usuarios
        SET avatar_url = ?
        WHERE id_usuario = ?
    `;

    const [dados] = await conect.query(sql, [
        avatar_url,
        id_usuario
    ]);

    return dados;
}

async function buscarPerfil(id_usuario) {
    const sql = `
        SELECT id_usuario, nome, email, role, avatar_url
        FROM usuarios
        WHERE id_usuario = ?
        LIMIT 1
    `;

    const [usuarios] = await conect.query(sql, [id_usuario]);

    return usuarios[0] ?? null;
}

export default {
    atualizarAvatar,
    buscarPerfil
};