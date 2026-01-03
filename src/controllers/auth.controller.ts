import {Request, Response} from "express";
import {registerUser} from "../services/auth.service";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
    const {name, email, password} = req.body;
    const user = await registerUser (name, email, password);
    res.status(201).json(user);
};

export const login = async (req:Request, res:Response) =>{
    const {email, password} = req.body;

    const user = await prisma.user.findUnique({where: {email}});
    if(!user) return res.status(401).json({message: "Invalid Credentials"});

    const isMatch = await bcrypt.compare (password, user.password);
    if (!isMatch) return res.status(401).json({message:"Invalid Credentials"});

    const token = generateToken(user.id);
    res.cookie("token", token, {
        httpOnly: true,
        secure: false
    });

    res.json({message: "Login successful"});
};

export const getallUser = async (req:Request, res:Response) => {
    const users = await prisma.user.findMany({});
    res.json({message: "User fetch successfully", data:users} );
}

export const getsingleUser = async (req:Request, res:Response) => {
    const { email } = req.params;
    const user = await prisma.user.findUnique({
        where: {
            email: String(email),
        }
    });
    if (!user){
        return res.status(404).json({message: "User not found"});
    }
    res.json({message: "User fetched cuccessfully", data: user});
}