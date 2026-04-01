import { useMemo } from "react";
import type { MovieCredit } from "../../types/movie";
import ScrollRow from "../common/ScrollRow";
import { JOB_KO, FEATURED_JOBS } from "../../constants/jobKo";

interface MovieCreditProps {
  movieCredit: MovieCredit;
}

// 영화 제작진 및 출연진 목록
const MovieCreditList = ({ movieCredit }: MovieCreditProps) => {
  // 직책별 제작진
  const crewByJob = useMemo(
    () =>
      FEATURED_JOBS.reduce<Record<string, typeof movieCredit.crew>>(
        (acc, job) => {
          const members = movieCredit.crew.filter((m) => m.job === job);
          if (members.length > 0) acc[job] = members;
          return acc;
        },
        {},
      ),
    [movieCredit],
  );

  return (
    <div className="px-16 py-8 bg-gray-900 flex flex-col gap-10">
      {/* 출연 */}
      <section>
        <h2 className="text-white text-xl font-semibold mb-4">출연</h2>
        <ScrollRow items={movieCredit.cast} />
      </section>

      {/* 제작진 - 직책별 */}
      <section className="flex flex-col gap-6">
        <h2 className="text-white text-xl font-semibold">제작진</h2>
        {Object.entries(crewByJob).map(([job, members]) => (
          <div key={job}>
            <h3 className="text-gray-400 text-sm font-semibold mb-3 uppercase tracking-wider">
              {JOB_KO[job]}
            </h3>
            <ScrollRow items={members} />
          </div>
        ))}
      </section>
    </div>
  );
};

export default MovieCreditList;
