const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { postSchema, Posts } = require('./post');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    profile_picture: String,
     followers: {
        type:Number
    },
    posts: [mongoose.Types.ObjectId],
    password: {
        type: String,
        required:true
    }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign(
    {
    _id:this._id,
    
    },
    config.get('jwtPrivateKey')
    )
    return token;
}

const Users = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(4).required(),
        profile_picture: Joi.string(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        postId: Joi.objectId(),
        password:Joi.string().min(6).required()
    });
    return schema.validate(user);
}

module.exports.userSchema = userSchema;
module.exports.Users = Users;
module.exports.validateUser = validateUser;
