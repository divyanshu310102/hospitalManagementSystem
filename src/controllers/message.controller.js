import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

 const sendMessage = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, username, phone, message } = req.body;
  if([firstName, lastName, email, username, phone, message].some((field) =>
    field?.trim() === "")){
    throw new ApiError(400,"All Fields Required")
}

await Message.create({
    firstName,
    lastName,
    email,
    username,
    phone,
    message,
  });

  return res
  .status(200)
  .json(
    new ApiResponse(200,"Message sent successfully")
  )

})


 const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find();

  if (!messages) {
    throw new ApiError(404, "No messages found");
  }
  return res
  .status(200)
  .json(
    new ApiResponse(200,messages,"Messages retrieved successfully")
  );
});

export {sendMessage, getAllMessages};