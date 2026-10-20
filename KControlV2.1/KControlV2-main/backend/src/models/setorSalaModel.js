import conect from "../config/database.js";

async function getSetor() {
  try {
    const sql = `
    SELECT * FROM setores
    `;

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
    SELECT * FROM sala
    `;

    const [dados] = await conect.query(sql);
    return dados;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default {getSetor, getSala}