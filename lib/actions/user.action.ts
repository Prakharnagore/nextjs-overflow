"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.modal";
import Tag from "@/database/tag.model";
import { FilterQuery } from "mongoose";

export const getUserById = async (params: any) => {
  try {
    connectToDatabase();
    const { userId } = params;

    // get user by id
    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// create a user in the database
export const createUser = async (userData: CreateUserParams) => {
  try {
    connectToDatabase();
    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateUser = async (params: UpdateUserParams) => {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteUser = async (params: DeleteUserParams) => {
  try {
    connectToDatabase();

    const { clerkId } = params;
    const user = await User.findOneAndDelete({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }

    // if user exist delete user data from database
    // quesions,answers,comments etc

    // get user question ids

    // const userQuestionIds = await Question.find({
    //   author: user._id
    // }).distinct('_id');

    // delete user Questions
    await Question.deleteMany({ author: user._id });

    // todo: delete user answers, comments etc

    // delete user
    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();
    // const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const users = await User.find({}).sort({ createdAt: -1 });
    return { users };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();
    const { userId, questionId, path } = params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const isQuestionSaved = user.saved.includes(questionId);
    if (isQuestionSaved) {
      // remove the question from the saved
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();
    // page = 1, pageSize = 20, filter,
    const { clerkId, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    if (!user) {
      throw new Error("User not found");
    }
    const savedQuestions = user.saved;
    return { questions: savedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// export async function name(params:any) {
//   try {
//  connectToDatabase();
//   } catch (error) {
//   console.log(error);
//     throw error;
// }
// }
