import mongoose from "mongoose";

const measurementSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    type: {
      type: String,
      enum: ["shirt", "trouser", "native", "gown", "other"],
      required: true,
    },

    measurements: {
      chest: Number,
      waist: Number,
      hip: Number,
      shoulder: Number,
      sleeve: Number,
      length: Number,
      thigh: Number,
      knee: Number,
      ankle: Number,
    },

    note: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Measurement", measurementSchema);
