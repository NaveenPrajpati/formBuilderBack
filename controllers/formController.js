import Form from "../models/formModal.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import cloudinaryConfig from "../config/cloudinaryConfig.js";

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

export const addFrom = async (req, res) => {
  try {
    console.log(req.body);
    const { header, description, fields, headerImg } = req.body;

    const form = new Form({ header, description, headerImg, fields });
    const savedForm = await form.save();
    res.status(201).json({ message: "formadded", data: savedForm });
  } catch (error) {
    console.error("Error saving form:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateFrom = async (req, res) => {
  try {
    const formId = req.params.id;
    console.log(formId, req.body);
    const fo = await Form.findById(formId);
    // console.log(fo);
    if (!fo) {
      return res.status(404).json({ message: "form not found" });
    }
    // Update the form fields with new data
    Object.assign(fo, req.body);
    const savedForm = await fo.save();
    res.status(201).json({ message: "formadded", data: savedForm });
  } catch (error) {
    console.error("Error saving form:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const deleteFrom = async (req, res) => {
  try {
    const formId = req.params.id;
    const fo = await Form.findById(formId);
    if (!fo) {
      return res.status(404).json({ message: "form not found" });
    }
    const data = await Form.findByIdAndDelete(formId);

    res.status(200).json({ message: "form deleted", data });
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getAllForms = async (req, res) => {
  try {
    const data = await Form.find().sort({ createdAt: -1 });
    res.status(201).json({ message: "form fetched", data: data });
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
