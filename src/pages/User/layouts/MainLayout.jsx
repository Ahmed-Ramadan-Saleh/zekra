import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../../compo/user/header";
import Footer from "../../../compo/user/footer";

const MainLayout = () => {
  const { pathname } = useLocation();

  // Automatically scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
