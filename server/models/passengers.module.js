import mongoose from "mongoose";

const passengersSchema = mongoose.Schema({
  createdAt: { type: Date, required: true },
  in: { type: Number, required: true },
  out: { type: Number, required: true },
  inFrame: { type: Number, required: true },
});

export default mongoose.model("Passengers", passengersSchema);
