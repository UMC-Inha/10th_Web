import { useState, useEffect } from "react";
import Link from "./component/Link";
import Routes from "./component/Routes";

  function App() {
    const [path, setPath] = useState(window.location.pathname);

    useEffect(() => {
      const popState = () => {
        setPath(window.location.pathname);
      };
      window.addEventListener('popstate', popState);
      return () => window.removeEventListener('popstate', popState);
    }, []);
   
    return (
      <div>
        <div>
            <Link to="/" setPath={setPath}>홈</Link>
            <Link to="/ExtraPage" setPath={setPath}>추가페이지</Link>
        </div>
        <div>{Routes(path)}</div>
      </div>
    )
    
  }

  export default App;