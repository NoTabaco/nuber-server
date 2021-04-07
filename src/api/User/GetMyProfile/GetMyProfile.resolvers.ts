import { Resolvers } from "src/types/resolvers";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Query: {
    GetMyProfile: privateResolver(async (_, __, { req: { user } }) => {
      return {
        ok: true,
        error: null,
        user,
      };
    }),
  },
};

export default resolvers;
