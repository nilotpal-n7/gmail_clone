import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
let isConnected; 

async function dbConnect() {
    if(isConnected) {
        console.log("already connected to database")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        isConnected = db.connections[0].readyState
        console.log("Database connected successfully", db, db.connections)
        
    } catch (error) {
        console.log("database connection failed", error)
        process.exit(1)
    }
}

export default dbConnect
