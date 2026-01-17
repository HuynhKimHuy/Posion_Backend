import express from 'express'
const UserRouter = express.Router()

UserRouter.get("/me", (req, res) => {
  return new OK({
    message: "ok",
    statusCode: 200,
    metadata: req.user,
  }).send(res);
});

export default UserRouter