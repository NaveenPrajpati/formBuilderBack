import { Router } from "express";
import {
  addResponse,
  getFormResponses,
} from "../controllers/answerController.js";

const answerRoutes = Router();

answerRoutes.post("/response", addResponse);
answerRoutes.get("/response/:formId", getFormResponses);

export default answerRoutes;
