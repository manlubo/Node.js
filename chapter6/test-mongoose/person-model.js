import mongoose, {Schema} from "mongoose";

const personSchema = new Schema({
  name: String,
  age: Number,
  email: { type: String, required: true },
});

export default mongoose.model("Person", personSchema);