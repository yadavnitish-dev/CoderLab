import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VerificationBanner from "../components/VerificationBanner";

const Layout = () => {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <VerificationBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
