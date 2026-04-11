import { Outlet } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-10 py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
