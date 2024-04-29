import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

type DecodedToken = {
    email: string;
}

export function redirectIfLoggedIn(req: Request, res: Response, next: NextFunction) {
    
    // To tell typescript that the token can be a string or undefined
    const token = req.cookies.token as (string | undefined);

    if (!token) {
        next();
    }

    let email;
    try {
        const data = jwt.verify(token as string , process.env.ACCESS_TOKEN_SECRET!);
        email = (data as DecodedToken).email;
    } catch (error) {
        next();
    }

    if (email) {
        res.redirect('/welcome');
    } else {
        next();
    };
}

export function redirectIfNotLoggedIn(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token as (string | undefined);

    if (!token) {
        res.redirect('/');
    }

    let email;
    try {
        const data = jwt.verify(token as string , process.env.ACCESS_TOKEN_SECRET!);
        email = (data as DecodedToken).email;
    } catch (error) {
        res.redirect('/');
    }

    if (email) {
        next();
    } else {
        res.redirect('/');
    };
}