import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  static async listUsers(req, res) {
    try {
      const usersList = await userModel.listUsers();
      return res.status(200).json(usersList);
    } catch (error) {
      console.log(error);
      let message = "Erro interno no servidor";
      return res.status(500).json({ message });
    }
  }

  static async registerUser(req, res) {
    try {
      const { nome, email, senha } = req.body;

      //verificação de campos
      if (!nome || !email || !senha) {
        let message = "Todos os campos são obrigatórios.";
        return res.status(400).json({ message });
      }

      //verificação de email
      const userEmail = await userModel.findEmail(email);
      if (userEmail) {
        let message = "Usuário já existe!";
        return res.status(400).json({ message });
      }

      //criando proteção de senha
      const hash = await bcrypt.hash(senha, 10);

      //mandando dados pro banco
      await userModel.registerUsers(nome, email, hash);

      let message = "Usuário cadastrado com sucesso.";
      return res.status(201).json({ message });
    } catch (error) {
      console.log(error);
      let message = "Erro interno no servidor";
      return res.status(500).json(message);
    }
  }

  static async loginUser(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        let message = "Todos os campos são obrigatórios.";
        return res.status(401).json({ message });
      }

      const user = await userModel.findEmail(email);

      if (!user) {
        let message = "E-mail ou senha incorretos.";
        return res.status(401).json({ message });
      }

      const comparaSenha = await bcrypt.compare(senha, user.senha);

      if (!comparaSenha) {
        let message = "E-mail ou senha incorretos.";
        return res.status(401).json({ message });
      }

      const token = jwt.sign(
        {
          id: user.id_usuario,
          nome: user.nome,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" },
      );

      return res.status(200).json({
        message: "Login bem sucedido",
        token,
      });
    } catch (error) {

      console.error("Erro em loginUser:", error);
      let message = "Erro interno no servidor";
      return res.status(500).json({ message });
    }
  }

  static userAuthenticator(req, res) {
    try {
      return res.status(200).json({
        user: req.user,
      });
    } catch (error) {
      console.error(error);
      let message = "Erro de servidor!";
      return res.status(500).json({ message });
    }
  }
  // Atualiza o perfil do usuário autenticado
  static async updateProfile(req, res) {
      try {
          const { nome } = req.body;
          const id_usuario = req.user.id;

          if (!nome || nome.trim().length < 2) {
              return res.status(400).json({
                  message: 'O nome deve ter pelo menos 2 caracteres.'
              });
          }

          await userModel.updateName(id_usuario, nome.trim());

          return res.status(200).json({
              message: 'Nome atualizado com sucesso.'
          });

      } catch (error) {
          console.error('Erro ao atualizar perfil:', error);

          return res.status(500).json({
              message: 'Erro interno no servidor.'
          });
      }
  }
  // Atualiza a senha do usuário autenticado
  static async updatePassword(req, res) {
      try {
          const { senhaAtual, novaSenha } = req.body;
          const id_usuario = req.user.id;

          if (!senhaAtual || !novaSenha) {
              return res.status(400).json({
                  message: 'Preencha a senha atual e a nova senha.'
              });
          }

          const user = await userModel.findEmail(req.user.email);

          if (!user) {
              return res.status(404).json({
                  message: 'Usuário não encontrado.'
              });
          }

          const senhaCorreta = await bcrypt.compare(
              senhaAtual,
              user.senha
          );

          if (!senhaCorreta) {
              return res.status(400).json({
                  message: 'A senha atual está incorreta.'
              });
          }

          const mesmaSenha = await bcrypt.compare(
              novaSenha,
              user.senha
          );

          if (mesmaSenha) {
              return res.status(400).json({
                  message: 'A nova senha deve ser diferente da atual.'
              });
          }

          const hash = await bcrypt.hash(novaSenha, 10);

          await userModel.updatePassword(id_usuario, hash);

          return res.status(200).json({
              message: 'Senha atualizada com sucesso.'
          });

      } catch (error) {
          console.error('Erro ao atualizar senha:', error);

          return res.status(500).json({
              message: 'Erro interno ao atualizar a senha.'
          });
      }
  }


}



export default UserController;
