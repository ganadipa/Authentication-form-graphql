import { Request, Response } from 'express';

export type SignUpArgs = {
    username: string;
    email: string;
    password: string;
};

export type SignInArgs = {
    email: string;
    password: string;
};

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface Context {
    req: Request;
    res: Response;
  }

interface ResultSetHeader {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    info: string;
    serverStatus: number;
    warningStatus: number;
    changedRows: number;
}