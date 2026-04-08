import NavBar from "./components/Navbar";
import Router from "./router/Router";
import { RouterProvider } from "./router/RouterContext";

function App() {
  return (
    <RouterProvider>
      <NavBar />
      <Router />
    </RouterProvider>
  );
}

export default App;
