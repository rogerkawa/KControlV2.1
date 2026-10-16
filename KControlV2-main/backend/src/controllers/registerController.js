
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

            return res.status(500).json({
                message: "Erro ao registrar a retirada."
            });
        }
    }

    static async updateKey(req, res) {
        try {
            const id = Number(req.params.id);
            const { responsavel, id_sala, hora_entrega } = req.body;

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "ID do registro inválido."
                });
            }

            if (
                typeof responsavel !== "string" ||
                !responsavel.trim() ||
                !Number.isInteger(Number(id_sala)) ||
                Number(id_sala) <= 0
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
                Number(id_sala),
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
}

export default registerKey;
