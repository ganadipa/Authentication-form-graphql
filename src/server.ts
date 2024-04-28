import express from 'express';
import { ApolloServer, ServerRegistration, gql } from 'apollo-server-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import path from 'path';


const app = express();
// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()); 


const server = new ApolloServer({ typeDefs, resolvers });

async function startApolloServer() {
    await server.start();
    server.applyMiddleware({ app } as ServerRegistration);
}

startApolloServer();

const PORT = 3055;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`);
});


app.get('/', (req, res) => {
  console.log('index.html served');
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));
});