import { DTO } from "../dto";
import { Roles } from "./Roles";
export class UserDTO extends DTO {
  email = null;
  password = null;
  name = undefined;
  dateOfBirth = undefined;
  phoneNumber = undefined;
  role = Roles.USER;
}
