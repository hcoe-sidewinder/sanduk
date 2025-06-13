import { Request, Response } from "express";
import { post, Resource, Validators } from "../lib/resources";
import { IUser, User } from "../../models/user";
import { checkSchema, matchedData } from "express-validator";
import { Message } from "../../common/messages";
import { ALL_BLOOD_TYPE, ALL_RELATION_TO_FAMILY_ADMIN, ALL_ROLE, ALL_SEX } from "../../models/types/user";
import { hashPassword } from "../../middlewares/authentication";
import { isNidNoUnique } from "../lib/custom-validators";
import { HTTP400Error } from "../../common/errors";

const validators: Validators = checkSchema({
  nidNo: {
    in: "body",
    notEmpty: {
      errorMessage: Message.NID_NO_REQUIRED,
    },
    trim: true,
    nidNoNotInUse: {
      custom: async (nidNo) => {
        return await isNidNoUnique(nidNo);
      },
      errorMessage: Message.NID_NO_ALREADY_EXISTS,
    },
  },
  nidImg: {
    in: "body",
    notEmpty: {
      errorMessage: Message.NID_IMG_REQUIRED,
    },
    trim: true,
  },
  password: {
    in: "body",
    notEmpty: {
      errorMessage: Message.PASSWORD_REQUIRED,
    },
  },
  dob: {
    in: "body",
    notEmpty: {
      errorMessage: Message.DOB_REQUIRED,
    },
    isDate: {
      errorMessage: Message.DATE_INVALID,
    },
  },
  sex: {
    in: "body",
    notEmpty: {
      errorMessage: Message.SEX_REQUIRED,
    },
    trim: true,
    toUpperCase: true,
    isIn: {
      options: [ALL_SEX],
      errorMessage: Message.SEX_INVALID,
    },
  },
  name: {
    in: "body",
    notEmpty: {
      errorMessage: Message.NAME_REQUIRED,
    },
    trim: true,
    isString: {
      errorMessage: Message.NOT_A_STRING,
    },
  },
  bloodtype: {
    in: "body",
    notEmpty: {
      errorMessage: Message.BLOODTYPE_REQUIRED,
    },
    trim: true,
    toUpperCase: true,
    isIn: {
      options: [ALL_BLOOD_TYPE],
      errorMessage: Message.BLOODTYPE_INVALID,
    },
  },
  role: {
    in: "body",
    optional: true,
    trim: true,
    toUpperCase: true,
    isIn: {
      options: [ALL_ROLE],
      errorMessage: Message.ROLE_INVALID,
    },
  },
  isDoctor: {
    in: "body",
    optional: true,
    isBoolean: {
      errorMessage: Message.NOT_A_BOOLEAN,
    },
  },
  // Add doctorDetails here if needed
  familyAdmin: {
    in: "body",
    optional: true,
    trim: true,
    isMongoId: {
      errorMessage: Message.NOT_A_MONGOID,
    },
  },
  relationToFamilyAdmin: {
    in: "body",
    optional: true,
    trim: true,
    toUpperCase: true,
    isIn: {
      options: [ALL_RELATION_TO_FAMILY_ADMIN],
      errorMessage: Message.RELATION_TO_FAMILY_ADMIN_INVALID,
    },
  },
});

export const newUser: Resource = post(
  "/users",
  {
    auth: false,
    validators,
  },
  async (req: Request, res: Response) => {
    const data: IUser = matchedData<IUser>(req);

    if (data.role == "MEMBER" && (!data.familyAdmin || !data.relationToFamilyAdmin))
      throw new HTTP400Error(Message.FAMILY_ADMIN_INFO_REQUIRED);

    const user = await User.create({ ...data, password: hashPassword(data.password) });

    res.success(user);
  },
);
