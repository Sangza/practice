const jwt = require('jsonwebtoken')
const config = require('config');
const jsonwebtoken = require('jsonwebtoken');


module.exports = function auth(req,res, next){
    const token = req.header('x-auth-token');
    if(!token) res.status(401).send('Unauthorized')
    
    try {
      const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
      req.user = decoded;
      next()      
    } catch (error) {
        res.status(403).send('Forbidden')
    }
}