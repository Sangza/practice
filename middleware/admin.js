
module.exports = function admin(req,res, next) {
 if(!req.user.admin)return  res.status(403).send('this action is forbidden...')
    next()
}