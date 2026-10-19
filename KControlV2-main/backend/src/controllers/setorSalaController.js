
import setorSalaModel from "../models/setorSalaModel.js";

class setorSalaController {
  static async listSetores(req, res) {
    try {
      const setoresList = await setorSalaModel.getSetor();
      return res.status(200).json(setoresList);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro interno ao listar setores.",
      });
    }
  }

  static async listSalas(req, res) {
    try {
      const salasList = await setorSalaModel.getSala();
      return res.status(200).json(salasList);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro interno ao listar salas.",
      });
    }
  }

  static async createSala(req, res) {
    try {
      const nome = String(req.body.nome ?? "").trim();

      if (!nome) {
        return res.status(400).json({
          message: "Informe o nome da sala.",
        });
      }

      if (nome.length > 100) {
        return res.status(400).json({
          message: "O nome deve ter no máximo 100 caracteres.",
        });
      }

      const salas = await setorSalaModel.getSala();

      const jaExiste = salas.some(
        (sala) => sala.nome.toLowerCase() === nome.toLowerCase(),
      );

      if (jaExiste) {
        return res.status(409).json({
          message: "Já existe uma sala com esse nome.",
        });
      }

      await setorSalaModel.createSala(nome);

      return res.status(201).json({
        message: "Sala cadastrada com sucesso.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro interno ao cadastrar sala.",
      });
    }
  }

  static async updateStatusSala(req, res) {
    try {
      const id = Number(req.params.id);
      const status = String(req.body.status ?? "")
        .trim()
        .toLowerCase();

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          message: "ID da sala inválido.",
        });
      }

      if (!["disponivel", "manutencao"].includes(status)) {
        return res.status(400).json({
          message: "Status inválido. Use disponivel ou manutencao.",
        });
      }

      const sala = await setorSalaModel.findSalaById(id);

      if (!sala || sala.status === "inativa") {
        return res.status(404).json({
          message: "Sala não encontrada ou inativa.",
        });
      }

      
      const temRetiradaAtiva = await setorSalaModel.hasRetiradaAtiva(id);

      if (temRetiradaAtiva) {
        if (status === "manutencao") {
          return res.status(409).json({
            message:
              "Não é possível colocar a sala em manutenção enquanto houver uma chave retirada. Registre a devolução primeiro.",
          });
        }

        if (status === "disponivel") {
          return res.status(409).json({
            message:
              "Não é possível liberar a sala enquanto houver uma retirada ativa.",
          });
        }
      }


      await setorSalaModel.updateStatusSala(id, status);

      return res.status(200).json({
        message:
          status === "manutencao"
            ? "Sala colocada em manutenção."
            : "Manutenção encerrada. Sala disponível.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro interno ao atualizar a sala.",
      });
    }
  }

  static async removeSala(req, res) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          message: "ID da sala inválido.",
        });
      }

      const sala = await setorSalaModel.findSalaById(id);

      if (!sala || sala.status === "inativa") {
        return res.status(404).json({
          message: "Sala não encontrada ou já inativa.",
        });
      }

      if (await setorSalaModel.hasRetiradaAtiva(id)) {
        return res.status(409).json({
          message: "Não é possível desativar uma sala com retirada ativa.",
        });
      }

      // Desativação lógica: preserva o histórico de registros.
      await setorSalaModel.updateStatusSala(id, "inativa");

      return res.status(200).json({
        message: "Sala desativada com sucesso.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro interno ao desativar sala.",
      });
    }
  }
}

export default setorSalaController;
