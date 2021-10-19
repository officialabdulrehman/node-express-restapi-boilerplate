import { MongooseDAO } from "../mongooseDAO";
import { UserDTO } from "../../dto/user/User.dto";
import { UserModel } from "../../models/user/user";

import { query } from "express";

export class UserDAO extends MongooseDAO {
  async findByEmail(email) {
    //Maybe add a check if email was provided to this function
    const result = await this.find({ email }, 1, 1);
    if (result.data.length <= 0)
      throw new Error(`User with email "${email}" not found`);
    return result.data[0];
  }

  async partialSearchByEmail(email, page, perPage) {
    const partialText = new RegExp(email, "i");
    const result = await this.find({ email: partialText }, page, perPage);
    return result;
  }
}

export const userDAO = new UserDAO(UserModel, new UserDTO());

export default userDAO;
