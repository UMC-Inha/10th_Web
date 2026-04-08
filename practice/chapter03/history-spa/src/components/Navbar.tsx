import useRouter from "../router/useRouter";

function NavBar() {
  const { navigate } = useRouter();
  return (
    <nav className="flex gap-2 p-4 border-b border-gray-200">
      {/* navigate: history 스택에 push */}
      <button className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200" onClick={() => navigate("/")}>Home</button>
      <button className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200" onClick={() => navigate("/about")}>About</button>

      {/* forward/back: history 스택에서 앞/뒤로 이동 */}
      <button className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200" onClick={() => window.history.forward()}>forward</button>
      <button className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200" onClick={() => window.history.back()}>back</button>

      {/* go(n): n만큼 이동. 음수면 뒤로, 양수면 앞으로 */}
      <button className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200" onClick={() => window.history.go(-2)}>go(-2)</button>
    </nav>
  );
}

export default NavBar;
