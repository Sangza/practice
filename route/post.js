const auth = require('../middleware/auth')
const express = require('express');
const route = express.Router();
const mongoose =  require('mongoose');
const { Posts, validatePost } = require('../model/post');
const {Users} = require('../model/user')


route.get('/', auth, async (req,res) => {
 const post =  await Posts.find();
 res.send(post);
})

route.post('/', async (req,res) => {
 const { error } = validatePost(req.body);
 if(error) {
 res.status(400).send(error.details[0].message);
 return
 }

 const user = await Users.findById(req.body.userId);
 if(!user) return res.status(400).send('userId does not..')
 

 let post = new Posts({
   name: req.body.name,
   description:req.body.description,
   image_url: req.body.image_url,
   status: req.body.status,

   likes:0,
   comments:[
       {
        user:req.body.comments.user,
        comment:req.body.comments.comment,

       }
   ],
   assigned_to: [{
    _id:user._id
   }]
   });

   const posts = await post.save();
   res.send(posts);
})


route.get('/:id', async (req,res) => {
    const pos =  await Posts.findById(req.params.id);
    if(!pos) return res.status(400).send('Please provide the id');
    res.send(pos);
})

route.put('/:id', auth, async(req,res) => {
    const { error } = validatePost(req.body);
 if(error) {
 res.status(400).send(error.details[0].message);
 return

 }
 const user = await Users.findById(req.body.userId);
 if(!user) return res.status(400).send('userId does not..')

  const post = await Posts.updateOne({_id:req.params.id},{
    $set :{
        name: req.body.name,
       description:req.body.description,
       image_url: req.body.image_url,
      status: req.body.status,

   likes:0,
   comments:[
       {
        user:req.body.comments.user,
        comment:req.body.comments.comment,

       }
   ],

    }
  },{
    new:true
  })
  if(!post) return res.status(400).send('check Id not available')
    res.send(post);
})
route.delete('/:id',async(req,res) => {
    const del = await Posts.deleteOne({_id:req.params.id})
    if(!del) return res.status(400).send('Id not found');
    res.send(del);
})
module.exports = route;