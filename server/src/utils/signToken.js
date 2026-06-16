const jwt = require("jsonwebtoken");

/*
  Šitas failas atsakingas tik už JWT tokeno sukūrimą.

  JWT viduje saugosim minimaliai:
  - user id

  Pvz. payload:
  {
    id: 1
  }

  Nekišam į JWT slaptažodžio, role ar daug papildomos info.
  Role vis tiek tikrinsim iš DB per protect middleware.
*/

const signToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

module.exports = signToken;