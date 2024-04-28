import { ApolloError } from "apollo-server-express";
import { SignInArgs, SignUpArgs, User } from "./types";
import bcrypt from "bcrypt";  
import db from "./db/dbConfig";
import { RowDataPacket } from "mysql2";

function generateTokenForUser(username: string): string {
  // TODO: JWT token generation
  return username
}

const signUpResolver = async (_: any, { username, email, password }: SignUpArgs) => {
  // Check if the email is already in use
  /**
   * This must be use to prevent sql injection
   */
  const [results] = await db.query<User & RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
  console.log(results);
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
  await db.query('INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)', [username, email, hashedPassword]);

  // Generate a token for the user
  const token = generateTokenForUser(username); 

  return { token, message: "Sign-up successful" };
}

const signInResolver = async (_: any, { email, password }: SignInArgs) => {
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
  const token = generateTokenForUser(user[0].username);

  return { token, message: "Sign-in successful" };
}


export const resolvers = {
  Query: {
    hello: () => "Hello, world!"
  },

  Mutation: {
    signUp: signUpResolver,
    signIn: signInResolver
  }
};


