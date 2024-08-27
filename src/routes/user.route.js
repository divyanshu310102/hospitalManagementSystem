import { Router } from "express";
import { patientRegister } from "../controllers/user.controller.js";


const router = Router();

router.route("/patient-register").post(patientRegister)


export default router;