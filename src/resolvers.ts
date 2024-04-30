import { ApolloError } from "apollo-server-express";
import { Context, SignInArgs, SignUpArgs, User } from "./types";
import bcrypt from "bcrypt";  
import db from "./db/dbConfig";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";

type TokenPayload = {
  email: string
}

function generateTokenForUser(payload: TokenPayload): string {
  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    throw new ApolloError('JWT_SECRET not set.', "JWT_SECRET_NOT_SET");
  }

  const options = {
    expiresIn: '1h'
  };

  const token = jwt.sign(payload, secretKey, options);

  return token
}

/**
 * This function handles authorization sent via cookies or via headers
 * if (both token are set and inconsistent) then
 *    throw an error
 * else 
 *     token is set to something, check whether the specific token means something.
 */
const currentUserResolver = async (_: any, __: any, { req }: Context) => {
  const tokenFromCookies = req.cookies.token as (string | undefined);
  const tokenFromHeaders = req.headers.token as (string | undefined);
  

  if (!tokenFromCookies && !tokenFromHeaders) {
    return null
  }

  let token;
  if (!tokenFromCookies || !tokenFromHeaders) {
    token = tokenFromCookies || tokenFromHeaders
  } else if (tokenFromCookies != tokenFromHeaders) {
    throw new ApolloError("Authorization token is not consistent!", "TOKEN_INCONSISTENT");
  }

  if (!token) {
    return null;
  }

  let email;
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET as string);
    email = (data as TokenPayload).email;
  } catch (error: unknown) {
    return null;
  }


  if (!email) {
    return null;
  }

  const [result] = await db.query<User[] & RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
  if (result.length === 0) {
    return null;
  }

  const ret: User = {
    id: result[0].id,
    username: result[0].username,
    email: result[0].email
  }


  return ret
}

const signUpResolver = async (_: any, { username, email, password }: SignUpArgs, {res}: Context) => {
  if (username === "" || email === "" || password === "") {
    throw new ApolloError('Invalid input.', "INVALID_INPUT");
  }


  // Check if the email is already in use
  /**
   * This must be use to prevent sql injection
   */
  const [results] = await db.query<User & RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
  (results);
  if (results.length > 0) {
    throw new ApolloError('Email already in use.', "EMAIL_IN_USE");
  }

  /**
   * This is to make the password more secure
   */
  const hashedPassword = await bcrypt.hash(password, 10);

  /**
   * Insert the user into the database
   */
  const result = await db.query<ResultSetHeader & RowDataPacket[]>(
    'INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );


  // Generate a token for the user
  const token = generateTokenForUser({email}); 

  // set cookie
  res.cookie('token', token, { httpOnly: true });

  return { token, message: "Sign-up successful" };
}

const signInResolver = async (_: any, { email, password }: SignInArgs, {res}: Context) => {
  if (email === "" || password === "") {
    throw new ApolloError('Invalid input.', "INVALID_INPUT");
  }


  // Check if the user exists, no sql injection
  const [user] = await db.query<User & RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
  if (Array.isArray(user) && user.length === 0) {
    throw new ApolloError('User not found.', "USER_NOT_FOUND");
  }


  /**
   *  Compare the password with the hashed password
   */
  const isValid = await bcrypt.compare(password, user[0].hashed_password);
  if (!isValid) {
    throw new ApolloError('Invalid password.', "INVALID_PASSWORD");
  }

  // Generate a token for the user
  const token = generateTokenForUser({email});

  // Set cookie
  res.cookie('token', token, { httpOnly: true });

  return { token, message: "Sign-in successful" };
}


export const resolvers = {
  Query: {
    currentUser: currentUserResolver
  },

  Mutation: {
    signUp: signUpResolver,
    signIn: signInResolver
  }
};


