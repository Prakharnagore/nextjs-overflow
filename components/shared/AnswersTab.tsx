import AnswerCard from "@/components/cards/AnswerCard";
import { getUserAnswers } from "@/lib/actions/user.action";

interface AnswersTabProps {
  userId: string;
  clerkId?: string | null;
  searchProps?: { [key: string]: string | undefined };
}

const AnswersTab = async ({
  searchProps,
  userId,
  clerkId,
}: AnswersTabProps) => {
  const { answers } = await getUserAnswers({
    userId,
  });

  return (
    <>
      {answers.map((answer) => (
        <AnswerCard
          key={answer._id}
          clerkId={clerkId}
          _id={answer._id}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes.length}
          createdAt={answer.createdAt}
        />
      ))}
    </>
  );
};
export default AnswersTab;
