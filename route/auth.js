const bcrypt = require('bcrypt')
const router = express.Router();
const express = require('express');
const { Users } = require('../model/user')



router.post('/', async(req,res)=>{
    const {error} = validateUser(req.body)
    if(error)return res.status(400).send(error.detail[0].message)

    let user = await Users.findOne({email:req.body.email})
    if(!user) return res.status(400).send('Invalid email and password');

   const validPassword = await bcrypt.compare(req.body.password, user.password)
   if(!validPassword) return res.status(400).send('Invalid email and password')

    const token = user.generateAuthToken();
    res.send(token);
})


function validateUser(req) {
    const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password:Joi.string().min(6).required()
    });
    return schema.validate(req);
}

module.exports = router;