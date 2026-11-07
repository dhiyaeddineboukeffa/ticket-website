import jwt from "jsonwebtoken";

export const setCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRETKEY);
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
  });
};
