import useRouter from "../router/useRouter";

function AboutPage() {
  const { navigate } = useRouter();
  return (
    <div className="p-8 flex flex-col gap-4">
      <p className="text-sm text-gray-500">
        중첩 경로(/about/first, /about/second)
      </p>
      {/* 중첩 경로로 이동 */}
      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => navigate("/about/first")}
        >
          First
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => navigate("/about/second")}
        >
          Second
        </button>
      </div>
    </div>
  );
}

export default AboutPage;
