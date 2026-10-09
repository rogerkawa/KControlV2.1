import conect from "../config/database.js";

async function findAll() {
    const sql = `
        SELECT id_usuario, nome, email, role
        FROM usuarios
        ORDER BY nome ASC
    `

    const [dados] = await conect.query(sql)

    return dados;
}

async function findById(id_usuario) {
    const sql =
        `SELECT id_usuario, nome, email, role
         FROM usuarios
         WHERE id_usuario = ?`

    const [dados] = await conect.query(sql,[id_usuario])

    return dados[0];
}

async function updateMembers(id_usuario, { nome, email, role }) {
    const [result] = await conect.query(
        `UPDATE usuarios
         SET nome = ?, email = ?, role = ?
         WHERE id_usuario = ?`,
        [nome, email, role, id_usuario]
    );



    return result.affectedRows;
}

async function removeMembers(id_usuario) {
    const [result] = await conect.query(
        `DELETE FROM usuarios WHERE id_usuario = ?`,
        [id_usuario]
    );

    return result.affectedRows;
}

export default {
    findAll,
    findById,
    updateMembers,
    removeMembers
};
