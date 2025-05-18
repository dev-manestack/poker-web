import { BrowserRouter, Route, Routes } from "react-router";
import UserLayout from "../layout/user-layout";
import NotFound from "../pages/not-found";
import HomePage from "../pages/home-page";
import TablePage from "../pages/table-page";

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
        <Route path="/table/:id" element={<TablePage />} />
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
