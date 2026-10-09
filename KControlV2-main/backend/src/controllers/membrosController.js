
import membrosModels from "../models/membrosModels.js";

async function findAll(req, res) {
    try {
        const users = await membrosModels.findAll();

        return res.status(200).json({ users });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro ao listar membros."
        });
    }
}

async function findById(req, res) {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                message: "ID inválido."
            });
        }

        const user = await membrosModels.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "Membro não encontrado."
            });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro ao buscar membro."
        });
    }
}

async function updateMembers(req, res) {
    try {
        const { id_usuario } = req.params;
        const { nome, email, role } = req.body;

        if (!/^[1-9]\d*$/.test(id_usuario)) {
            return res.status(400).json({
                message: "ID inválido."
            });
        }

        if (
            typeof nome !== "string" ||
            !nome.trim() ||
            typeof email !== "string" ||
            !email.trim() ||
            !["user", "admin"].includes(role)
        ) {
            return res.status(400).json({
                message: "Informe nome, e-mail e função válidos."
            });
        }

        const user = await membrosModels.findById(id_usuario);

        if (!user) {
            return res.status(404).json({
                message: "Membro não encontrado."
            });
        }

        // Impede que o administrador remova seu
        // próprio privilégio por esta operação.
        if (
            Number(id_usuario) === Number(req.user.id_usuario) &&
            role !== "admin"
        ) {
            return res.status(400).json({
                message: "Você não pode remover sua própria função de administrador."
            });
        }

        await membrosModels.updateMembers(id_usuario, {
            nome: nome.trim(),
            email: email.trim(),
            role
        });

        return res.status(200).json({
            message: "Membro atualizado com sucesso."
        });
    } catch (error) {
        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Este e-mail já está cadastrado."
            });
        }

        return res.status(500).json({
            message: "Erro ao atualizar membro."
        });
    }
}

async function removeMembers(req, res) {
    try {
        const { id_usuario } = req.params;

        if (!/^[1-9]\d*$/.test(id_usuario)) {
            return res.status(400).json({
                message: "ID inválido."
            });
        }

        // Impede que o administrador exclua a própria conta.
        if (Number(id_usuario) === Number(req.user.id_usuario)) {
            return res.status(400).json({
                message: "Você não pode remover sua própria conta por esta operação."
            });
        }

        const user = await membrosModels.findById(id_usuario);

        if (!user) {
            return res.status(404).json({
                message: "Membro não encontrado."
            });
        }

        await membrosModels.removeMembers(id_usuario);

        return res.status(200).json({
            message: "Membro removido com sucesso."
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro ao remover membro."
        });
    }
}

export default {
    findAll,
    findById,
    updateMembers,
    removeMembers
};
