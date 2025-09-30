// require("dotenv").config({path: "./.env"});   // If this approach is used then code will not give an error
// import mongoose from "mongoose";
// import {DB_NAME} from "./constants.js";
import connectDB from "./db/index.js";


import dotenv from "dotenv";
dotenv.config({path: "./.env"});

connectDB()
.then(() => {
    import("./app.js").then(({default: app}) => {
        app.on("error", (error) => {
            console.error("Error starting the server:", error);
            throw error;
        });
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server started on port ${process.env.PORT}`);
        });
    });
    })
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    throw error;
});









/*
import express from "express";
const app = express();

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (error) => {
            console.error("Error starting the server:", error);
            throw error;
        });

        app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}) ()*/