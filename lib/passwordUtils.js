const bcrypt = require("bcryptjs");

// function for checking if pasword provided checks out with DB password
function validatePassword(password, hash) {
  if (hash == undefined) {
    return false;
  }

  let hashVerify = bcrypt.compareSync(password, hash);

  console.log("HASH CHECK");
  console.log(hashVerify);
  return hashVerify;
}

// function for generating password hash before storage
async function genPassword(password) {
  let salt = await bcrypt.genSalt(10);

  const hash = bcrypt.hashSync(password, salt);

  return hash;
}

module.exports.validatePassword = validatePassword;
module.exports.genPassword = genPassword;
