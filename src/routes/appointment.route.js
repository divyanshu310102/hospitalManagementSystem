import { Router } from "express";
import { getAllAppointments, postAppointment, updateAppointmentStatus } from "../controllers/appointment.controller.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/post-appointment").post(VerifyJWT,postAppointment)
router.route("/get-appointment").get(VerifyJWT,getAllAppointments)
router.route("/update-appointment").post(VerifyJWT,updateAppointmentStatus)



export default router;