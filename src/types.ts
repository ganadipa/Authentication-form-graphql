

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
    hashed_password: string; // Note: It's important to ensure consistency in naming conventions
  }
  