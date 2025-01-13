import { Request, Response } from "express";
import PersonModel from "../models/grandpa.model";


export const createGrandpa = async (req: Request, res: Response) => {
  try {
    const { id, name, age, veteran, children } = req.body;

    // Create the children recursively
    const createChildren = async (childrenData: any[]): Promise<any[]> => {
      const createdChildren = [];
      for (const childData of childrenData) {
        const { id, name, age, veteran, children } = childData;

        const child = new PersonModel({
          id,
          name,
          age,
          veteran,
          children: await createChildren(children || []), 
        });

        await child.save();
        createdChildren.push(child._id);
      }
      return createdChildren;
    };

    // Create the grandpa
    const grandpa = new PersonModel({
      id,
      name,
      age,
      veteran,
      children: await createChildren(children || []),
    });

    await grandpa.save();
    res.status(201).json({ message: "Grandpa created successfully", grandpa });
  } catch (error) {
    console.error("Error creating grandpa:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
