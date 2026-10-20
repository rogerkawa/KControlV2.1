import setorSalaModel from "../models/setorSalaModel.js";

class setorSalaController{
    static async listSetores(req, res) {
        try {
          const setoresList = await setorSalaModel.getSetor();
          return res.status(200).json(setoresList);
        } catch (error) {
          console.log(error);
          let message = "Erro interno no servidor";
          return res.status(500).json({ message });
        }
      }

      static async listSalas(req, res) {
          try {
            const salasList = await setorSalaModel.getSala();
            return res.status(200).json(salasList);
          } catch (error) {
            console.log(error);
            let message = "Erro interno no servidor";
            return res.status(500).json({ message });
          }
        }
}

export default setorSalaController;