import { Outlet } from "react-router-dom";
import Footer from "../Common/Footer";
import Header from "../Common/Header";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      {/** Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>
      {/* Footer  */}
      <Footer />
    </div>
  );
};

export default UserLayout;
