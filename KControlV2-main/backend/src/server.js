import express from "express";
import 'dotenv/config'
import routes from "./routes";
import cors from 'cors'
import path from "node:path";

const app = express()
app.use(cors())
app.use(
    "/uploads",
    express.static(path.resolve("uploads"))
);

routes(app)

const porta = process.env.PORT
const end = process.env.END

app.listen(porta, ()=> console.log(`Servidor rodando: ${end}:${porta}`))