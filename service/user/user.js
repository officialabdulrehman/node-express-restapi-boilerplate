import { ServiceCRUD } from "../service.crud";
import { userDAO } from "../../dao/user/user";

import { UserDTO } from "../../dto/user/User.dto";

class UserService extends ServiceCRUD {}

export const userService = new UserService(userDAO);
export default userService;
