
import conect from "../config/database.js";

async function getKey() {
    const sql = `
        SELECT
            r.id_registro,
            r.id_usuario,
            r.id_setor,
            st.nome AS setor,
            r.id_sala,
            s.nome AS sala,
            r.responsavel,
            r.turno,
            r.data_retirada,
            r.hora_retirada,
            r.hora_entrega,
            r.status,
            r.created_at
        FROM registros r
        LEFT JOIN setores st ON st.id_setor = r.id_setor
        LEFT JOIN sala s ON s.id_sala = r.id_sala
        ORDER BY r.id_registro DESC
    `;

    const [dados] = await conect.query(sql);
    return dados;
}

async function registerKey(
    id_usuario,
    id_setor,
    id_sala,
    responsavel,
    turno,
    data_retirada,
    hora_retirada
) {
    const sql = `
        INSERT INTO registros (
            id_usuario,
            id_setor,
            id_sala,
            responsavel,
            turno,
            data_retirada,
            hora_retirada
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [dados] = await conect.query(sql, [
        id_usuario,
        id_setor,
        id_sala,
        responsavel,
        turno,
        data_retirada,
        hora_retirada
    ]);

    return dados;
}

async function updateKey(
    id_registro,
    responsavel,
    id_sala,
    hora_entrega
) {
    const sql = `
        UPDATE registros
        SET
            responsavel = ?,
            id_sala = ?,
            hora_entrega = ?,
            status = ?
        WHERE id_registro = ?
    `;

    const status = hora_entrega ? "devolvida" : "retirada";

    const [dados] = await conect.query(sql, [
        responsavel,
        id_sala,
        hora_entrega || null,
        status,
        id_registro
    ]);

    return dados;
}

async function deleteKey(id_registro) {
    const sql = `
        DELETE FROM registros
        WHERE id_registro = ?
    `;

    const [dados] = await conect.query(sql, [id_registro]);
    return dados;
}

async function getKeyById(id_registro) {
    const sql = `
        SELECT id_registro, status
        FROM registros
        WHERE id_registro = ?
    `;

    const [dados] = await conect.query(sql, [id_registro]);
    return dados[0] || null;
}


export default {
    getKey,
    registerKey,
    updateKey,
    deleteKey,
    getKeyById
};
