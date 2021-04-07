import jwt from "jsonwebtoken";
import { User as TUser } from "src/types/graph";
import User from "../entities/User";

const decodeJWT = async (token: string): Promise<TUser | undefined> => {
  try {
    const { id }: any = jwt.verify(token, `${process.env.JWT_TOKEN}`);
    const user = await User.findOne({ id });
    return user;
  } catch (error) {
    return undefined;
  }
};

export default decodeJWT;
