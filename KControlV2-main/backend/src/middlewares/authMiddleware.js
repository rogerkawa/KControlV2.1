import 'dotenv/config'
import jwt from 'jsonwebtoken'

function authMiddleware(req,res,next){

    //logica do middleware
    console.log("REQUISIÇÃO RECEBIDA:", req.method, req.originalUrl);

    const authorization = req.headers.authorization

    if (
        typeof authorization !== "string" ||
        !authorization.startsWith("Bearer ")
    ) {
        return res.status(401).json({
            message: "Autenticação necessária."
        });
    }

    if(!authorization){
        let message = 'Token inválido'
        return res.status(400).json(message)
    }

    try {
    const token = authorization.split(" ")[1]

    const payload = jwt.verify(token, process.env.JWT_SECRET)

    console.log("PAYLOAD DO JWT:", payload);
    req.user = payload

    console.log("REQ.USER:", req.user);

    next()
    } catch (error) {
        console.error(error)
        return res.status(401).json({
            message: 'Token inválido.'
        })
    }
}

export default authMiddleware