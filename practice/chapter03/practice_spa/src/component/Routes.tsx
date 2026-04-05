import ErrorPage from "../pages/ErrorPage";
import ExtraPage from "../pages/ExtraPage";
import Home from "../pages/Home";

 const Routes = (path:string) => {
    switch (path) {
        case '/':
          return <Home />;
        case '/ExtraPage':
          return <ExtraPage />;
        default:
          return <ErrorPage />;
    }
 }

 export default Routes
