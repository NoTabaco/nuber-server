import { GetMyPlacesResponse } from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import User from "../../../entities/User";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Query: {
    GetMyPlaces: privateResolver(
      async (
        _,
        __,
        {
          req: {
            user: { id },
          },
        }
      ): Promise<GetMyPlacesResponse> => {
        try {
          const user = await User.findOne({ id }, { relations: ["places"] });
          if (user) {
            return {
              ok: true,
              error: null,
              places: user.places,
            };
          } else {
            return {
              ok: false,
              error: "User not found",
              places: null,
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            places: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
