import registerModels from "../models/registerModels";

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
    try {
      const { 
        id_setor,
        id_chave, 
        responsavel, 
        turno 
    } = req.body;

    if(!id_setor || !id_chave || !responsavel || !turno){
        return res.status(400).json({message: 'Todos os campos são obrigatórios'})
    }

      const id_usuario = req.user.id;

      const result = await registerModels.registerKey(
        id_usuario,
        id_setor,
        id_chave,
        responsavel,
        turno,
      );

      return res.status(201).json({
        message: "Retirada registrada com sucesso!",
        id: result.insertId,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro de servidor!",
      });
    }
  }
}

export default registerKey;
