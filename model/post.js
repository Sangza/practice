const mongoose = require('mongoose');
const Joi = require('joi');

const postSchema = new mongoose.Schema({

    description: {
        type: String,
        required:true
    },
    name: String,
    image_url: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    comments: [{
        user: String,
        comment: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    likes: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['In Progress', 'Completed', 'Overdue'],
        default: 'In Progress'
    },
    assigned_to: [mongoose.Schema.Types.ObjectId],
   
});

const Posts = mongoose.model('Post', postSchema);

function validatePost(post) {
    const schema = Joi.object({
        name: Joi.string().required(),
        image_url: Joi.string().required(),
        description: Joi.string().required(),
        comments: Joi.array(),
        likes:Joi.number(),
        status:Joi.string(), 
              
    });
    return schema.validate(post);
}

module.exports.postSchema = postSchema;  // Corrected typo from 'portSchema'
module.exports.Posts = Posts;
module.exports.validatePost = validatePost;
