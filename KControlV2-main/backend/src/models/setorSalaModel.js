
import conect from "../config/database.js";

async function getSetor() {
  try {
    const sql = `SELECT * FROM setores`;
    const [dados] = await conect.query(sql);
    return dados;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getSala() {
  try {
    const sql = `
      SELECT
        s.id_sala,
        s.nome,
        CASE
          WHEN s.status = 'inativa' THEN 'inativa'
          WHEN s.status = 'manutencao' THEN 'manutencao'
          WHEN EXISTS (
            SELECT 1
            FROM registros r
            WHERE r.id_sala = s.id_sala
              AND r.status = 'retirada'
          ) THEN 'retirada'
          ELSE 'disponivel'
        END AS status
      FROM sala s
      ORDER BY s.nome
    `;

    const [dados] = await conect.query(sql);
    return dados;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createSala(nome) {
  const sql = `
    INSERT INTO sala (nome, status)
    VALUES (?, 'disponivel')
  `;

  const [resultado] = await conect.query(sql, [nome]);
  return resultado;
}

async function findSalaById(id) {
  const sql = `
    SELECT id_sala, nome, status
    FROM sala
    WHERE id_sala = ?
  `;

  const [dados] = await conect.query(sql, [id]);
  return dados[0] || null;
}

async function updateStatusSala(id, status) {
  const sql = `
    UPDATE sala
    SET status = ?
    WHERE id_sala = ?
  `;

  const [resultado] = await conect.query(sql, [status, id]);
  return resultado;
}

async function hasRetiradaAtiva(id) {
  const sql = `
    SELECT COUNT(*) AS total
    FROM registros
    WHERE id_sala = ?
      AND status = 'retirada'
  `;

  const [dados] = await conect.query(sql, [id]);
  return Number(dados[0].total) > 0;
}

export default {
  getSetor,
  getSala,
  createSala,
  findSalaById,
  updateStatusSala,
  hasRetiradaAtiva,
};
