import { User } from "../../models/user";

export const isBearerToken = (header: string): boolean => {
  if (!header.startsWith("Bearer")) return false;

  return true;
};

export const isNidNoUnique = async (nidNo: string): Promise<boolean> => {
  if (await User.findOne({ nidNo }, "nidNo").lean()) return Promise.reject(false);

  return Promise.resolve(true);
};
