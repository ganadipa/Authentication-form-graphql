import { users } from "./dummy";
import { SignInArgs, SignUpArgs } from "./types";
import bcrypt from "bcrypt";  

export const resolvers = {
  Query: {
    hello: () => "Hello, world!"
  },

  Mutation: {
    signUp: async (_: any, { username, email, password }: SignUpArgs) => {
      if (users.some(user => user.email === email)) {
        throw new Error('Email already in use.');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: users.length + 1,
        username,
        email,
        hashedPassword
      };
      users.push(newUser);
      return { token: "111", message: "Sign-up successful" };
    },
    signIn: async (_: any, { email, password }: SignInArgs) => {
      const user = users.find(user => user.email === email);
      if (!user) {
        throw new Error('User not found.');
      }
      const isValid = await bcrypt.compare(password, user.hashedPassword);
      if (!isValid) {
        throw new Error('Invalid password.');
      }
      return { token: "222", message: "Sign-in successful" };
    }
  }
};