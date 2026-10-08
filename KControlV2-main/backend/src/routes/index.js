import express from 'express'
import userRoutes from './userRoutes'
import setorSalaRoutes from './setorSalaRoutes'

const routes = (app)=>{
    let message = 'Servidor rodando!'
    app.route('/').get((req,res)=> res.status(200).send(message))
    app.use(express.json(), userRoutes, setorSalaRoutes)
}

export default routes