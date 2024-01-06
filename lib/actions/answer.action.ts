"use server";

import Answer from "@/database/answer.modal";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.modal";
import { revalidatePath } from "next/cache";

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    connectToDatabase();
    const { author, content, path, question } = params;

    const newAnswer = await Answer.create({
      author,
      content,
      question,
    });

    // add the answer to the question answers array
    // const questionObject =
    await Question.findByIdAndUpdate(question, {
      $push: {
        answers: newAnswer._id,
      },
    });

    // ? add interaction
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAnswers = async (params: GetAnswersParams) => {
  try {
    connectToDatabase();
    const { questionId } = params;

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 });

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
