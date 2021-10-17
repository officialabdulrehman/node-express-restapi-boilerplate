import passportLocal from "passport-local";
import { ExtractJwt } from "passport-jwt";
import _ from "lodash";
import { SESSION_SECRET } from "../../utils/secrets";

const LocalStrategy = passportLocal.Strategy;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SESSION_SECRET,
};
