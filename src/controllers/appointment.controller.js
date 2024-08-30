import { Appointment } from "../models/appointment.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const postAppointment = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address
  } = req.body;

  // Check for missing or empty required fields
  if (
    [
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      appointment_date,
      department,
      doctor_firstName,
      doctor_lastName,
      hasVisited,
      address,
    ].some(field => !field?.trim())
  ) {
    throw new ApiError(400, "All fields are required");
  }

 
  const doctor = await User.findOne({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  }).select("_id");

  if (!doctor) {
    throw new ApiError(400, "Doctor not found!");
  }

  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId: doctor._id,
    patientId: req.user._id,
  });

  res.status(200).json(
    new ApiResponse(200, appointment, "Appointment sent successfully!")
  );
});






 const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find();
  return res
  .status(200)
  .json(
    new ApiResponse(200,appointments,"All Appointments fetched successfully!!")
  );
});





const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find and update the appointment 
  const appointment = await Appointment.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  // Handle the case where the appointment was not found
  if (!appointment) {
    throw new ApiError(400, "Appointment not found!");
  }  
  return res
  .status(200)
  .json(
    new ApiResponse(200, appointment, "Appointment Updated Successfully")
  );
});






// export const deleteAppointment = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const appointment = await Appointment.findById(id);
//   if (!appointment) {
//     return next(new ErrorHandler("Appointment Not Found!", 404));
//   }
//   await appointment.deleteOne();
//   res.status(200).json({
//     success: true,
//     message: "Appointment Deleted!",
//   });
// });


export {postAppointment,getAllAppointments,updateAppointmentStatus};