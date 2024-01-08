"use server";

import Question from "@/database/question.modal";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export const viewQuestion = async (params: ViewQuestionParams) => {
  try {
    await connectToDatabase();
    const { questionId, userId } = params;
    // update view of question
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });
    if (userId) {
      const existingInteracion = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteracion) {
        return console.log("User as already viewed");
      }

      // create interaction
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
