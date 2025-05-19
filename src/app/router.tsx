import { BrowserRouter, Route, Routes } from "react-router";
import UserLayout from "../layout/user-layout";
import HomePage from "../pages/user/home-page";
import TablePage from "../pages/user/table-page";
import AdminLayout from "../layout/admin-layout";
import AuthPage from "../pages/auth-page";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/table/:id" element={<TablePage />} />
        <Route path="/admin">
          <Route
            path="/admin/user/*"
            element={
              <AdminLayout>
                <div>User</div>
              </AdminLayout>
            }
          />
          <Route
            path="/admin/withdraw/*"
            element={
              <AdminLayout>
                <div>Withdraw</div>
              </AdminLayout>
            }
          />
          <Route
            path="/admin/deposit/*"
            element={
              <AdminLayout>
                <div>Deposit</div>
              </AdminLayout>
            }
          />
          <Route
            path="/admin/settings/*"
            element={
              <AdminLayout>
                <div>Settings</div>
              </AdminLayout>
            }
          />
          <Route
            index
            element={
              <AdminLayout>
                <div>Dashboard</div>
              </AdminLayout>
            }
          />
        </Route>
        <Route path="/auth">
          <Route
            path="/auth/login"
            element={
              <UserLayout>
                <AuthPage type="login" />
              </UserLayout>
            }
          />
          <Route
            path="/auth/register"
            element={
              <UserLayout>
                <AuthPage type="register" />
              </UserLayout>
            }
          />
          <Route
            path="/auth/forgot-password"
            element={
              <UserLayout>
                <AuthPage type="forgot-password" />
              </UserLayout>
            }
          />
        </Route>
        <Route
          index
          element={
            <UserLayout>
              <HomePage />
            </UserLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
