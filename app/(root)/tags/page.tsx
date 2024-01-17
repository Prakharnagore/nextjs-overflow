import React from "react";
import Filter from "@/components/shared/search/Filter";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { TagFilters } from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import { getAllTags } from "@/lib/actions/tag.actions";
import Link from "next/link";
import { SearchParamsProps } from "@/types";
import Pagination from "@/components/shared/Pagination";

const Tags = async ({ searchParams }: SearchParamsProps) => {
  const { tags, isNext } = await getAllTags({
    searchQuery: searchParams?.q,
    filter: searchParams?.filter,
    page: searchParams?.page ? +searchParams?.page : 1,
  });

  const pageNumber = searchParams?.page ? +searchParams?.page : 1;

  return (
    <React.Fragment>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for tags"
          otherClasses="flex-1"
        />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Link
              href={`/tags/${tag._id}`}
              key={tag._id}
              className="shadow-light100_darknone"
            >
              <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">
                    {tag.name}
                  </p>
                </div>
                <p className="small-medium text-dark400_light500 mt-3.5">
                  <span className="body-semibold primary-text-gradient mr-2.5">
                    {tag.questions.length}+
                  </span>{" "}
                  Questions
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title="No tags found"
            description="It's look like there's no tags"
            link="/ask-question"
            linkTitle="Ask a question "
          />
        )}
      </section>
      <div className="mt-10">
        <Pagination pageNumber={pageNumber} isNext={isNext} />
      </div>
    </React.Fragment>
  );
};

export default Tags;
