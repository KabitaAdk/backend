import { Request, Response } from "express";

export const hello = (req: Request, res: Response) => {
    res.json({message: "Hello World"});
};

export const addQuery = (req: Request, res: Response) => {
    const a = Number(req.query.a);
    const b = Number (req.query.b);
    res.json({sum: a+b});
};

export const addBody = (req: Request, res: Response) => {
    const { a, b } = req.body;
    res.json ({sum: a+b});
}