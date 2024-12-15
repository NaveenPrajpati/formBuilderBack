import { Router } from "express";
const router = Router();
import upload from "../middlewares/fileupload.js";
import {
  addFrom,
  deleteFrom,
  getAllForms,
  updateFrom,
  uploadImg,
} from "../controllers/formController.js";

router.post("/form", addFrom);
router.get("/form", getAllForms);
router.put("/form/:id", updateFrom);
router.delete("/form/:id", deleteFrom);
router.post("/upload-image", upload.single("image"), uploadImg);

export default router;
