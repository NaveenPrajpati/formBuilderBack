import { Schema, model } from "mongoose";

const AnswerSchema = new Schema(
  {
    formId: {
      type: Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    answers: [
      {
        questionId: {
          type: String,
          required: true,
        },
        answer: {
          type: Schema.Types.Mixed,
        },
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default model("Answer", AnswerSchema);
