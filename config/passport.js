const passport = require("passport");
const LocalStrategy = rqeuire("passport-local").Strategy;
const { validPassword } = require("../lib/passwordUtils");
const { PrismaClient } = require("@prisma/client");
