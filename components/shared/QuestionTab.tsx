import QuestionCard from "@/components/cards/QuestionCard";
import { getUserQuestions } from "@/lib/actions/user.action";

interface QuestionTabProps {
  userId: string;
  clerkId?: string | null;
  searchProps?: { [key: string]: string | undefined };
}

const QuestionTab = async ({
  searchProps,
  userId,
  clerkId,
}: QuestionTabProps) => {
  const { questions } = await getUserQuestions({
    userId,
  });

  return (
    <>
      {questions.map((question) => (
        <QuestionCard
          key={question._id}
          _id={question._id}
          clerkId={clerkId}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes.length}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}
    </>
  );
};
export default QuestionTab;
