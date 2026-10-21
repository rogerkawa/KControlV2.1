
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
    //1.Verificar se a sala existe e se tá disponivel
    const [salas] = await conect.query(
        `SELECT id_sala, status
        FROM sala
        WHERE id_sala = ?`,
        [id_sala]
    )

    if (salas.length === 0) {
        const error = new Error("Sala não encontrada.");
        error.code = "SALA_NAO_ENCONTRADA";
        throw error;
    }
    
    // 2. Impede outra retirada da mesma sala no mesmo dia e turno
    const [registros] = await conect.query(
        `SELECT id_registro
        FROM registros
        WHERE id_sala = ?
        AND data_retirada = ?
        AND turno = ?
        AND status <> 'devolvida'
        LIMIT 1`,
        [id_sala, data_retirada, turno]
    )

    
    if (["inativa", "manutencao"].includes(salas[0].status)) {
        const error = new Error(
            "Esta sala está inativa ou em manutenção e não pode ser registrada."
        );

        error.code = "SALA_INDISPONIVEL";
        throw error;
    }


    if (registros.length > 0) {
        const error = new Error(
            "Esta sala já teve uma retirada registrada neste dia e turno."
        );
        error.code = "TURNO_DUPLICADO";
        throw error;
    }
     // 3. Impedir outra retirada em aberto da mesma sala
    const [retiradas] = await conect.query(
        `SELECT id_registro
        FROM registros
        WHERE id_sala = ?
        AND status = 'retirada'
        LIMIT 1`,
        [id_sala]
    );

    if (retiradas.length > 0) {
        const error = new Error(
            "Esta sala já possui uma retirada em aberto."
        );

        error.code = "CHAVE_RETIRADA";
        throw error;
    }

    //4. Registra a retirada
    const [resultado] = await conect.query(
           `INSERT INTO registros (
            id_usuario,
            id_setor,
            id_sala,
            responsavel,
            turno,
            data_retirada,
            hora_retirada
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            id_usuario,
            id_setor,
            id_sala,
            responsavel,
            turno,
            data_retirada,
            hora_retirada
        ]
    ) 
    //5. Marcar a sala como indisponível
    await conect.query(
       `UPDATE sala
        SET status = 'retirada'
        WHERE id_sala = ?`,
        [id_sala]
    )

    return resultado;
}

async function updateKey(
    id_registro,
    responsavel,
    hora_entrega
) {
    try {
        // 1. Verifica se o registro existe e está em aberto
        const [registros] = await conect.query(
            `SELECT id_sala, status
             FROM registros
             WHERE id_registro = ?`,
            [id_registro]
        );

        if (registros.length === 0) {
            const error = new Error("Registro não encontrado.");
            error.code = "REGISTRO_NAO_ENCONTRADO";
            throw error;
        }

        if (registros[0].status === "devolvida") {
            const error = new Error("Esta chave já foi devolvida.");
            error.code = "CHAVE_JA_DEVOLVIDA";
            throw error;
        }
        if (!hora_entrega) {
            const error = new Error(
                "Informe o horário de entrega da chave."
            );

            error.code = "HORA_ENTREGA_OBRIGATORIA";
            throw error;
        }

        // 2. Atualiza o registro
        const sql = `
            UPDATE registros
            SET
                responsavel = ?,
                hora_entrega = ?,
                status = 'devolvida'
            WHERE id_registro = ?
        `;

        const [dados] = await conect.query(sql, [
            responsavel,
            hora_entrega,
            id_registro
        ]);

        // 3. Libera a sala
        await conect.query(
            `UPDATE sala
             SET status = 'disponivel'
             WHERE id_sala = ?`,
            [registros[0].id_sala]
        );

        return dados;

    } catch (error) {
        console.error("Erro ao atualizar registro:", error);
        throw error;
    }
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

async function getKeysByUserId(id_usuario) {
    const sql = `
        SELECT
            r.id_registro,
            r.id_usuario,
            st.nome AS setor,
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
        WHERE r.id_usuario = ?
        ORDER BY r.id_registro DESC
    `;

    const [dados] = await conect.query(sql, [id_usuario]);

    return dados;
}

export default {
    getKey,
    registerKey,
    updateKey,
    deleteKey,
    getKeyById,
    getKeysByUserId
};
