import {
  UpdateRideStatusMutationArgs,
  UpdateRideStatusResponse,
} from "src/types/graph";
import { Resolvers } from "src/types/resolvers";
import Chat from "../../../entities/Chat";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async (
        _,
        args: UpdateRideStatusMutationArgs,
        { req, pubSub }
      ): Promise<UpdateRideStatusResponse> => {
        const user: User = req.user;
        if (user.isDriving) {
          try {
            let ride: Ride | undefined;
            if (args.status === "ACCEPTED") {
              ride = await Ride.findOne(
                {
                  id: args.rideId,
                  status: "REQUESTING",
                },
                { relations: ["passenger", "driver"] }
              );
              if (ride) {
                ride.driver = user;
                user.isTaken = true;
                user.save();
                const chat = await Chat.create({
                  driver: user,
                  passenger: ride.passenger,
                }).save();
                ride.chat = chat;
                ride.save();
              }
            } else {
              ride = await Ride.findOne(
                {
                  id: args.rideId,
                  driver: user,
                },
                { relations: ["passenger", "driver"] }
              );
            }
            if (ride) {
              ride.status = args.status;
              if (ride.status === "FINISHED") {
                ride.driver = user;
                user.isTaken = false;
                user.save();
                const passenger = await User.findOne({ id: ride.passengerId });
                if (passenger) {
                  passenger.isRiding = false;
                  passenger.save();
                }
              }
              ride.save();
              pubSub.publish("rideUpdate", { RideStatusSubscription: ride });
              return {
                ok: true,
                error: null,
                rideId: ride.id,
              };
            } else {
              return {
                ok: false,
                error: "Can't update ride",
                rideId: null,
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              rideId: null,
            };
          }
        } else {
          return {
            ok: false,
            error: "You are not driving",
            rideId: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
