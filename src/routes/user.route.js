import { Router } from "express";
import { addNewDoctor, patientRegister } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.route("/patient-register").post(patientRegister)
router.route("/doctor-register",).post(upload.single("docAvatar"),addNewDoctor)


export default router;