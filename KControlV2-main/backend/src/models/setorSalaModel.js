
import conect from "../config/database.js";

async function getSetor() {
  try {
    const sql = `
    SELECT id_setor, nome, status
    FROM setores
    ORDER BY nome
    `;
    const [dados] = await conect.query(sql);
    return dados;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createSetor(nome) {
  const sql = `
    INSERT INTO setores (nome, status)
    VALUES (?, 'ativo')
  `;

  const [resultado] = await conect.query(sql, [nome]);
  return resultado;
}

async function findSetorById(id) {
  const sql = `
    SELECT id_setor, nome, status
    FROM setores
    WHERE id_setor = ?
  `;

  const [dados] = await conect.query(sql, [id]);
  return dados[0] || null;
}

async function updateSetor(id, nome) {
  const sql = `
    UPDATE setores
    SET nome = ?
    WHERE id_setor = ?
  `;

  const [resultado] = await conect.query(sql, [nome, id]);
  return resultado;
}

async function updateStatusSetor(id, status) {
  const sql = `
    UPDATE setores
    SET status = ?
    WHERE id_setor = ?
  `;

  const [resultado] = await conect.query(sql, [status, id]);
  return resultado;
}

async function hasRetiradaAtivaNoSetor(id) {
  const sql = `
    SELECT COUNT(*) AS total
    FROM registros r
    INNER JOIN sala s ON s.id_sala = r.id_sala
    WHERE r.id_setor = ?
      AND r.status = 'retirada'
  `;

  const [dados] = await conect.query(sql, [id]);
  return Number(dados[0].total) > 0;
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
  /* Salas */
  getSala,
  createSala,
  findSalaById,
  updateStatusSala,
  hasRetiradaAtiva,
  /* Setor */
  getSetor,
  createSetor,
  findSetorById,
  updateSetor,
  updateStatusSetor,
  hasRetiradaAtivaNoSetor,
};
