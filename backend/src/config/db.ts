import mongoose from "mongoose";

const connectDB = async () =>{
    try{
        const mongoURI = process.env.MONGO_URI;

        if(!mongoURI){
            throw new Error(" MongoURI is not defined in env")
        }
        await mongoose.connect(mongoURI);
        console.log("mongodb connected succesfully")
    }catch(err){
        console.error("MongoDB Connection failed")
        console.error(err);
        process.exit(1)
    }
}

export default connectDB;