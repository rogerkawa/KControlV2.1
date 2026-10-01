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

async function registerKey(id_usuario, id_setor, id_chave, responsavel, turno) {
  const sql = `
        INSERT INTO registros
        (
            id_usuario,
            id_setor,
            id_chave,
            responsavel,
            turno
        )
        VALUES (?, ?, ?, ?, ?)
    `;

  const [dados] = await conect.query(sql, [
    id_usuario,
    id_setor,
    id_chave,
    responsavel,
    turno,
  ]);

  return dados;
}

export default { getKey, registerKey };
