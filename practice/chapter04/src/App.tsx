
import useToggle from "./hooks/useToggle";
  function App() {
     const [isOpen, toggle] = useToggle(false);
    return (
      <div>
        <h1>{isOpen ? "열림" : "닫힘"}</h1>
        <button onClick={toggle}>토글 버튼</button>
      </div>
    )
    
  }

  export default App;