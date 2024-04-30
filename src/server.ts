import 'dotenv/config';
import express from 'express';
import { ApolloServer, ServerRegistration} from 'apollo-server-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import path from 'path';
import cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import { redirectIfLoggedIn, redirectIfNotLoggedIn } from './middleware';



const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json()); 

app.use(cookieParser());


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res })
});

async function startApolloServer() {
    await server.start();
    server.applyMiddleware({ app } as ServerRegistration);
}

startApolloServer();

const PORT = process.env.PORT || 3055;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`);
});

app.get('/', redirectIfLoggedIn, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public', 'main.html'));
})

app.get('/welcome', redirectIfNotLoggedIn, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public', 'welcome.html'));
})
