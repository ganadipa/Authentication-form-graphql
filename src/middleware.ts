import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

type DecodedToken = {
    email: string;
}

export function redirectIfLoggedIn(req: Request, res: Response, next: NextFunction) {
    
    // To tell typescript that the token can be a string or undefined
    const token = req.cookies.token as (string | undefined);

    if (!token) {
        return next();
    }


    let email;
    try {
        const data = jwt.verify(token as string , process.env.JWT_SECRET!);
        email = (data as DecodedToken).email;
    } catch (error) {
        return next();
    }

    if (email) {
        return res.redirect('/welcome');
    } else {
        return next();
    };
}

export function redirectIfNotLoggedIn(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token as (string | undefined);

    if (!token) {
        return res.redirect('/');
    }

    let email;
    try {
        const data = jwt.verify(token as string , process.env.JWT_SECRET!);
        email = (data as DecodedToken).email;
    } catch (error) {
        return res.redirect('/');
    }

    if (email) {
        return next();
    } else {
        return res.redirect('/');
    };
}