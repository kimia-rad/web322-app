const { resolve } = require('path');
const Sequelize = require('sequelize');

var sequelize = new Sequelize('ehdroisi', 'ehdroisi', '0k2_0Hum2LQAKLQoaNBOyDNYqERQLnjE', {
    host: 'isilo.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
    });

var Post= sequelize.define( 'Post' , {
    body: Sequelize.TEXT,
    tite: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
    
});

var Category= sequelize.define('Category',{
    category :Sequelize.STRING

});

Post.belongsTo(Category, {foreignKey: 'category'});
//const { Post, Category } = require('./models');

//const fs = require("fs");
    // let posts = [];
    // let categories = [];

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize
        .sync()
        .then(()=>{
            console.log('Database synced successfully.');
            resolve();
            })
            .catch(err=>reject('Unable to sync the database.'));
    });
}

module.exports.getAllPosts = function(){
    return new Promise((resolve, reject) => {
        Post.findAll()
        .then((posts) =>{
            if (!posts || posts.length === 0){
                reject('No result returned.');
            }
            else{
                resolve(posts);
            }
        })
        .catch(error => {
            console.error('Error retrieving all posts:', err);
            reject('Unable to get all posts.');
        });
    });
}

module.exports.getPostsByCategory = function(category){
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: { category}
        })
        .then((posts) =>{
            if (!posts || posts.length === 0){
                reject('No result returned.');
            }
            else{
                resolve(posts);
            }
        })
        .catch(error => {
            console.error('Error retrieving all posts:', err);
            reject('Unable to get all posts.');
        });
    });
}

module.exports.getPostsByMinDate = function(minDateStr) {
    return new Promise((resolve, reject) => {
        const { gte } = Sequelize.Op;
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr),
                },
            },
        })
        .then((posts) =>{
            if (!posts || posts.length === 0){
                reject('No result returned.');
            }
            else{
                resolve(posts);
            }
        })
        .catch(error => {
            console.error('Error retrieving all posts:', err);
            reject('Unable to get all posts.');
        });
    });
}

module.exports.getPostById = function(id){
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: { id}
        })
        .then((posts) =>{
            if (!posts || posts.length === 0){
                reject('No result returned.');
            }
            else{
                resolve(posts);
            }
        })
        .catch(error => {
            console.error('Error retrieving all posts:', err);
            reject('Unable to get all posts.');
        });
    });
}

module.exports.addPost = function(postData){
    return new Promise((resolve, reject) => {
        postData.published = (postData.published) ? true : false;
        for (let prop in postData) {
            if (postData[prop] === '') {
              postData[prop] = null;
            }
          }
      
          postData.postDate = new Date();
      
          Post.create(postData)
            .then(() => {
              resolve();
            })
            .catch((err) => {
              console.error('Error adding post:', err);
              reject('Unable to create post.');
            });
        });
}

module.exports.getPublishedPosts = function(){
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {published: true}
        })
        .then((posts) =>{
            if (!posts || posts.length === 0) {
                reject('No results returned.');
              } else {
                resolve(posts);
              }
            })
            .catch((err) => {
              console.error('Error retrieving published posts:', err);
              reject('Unable to get published posts.');
            });
        });
}

module.exports.getPublishedPostsByCategory = function(category){
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {published: true , category}
        })
        .then(
            (posts) =>{
                if(!posts|| posts.length===0 ){
                    reject("no result found");
                    }else{
                        resolve(posts);
                        }
                    })
        .catch((err)=>{
        console.error('Error retrieving published posts by category:', err);
        reject('Unable to get published posts by category.');
        });
    });
}

module.exports.getCategories = function(){
    return new Promise((resolve, reject) => {
        Category.findAll()
      .then((categories) => {
        if (!categories || categories.length === 0) {
          reject('No results returned.');
        } else {
          resolve(categories);
        }
      })
      .catch((err) => {
        console.error('Error retrieving categories:', err);
        reject('Unable to get categories.');
      });
  });
}

module.exports.addCategory = function(categoryData){
    return new Promise((resolve, reject)=>{
        for (let prop in categoryData){
            if(categoryData[prop] === ''){
                categoryData[prop] = null;
            }
        }

        Category.create(categoryData)
        .then(()=> {
            console.log('the operation was a success');
            resolve(categoryData);
        })
        .catch((err)=>{
            console.error(`Error adding category`, err);
            reject('Unable to create category');
        });
    });
}

module.exports.deleteCategoryById= function(id){
    return new Promise ((resolve,reject)=> {
        Category.destroy({
            where: {id}
        })
        .then ((rowsDeleted)=>{
            if(rowsDeleted > 0){
                resolve();
            }
            else{
                reject('Category not found');
                }
        })
        .catch((err)=>{
            console.error (`Failed deleting the category `, err);
            reject ('Unable to delete category.');
        });
        });
}
module.exports.deletePostById = function(id){
    return new Promise ((resolve,reject)=> {
        Post.destroy({
            where: {id}
        })
        .then ((rowsDeleted)=>{
            if(rowsDeleted > 0){
                resolve();
            }
            else{
                reject('Post not found');
                }
        })
        .catch((err)=>{
            console.error (`Failed deleting the post `, err);
            reject ('Unable to delete post.');
        });
        });
}