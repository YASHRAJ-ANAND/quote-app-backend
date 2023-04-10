import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import typeDefs from "./schemaGql.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_SECRET, mongo_URL } from "./config.js";

mongoose.connect(mongo_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});

mongoose.connection.on("error", (error) => {
  console.log(error);
});

//import modals here
import "./models/User.js";
import "./models/Quotes.js";

import resolvers from "./resolvers.js";

//this is middleware
const context = ({ req }) => {
  const { authorization } = req.headers;
  if (authorization) {
    const { userId } = jwt.verify(authorization, JWT_SECRET);
    return { userId };
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen().then(({ url }) => {
  console.log(`server running at ${url}`);
});
