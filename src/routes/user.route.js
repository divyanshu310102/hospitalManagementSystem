import { Router } from "express";
import { addNewAdmin, addNewDoctor, getAllDoctors, getUserDetails, login, logoutUser, patientRegister } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {VerifyJWT} from "../middlewares/auth.middleware.js";


const router = Router(); 

router.route("/patient-register").post(patientRegister)
router.route("/doctor-register").post(upload.single("docAvatar"),addNewDoctor)
router.route("/admin-register").post(addNewAdmin)
router.route("/login").post(login)
router.route("/get-user").get(VerifyJWT,getUserDetails)  
router.route("/logout").post(VerifyJWT,logoutUser)
router.route("/get-doctors").get(getAllDoctors)





export default router;