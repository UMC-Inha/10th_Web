import useRouter from "../router/useRouter";

function HomePage() {
  const { navigate } = useRouter();
  return (
    <div className="p-8 flex flex-col gap-4">
      <p className="text-sm text-gray-500">pushState로 /user/:id 이동 + state 데이터 전달 실습</p>
      {/* pushState로 이동하면서 state 객체를 함께 전달 */}
      <button
        className="w-fit px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => navigate("/user/1", false, { username: "카사" })}
      >
        데이터 넘기기
      </button>
    </div>
  );
}

export default HomePage;
