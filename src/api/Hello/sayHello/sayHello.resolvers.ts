import { SayHelloQueryArgs, SayHelloResponse } from "src/types/graph";

const resolvers = {
  Query: {
    sayHello: (_, { name }: SayHelloQueryArgs): SayHelloResponse => {
      return {
        error: false,
        text: `Hello ${name}!`,
      };
    },
  },
};

export default resolvers;
