const mongoose = require('mongoose');

// This function connects the app to MongoDB.
async function connectedDb(){

 try{
   // Use the MongoDB connection string stored in .env.
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Database connected successfully')

 }
 catch(err){
   // If the connection fails, print the real error.
    console.error('Database connection error:', err);
}
}
 module.exports = connectedDb