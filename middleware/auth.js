const jwt = require('jsonwebtoken')


module.exports = function(req, res, next){
    
    //Leer el token del header
    const token = req.header('x-auth-token');

    //Revisar sino hay token
    if(!token){
        return res.status(401).json({msg : 'No hay token permiso no valido'})
    }

    //Validar token

    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next();//para que se vaya al siguiente middleware
    } catch (error) {
        res.status(401).json({msg : 'Token no valido'});
    }
}