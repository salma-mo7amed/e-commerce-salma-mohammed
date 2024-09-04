// import modules:
import mongoose from "mongoose";
// create db
export const connectDB = ()=>{
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log('db connected successfully');
    }).catch((err)=>{
        console.log('db failed to connect successfully', err);
    })
};