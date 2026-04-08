import useRouter from "../router/useRouter";

// navigate 호출 시 state로 넘어오는 데이터 타입
type UserPageState = {
  username?: string;
};

function UserPage() {
  const { currentPath, state } = useRouter();

  // /user/:id 에서 id 추출
  const userId = currentPath.split("/user/")[1];

  // state는 object | null이라 타입 단언 후 구조분해. null이면 빈 객체로 fallback
  const { username } = (state as UserPageState) ?? {};

  return (
    <div className="p-8">
      <div className="inline-flex p-6 border w-60 border-gray-200 rounded-xl shadow-sm items-center justify-around">
        <div className="flex flex-col gap-1 items-center">
          <span className="text-xs text-gray-400">User ID</span>
          <strong className="text-2xl">{userId}</strong>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <span className="text-xs text-gray-400">Username</span>
          <span className="text-2xl">{username ?? "없음"}</span>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
