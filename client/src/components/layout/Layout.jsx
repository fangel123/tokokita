import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet /> {/* Ini akan merender komponen halaman sesuai rute */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
