import express from 'express';
import {app,server } from './lib/socket.js';

import cookieParser from 'cookie-parser';
app.use(cookieParser());

import dotenv from 'dotenv';
dotenv.config();
import {connectDb} from './lib/db.js';

import path from 'path';


import cors from 'cors';
app.use(cors({ 
    origin:"http://localhost:5173",
    credentials:true
}));

const PORT  = process.env.PORT; 
const __dirname = path.resolve();


import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

app.use(express.json({
    limit:'50mb'
}));
app.use('/api/auth',authRoutes); 
app.use('/api/messages',messageRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
console.log(`Server running on ${PORT}`);
connectDb();
});
