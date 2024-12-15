import { Schema, model } from "mongoose";

const formFieldSchema = new Schema({
  id: { type: String },
  type: { type: String, required: true },
  question: { type: String, default: "" },
  required: { type: Boolean, default: false },
  multipleChoice: { type: Boolean, default: false },
  other: { type: Boolean, default: false },
  image: { type: String, default: null },
  video: { type: String, default: null },
  options: { type: [String], default: [] },
  rows: { type: [String], default: [] },
  columns: { type: [String], default: [] },
  settings: { type: Object, default: {} },
});

const formSchema = new Schema(
  {
    header: { type: String, required: true },
    description: { type: String, default: "" },
    headerImg: { type: String, default: "" },
    fields: [formFieldSchema],
  },
  {
    timestamps: true,
  }
);

const Form = model("Form", formSchema);

export default Form;
