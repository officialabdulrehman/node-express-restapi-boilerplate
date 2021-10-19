import { ServiceCRUD } from "../service.crud";
import { userDAO } from "../../dao/user/user";

import { UserDTO } from "../../dto/user/User.dto";
import { verifyPassword, genToken } from "../../config/auth/jwt";

class UserService extends ServiceCRUD {
  transformUser(user) {
    delete user["password"];
    return user;
  }

  async signup(data) {
    const hashedPassword = await genPassword(data.password);
    const user = await this.create({ ...data, password: hashedPassword });
    delete user["password"];
    return user;
  }

  async signin(data) {
    const { email, password } = data;
    const user = await userDAO.findByEmail(email);
    if (!(await verifyPassword(password, user.password)))
      throw new Error("Invalid Password");
    const token = genToken({ id: user.id, email: user.email, role: user.role });
    return {
      auth: {
        token: token,
      },
      profile: this.transformUser(user),
    };
  }

  async getSelfProfile(userId) {
    const user = await userDAO.findById(userId);
    return this.transformUser(user);
  }
}

export const userService = new UserService(userDAO);
export default userService;
