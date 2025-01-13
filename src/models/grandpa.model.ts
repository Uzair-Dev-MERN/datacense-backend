import mongoose, { Schema, Document, model } from "mongoose";

// Define the interface for the schema
interface Person extends Document {
  id: string; // Custom ID
  name: string;
  age: number;
  veteran: "yes" | "no";
  children: Person[]; // Self-referencing array for hierarchical structure
}

// Define the schema
const personSchema = new Schema<Person>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  veteran: { type: String, enum: ["yes", "no"], required: true },
  children: [{ type: Schema.Types.ObjectId, ref: "Person" }], 
});

// Create the model
const PersonModel = model<Person>("Person", personSchema);

export default PersonModel;
