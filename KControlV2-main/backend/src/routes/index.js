import express from 'express'
import setorSalaRoutes from './setorSalaRoutes'
import registerRoutes from './registerRoutes'
import membrosRoutes from './membrosRoutes'
import avatarRoutes from './avatarRoutes'
import userRoutes from './userRoutes'

const routes = (app)=>{
    let message = 'Servidor rodando!'
    app.route('/').get((req,res)=> res.status(200).send(message))
    app.use(express.json(), userRoutes, setorSalaRoutes, registerRoutes, membrosRoutes, avatarRoutes)
}

export default routes