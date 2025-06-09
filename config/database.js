import mongoose from 'mongoose'


export async function connectDb() {
  await mongoose.connect('mongodb://127.0.0.1:27017/devtinder',{
    serverSelectionTimeoutMS: 3000
  });
}