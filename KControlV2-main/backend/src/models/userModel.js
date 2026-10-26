import conect from "../config/database.js";

async function listUsers() {
    try {

        const sql = `
    SELECT id_usuario, nome, email, role
    FROM usuarios
    ORDER BY nome ASC
`;

    const [dados] = await conect.query(sql)
    return dados
    } catch (error) {
        console.log(error)
        throw error
    }
}

async function registerUsers(
    nome,
    email,
    senha
) {
    try {
        const sql = `
    INSERT INTO usuarios(
    nome,
    email,
    senha
    )VALUES (?, ?, ?)
    `

    const [dados] = await conect.query(sql, [
    nome,
    email,
    senha
    ])

    return dados
    } catch (error) {
        console.log(error)
        throw error
    }
}

async function findEmail(email) {
    try {
        const sql = `
    SELECT * FROM usuarios WHERE email = ?
    `
    const [dados] = await conect.query(sql, [email])
    return dados[0]
    } catch (error) {
        console.log(error)
        throw error
    }
}


async function updateName(id_usuario, nome) {
    try {
        const sql = `
            UPDATE usuarios
            SET nome = ?
            WHERE id_usuario = ?
        `;

        const [dados] = await conect.query(sql, [nome, id_usuario]);

        return dados;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


async function updatePassword(id_usuario, senha) {
    try {
        const sql = `
            UPDATE usuarios
            SET senha = ?
            WHERE id_usuario = ?
        `;

        const [dados] = await conect.query(sql, [
            senha,
            id_usuario
        ]);

        return dados;
    } catch (error) {
        console.log(error);
        throw error;
    }
}



export default {listUsers, registerUsers, findEmail, updateName, updatePassword}