import { User } from "../../models/user";

export const isNidNoUnique = async (nidNo: string): Promise<boolean> => {
  if (await User.findOne({ nidNo }, "nidNo").lean()) return Promise.reject(false);

  return Promise.resolve(true);
};
