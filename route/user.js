const auth = require('../middleware/auth')
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const route = express.Router();
const mongoose =  require('mongoose');
const { Users, validateUser } = require('../model/user');
const {Posts} = require('../model/post');

router.get('/me',  [auth], async(req,res)=> {
      const user = await Users.findById(req.user._id).select('-password')
      res.send(user)
  })

route.get('/', async (req,res)=>{
  const user = await Users.find();
  res.send(user);
})

route.get('/:id', async (req,res)=>{
 const user = await Users.findById({_id:req.params.id});
 if(!user) return res.status(400).send('Invalid Id')         
 res.send(user);
    })


route.post('/', async (req,res)=> {
 const { error } = validateUser(req.body);
 if(error){
    res.status(400).send(error.details[0].message);
    return;
 }

 const post = await Posts.findById(req.body.postId);
 if(!post) return res.status(400).send('Id not found');

 let user = new Users({
       username:req.body.username,
       email:req.body.email,
       profile_picture:req.body.profile_picture,
       posts:[{
        _id:post._id,
       }],
       password:req.body.password
 })
 const salt = await bcrypt.genSalt(10)
 user.password = await  bcrypt.hash(user.password,salt);


 const users = await user.save();
 res.header('x-auth-token', token).send(_.pick(user,['username','email','profile_picture','posts']));
})

route.put('/:id', async(req,res) => {
 const { error } = validateUser(req.body);
  if(error){
   res.status(400).send(error.details[0].message);
   return;
   }

const post = await Posts.findById(req.body.postId);
   if(!post) return res.status(400).send('Id not found');
     
const user = await Users.updateOne({_id:req.params.id},{
      $set:{
        username:req.body.username,
       email:req.body.email,
       profile_picture:req.body.profile_picture,
      //  posts:[{
      //   _id:post._id,
      //   name:post.name,
      //   image_url:post.image_url,
      //   description:post.description,
      //  }]
      }
},{
      new:true,
})
if(!user) return res.status(400).send('Id doesnt exizt')
res.send(user);
 
})

route.delete('/:id', async(req,res)=> {
      const del = await Users.deleteOne({_id:req.params.id});
      if(!del) return res.status(400).send('Id not found');
      res.send(del);
})

async function getnetwork (){
      
}

module.exports = route;

