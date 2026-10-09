import registerModels from "../models/registerModels.js";

class registerKey {
  static async getKeys(req, res) {
    try {
      const getKeys = await registerModels.getKey();
      return res.status(200).json({ getKeys });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro de servidor!",
      });
    }
  }

  static async registerKey(req, res) {

    console.log("BODY RECEBIDO:", req.body);
    console.log("USUÁRIO DO TOKEN:", req.user);
    try {
      const {
        id_setor,
        id_sala,
        responsavel,
        turno,
        data_retirada,
        hora_retirada,
      } = req.body;

      if (
        !id_setor ||
        !id_sala ||
        !responsavel?.trim() ||
        !turno ||
        !data_retirada ||
        !hora_retirada
      ) {
        return res.status(400).json({
          message: "Todos os campos são obrigatórios.",
        });
      }

      if (!["M", "T", "N"].includes(turno)) {
        return res.status(400).json({
          message: "Turno inválido.",
        });
      }

      // O ID deve vir do usuário autenticado.
      const id_usuario = req.user.id;

      if (!id_usuario) {
        return res.status(401).json({
          message: "Usuário não identificado no token.",
        });
      }

      const result = await registerModels.registerKey(
        id_usuario,
        Number(id_setor),
        Number(id_sala),
        responsavel.trim(),
        turno,
        data_retirada,
        hora_retirada,
      );

      return res.status(201).json({
        message: "Retirada registrada com sucesso!",
        id: result.insertId,
      });
    } catch (error) {
      console.error("Erro ao registrar retirada:", error);

      return res.status(500).json({
        message: "Erro ao registrar a retirada.",
      });
    }
  }
}

export default registerKey;
