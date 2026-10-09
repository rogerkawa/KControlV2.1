import conect from "../config/database.js";

async function getKey() {
  try {
    const sql = `
    SELECT * FROM registros
    `;

    const [dados] = await conect.query(sql);
    return dados;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function registerKey(
    id_usuario,
    id_setor,
    id_chave,
    responsavel,
    turno,
    data_retirada,
    hora_retirada
  ) {
  const sql = `
        INSERT INTO registros
        (
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
    id_chave,
    responsavel,
    turno,
    data_retirada,
    hora_retirada
  ]);

  return dados;
}

export default { getKey, registerKey };
