import mongoose from "mongoose";





const appointmentSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: [true, "First Name Is Required!"],
      
    },
    lastName: {
      type: String,
      required: [true, "Last Name Is Required!"],
      
    },
    email: {
      type: String,
      required: [true, "Email Is Required!"],
      
    },
    phone: {
      type: String,
      required: [true, "Phone Is Required!"],
      
    },
    nic: {
      type: String,
      required: [true, "NIC Is Required!"],
      
    },
    dob: {
      type: String,
      required: [true, "DOB Is Required!"],
    },
    gender: {
      type: String,
      required: [true, "Gender Is Required!"],
      enum: ["Male", "Female"],
    },
    appointment_date: {
      type: String,
      required: [true, "Appointment Date Is Required!"],
    },
    department: {
      type: String,
      required: [true, "Department Name Is Required!"],
    },
    doctor: {
      firstName: {
        type: String,
        required: [true, "Doctor Name Is Required!"],
      },
      lastName: {
        type: String,
        required: [true, "Doctor Name Is Required!"],
      },
    },
    hasVisited: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: [true, "Address Is Required!"],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor Id Is Invalid!"],
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient Id Is Required!"],
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  });

  
  export const Appointment = mongoose.model("Appointment", appointmentSchema);