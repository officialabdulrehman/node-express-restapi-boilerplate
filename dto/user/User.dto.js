import { DTO } from "../dto";
import { Roles } from "./Roles";
export class UserDTO extends DTO {
  email = null;
  password = null;
  name = undefined;
  dateOfBirth = undefined;
  phoneNumber = undefined;
  role = Roles.USER;
  //reauth - for refreshing token - if user has reset passsword, don't send new token - to protect a user if password compromised
}
