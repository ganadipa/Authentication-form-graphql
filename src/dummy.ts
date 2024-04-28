import bcrypt from "bcrypt";

export let users = [
    {
        id: 1,
        username: "test",
        email: "test@example.com",
        hashedPassword: bcrypt.hashSync("test123", 10)
    }
];