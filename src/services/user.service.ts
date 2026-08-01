import User, { IUser } from "@/models/User";

export async function getUserByEmail(email: string) {
  return await User.findOne({ email }).lean();
}

export async function createUser(data: Partial<IUser>) {
  return await User.create(data);
}