import { Router } from "express";
const router = Router();
import upload from "../middlewares/fileupload.js";
import {
  addFrom,
  getAllForms,
  uploadImg,
} from "../controllers/formController.js";

router.post("/form", addFrom);
router.get("/form", getAllForms);
router.post("/upload-image", upload.single("image"), uploadImg);

export default router;
