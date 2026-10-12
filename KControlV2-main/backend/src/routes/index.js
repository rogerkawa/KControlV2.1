import express from 'express'
import userRoutes from './userRoutes'
import setorSalaRoutes from './setorSalaRoutes'
import registerRoutes from './registerRoutes'
import membrosRoutes from './membrosRoutes'
import avatarRoutes from './avatarRoutes'

const routes = (app)=>{
    let message = 'Servidor rodando!'
    app.route('/').get((req,res)=> res.status(200).send(message))
    app.use(express.json(), userRoutes, setorSalaRoutes, registerRoutes, membrosRoutes, avatarRoutes)
}

export default routes