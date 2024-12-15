import Form from "../models/formModal.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import cloudinaryConfig from "../config/cloudinaryConfig.js";
import answerModel from "../models/answerModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImg = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file provided." });
    }
    cloudinaryConfig();
    const file = req.file;

    let imageUrl = "";
    const filePath = path.join(__dirname, "../uploads", file.filename);

    try {
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: "formbuilder",
        resource_type: "auto", // Auto-detect resource type (image, video, etc.)
      });

      // Add the secure URL to the array
      imageUrl = uploadResult.secure_url;

      // Delete the file from the temporary directory
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);

      // Cleanup if something goes wrong
      try {
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }

      // Optionally, rethrow the error or log it
      throw new Error("Failed to upload file. Please try again.");
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      data: imageUrl,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed.",
      error: error.message,
    });
  }
};

export const addResponse = async (req, res) => {
  try {
    const { formId, answers } = req.body;

    if (!formId || !answers) {
      return res
        .status(400)
        .json({ error: "Form ID and answers are required" });
    }
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const formResponse = new answerModel({
      formId,
      answers,
    });

    await formResponse.save();

    res.status(201).json({ message: "Answer saved", data: formResponse });
  } catch (error) {
    console.error("Error saving form:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getFormResponses = async (req, res) => {
  const { formId } = req.params;
  try {
    const data = await answerModel.find({ formId });
    res.status(200).json({ message: "Response fetched", data: data });
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
