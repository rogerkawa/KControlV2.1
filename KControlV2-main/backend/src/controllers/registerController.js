
import registerModels from "../models/registerModels.js";

class registerKey {
    static async getKeys(req, res) {
        try {
            const getKeys = await registerModels.getKey();

            return res.status(200).json({ getKeys });
        } catch (error) {
            console.error("Erro ao buscar registros:", error);

            return res.status(500).json({
                message: "Erro ao buscar registros."
            });
        }
    }

    //Cato aqui: Criando dois métodos  para o select
    static async getSetores(req, res) {
        try {
            const setores = await registerModels.getSetores();
            return res.status(200).json({ setores });
        } catch (error) {
            console.error("Erro ao buscar setores:", error);

            return res.status(500).json({
                message: "Erro ao buscar setores."
            });
        }
    }


    static async getSalas(req, res) {
        try {
            const salas = await registerModels.getSalas();
            return res.status(200).json({ salas });
        } catch (error) {
            console.error("Erro ao buscar salas:", error);

            return res.status(500).json({
                message: "Erro ao buscar salas."
            });
        }
    }

    static async registerKey(req, res) {
        try {
            const {
                id_setor,
                id_sala,
                responsavel,
                turno,
                data_retirada,
                hora_retirada
            } = req.body;

            const id_usuario = req.user?.id;

            if (
                !id_usuario ||
                !id_setor ||
                !id_sala ||
                !responsavel?.trim() ||
                !turno ||
                !data_retirada ||
                !hora_retirada
            ) {
                return res.status(400).json({
                    message: "Todos os campos são obrigatórios."
                });
            }

            if (!["M", "T", "N"].includes(turno)) {
                return res.status(400).json({
                    message: "Turno inválido."
                });
            }

            const resultado = await registerModels.registerKey(
                id_usuario,
                Number(id_setor),
                Number(id_sala),
                responsavel.trim(),
                turno,
                data_retirada,
                hora_retirada
            );

            return res.status(201).json({
                message: "Retirada registrada com sucesso!",
                id: resultado.insertId
            });
        } catch (error) {
            console.error("Erro ao registrar retirada:", error);

            if (error.code === "SALA_NAO_ENCONTRADA") {
                return res.status(404).json({
                    message: error.message
                });
            }

            if (
                error.code === "CHAVE_RETIRADA" ||
                error.code === "TURNO_DUPLICADO" ||
                error.code === "SALA_INDISPONIVEL"
            ) {
                return res.status(409).json({
                    message: error.message
                });
            }

            return res.status(500).json({
                message: "Erro ao registrar a retirada."
            });
        }
    }

    static async updateKey(req, res) {
        try {
            const id = Number(req.params.id);
            const { responsavel, hora_entrega } = req.body;

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "ID do registro inválido."
                });
            }

            if (
                typeof responsavel !== "string" ||
                !responsavel.trim()
            ) {
                return res.status(400).json({
                    message: "Informe um responsável e uma sala válidos."
                });
            }

            if (
                hora_entrega !== "" &&
                hora_entrega !== null &&
                hora_entrega !== undefined &&
                !/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(hora_entrega)
            ) {
                return res.status(400).json({
                    message: "Horário de entrega inválido."
                });
            }

            const resultado = await registerModels.updateKey(
                id,
                responsavel.trim(),
                hora_entrega || null
            );

            if (!resultado.affectedRows) {
                return res.status(404).json({
                    message: "Registro não encontrado."
                });
            }

            return res.status(200).json({
                message: "Registro atualizado com sucesso!"
            });
        } catch (error) {
            console.error("Erro ao atualizar registro:", error);

            return res.status(500).json({
                message: "Erro ao atualizar registro."
            });
        }
    }

    static async deleteKey(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "ID do registro inválido."
                });
            }

            
            const registro = await registerModels.getKeyById(id);

            if (!registro) {
                return res.status(404).json({
                    message: "Registro não encontrado."
                });
            }

            if (String(registro.status).toLowerCase() !== "devolvida") {
                return res.status(409).json({
                    message: "Não é possível remover um registro com retirada em aberto."
                });
            }


            const resultado = await registerModels.deleteKey(id);

            if (!resultado.affectedRows) {
                return res.status(404).json({
                    message: "Registro não encontrado."
                });
            }

            return res.status(200).json({
                message: "Registro excluído com sucesso!"
            });
        } catch (error) {
            console.error("Erro ao excluir registro:", error);

            return res.status(500).json({
                message: "Erro ao excluir registro."
            });
        }
    }
    static async getMyKeys(req, res) {
    try {
        // Compatível com os dois formatos de ID usados no projeto.
        const id_usuario = Number(
            req.user?.id_usuario ?? req.user?.id
        );

        if (!Number.isInteger(id_usuario) || id_usuario <= 0) {
            return res.status(401).json({
                message: "Usuário não autenticado."
            });
        }

        const registros =
            await registerModels.getKeysByUserId(id_usuario);

        return res.status(200).json({ registros });
    } catch (error) {
        console.error("Erro ao buscar histórico pessoal:", error);

        return res.status(500).json({
            message: "Erro ao buscar seu histórico de retiradas."
        });
    }
}
static async getSalasEmUso(req, res) {
    try {
        const registros = await registerModels.getSalasEmUso();

        return res.status(200).json({ registros });
    } catch (error) {
        console.error("Erro ao buscar salas em uso:", error);

        return res.status(500).json({
            message: "Erro ao buscar salas em uso."
        });
    }
}
}

export default registerKey;
