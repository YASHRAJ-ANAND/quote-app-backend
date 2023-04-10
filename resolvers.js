import { quotes, users } from "./fakedb.js";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";

const User = mongoose.model("User");
const Quote = mongoose.model("Quote");

import bcrypt from "bcryptjs";

const resolvers = {
  Query: {
    users: async () => await User.find({}),
    user: async (_, { _id }) => await User.findOne({ _id }),
    quotes: async () => await Quote.find({}).populate("by", "_id firstName"),
    iquote: async (_, { by }) => await Quote.find({ by }),
    myProfile: async (_, args, { userId }) => {
      if (!userId) {
        throw new Error("user must be logged in!");
      }
      return await User.findOne({ _id: userId });
    },
  },
  User: {
    quotes: async (ur) => await Quote.find({ by: ur._id }),
  },
  Mutation: {
    signUpUser: async (_, { userNew }) => {
      const user = await User.findOne({ email: userNew.email });
      if (user) {
        throw new Error("User already exists with this email");
      }
      const hashpassword = await bcrypt.hash(userNew.password, 12);

      const newUser = new User({
        ...userNew,
        password: hashpassword,
      });

      return await newUser.save();
    },
    signInUser: async (_, { userSignIn }) => {
      const findUser = await User.findOne({ email: userSignIn.email });
      if (!findUser) {
        throw new Error("User not found for the email provided");
      }

      const doMatch = await bcrypt.compare(
        userSignIn.password,
        findUser.password
      );

      if (!doMatch) {
        throw new Error("email or password not matched");
      }

      console.log(findUser);

      const token = jwt.sign({ userId: findUser._id }, JWT_SECRET);
      return { token, findUser };
    },
    createQuote: async (_, { name }, { userId }) => {
      if (!userId) {
        throw new Error("user must be logged in!");
      }
      const newQuote = new Quote({
        name,
        by: userId,
      });
      await newQuote.save();
      return "Quote saved successfully";
    },
  },
};

export default resolvers;
