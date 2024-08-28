import { Router } from "express";
import { addNewAdmin, addNewDoctor, login, patientRegister } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.route("/patient-register").post(patientRegister)
router.route("/doctor-register").post(upload.single("docAvatar"),addNewDoctor)
router.route("/admin-register").post(addNewAdmin)
router.route("/login").post(login)



export default router;