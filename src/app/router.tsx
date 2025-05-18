import { BrowserRouter, Route, Routes } from "react-router";
import UserLayout from "../layout/user-layout";
import NotFound from "../pages/not-found";
import HomePage from "../pages/home";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
          element={
            <UserLayout>
              <HomePage />
            </UserLayout>
          }
        />
        <Route
          index
          element={
            <UserLayout>
              <NotFound />
            </UserLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
