function adminMiddleware(req, res, next) {
    if (req.user.role !== 'admin') {
        let message = 'Acesso negado. Apenas administradores.'
        return res.status(403).json({ message })
    }

    next();
}

export default adminMiddleware;