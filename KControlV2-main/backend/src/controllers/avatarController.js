
import avatarModels from "../models/avatarModels.js";

async function atualizarAvatar(req, res) {
    try {
        const id_usuario = req.user?.id;

        if (!id_usuario) {
            return res.status(401).json({
                message: "Usuário não autenticado."
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Envie uma imagem."
            });
        }

        // O Cloudinary fornece a URL permanente da imagem.
        const avatar_url = req.file.path;

        if (!avatar_url || !avatar_url.startsWith("https://")) {
            console.error(
                "URL inválida retornada pelo Cloudinary:",
                avatar_url
            );

            return res.status(500).json({
                message: "Não foi possível obter a URL da imagem."
            });
        }

        await avatarModels.atualizarAvatar(
            id_usuario,
            avatar_url
        );

        return res.status(200).json({
            message: "Avatar atualizado com sucesso.",
            avatar_url
        });
    } catch (erro) {
        console.error("Erro ao atualizar avatar:", erro);

        return res.status(500).json({
            message: "Não foi possível atualizar o avatar."
        });
    }
}

async function buscarPerfil(req, res) {
    try {
        const id_usuario = req.user?.id;

        if (!id_usuario) {
            return res.status(401).json({
                message: "Usuário não autenticado."
            });
        }

        const usuario = await avatarModels.buscarPerfil(
            id_usuario
        );

        if (!usuario) {
            return res.status(404).json({
                message: "Usuário não encontrado."
            });
        }

        return res.json({ usuario });
    } catch (erro) {
        console.error("Erro ao buscar perfil:", erro);

        return res.status(500).json({
            message: "Não foi possível carregar o perfil."
        });
    }
}

export default {
    atualizarAvatar,
    buscarPerfil
};
