import { BrowserRouter, Route, Routes } from "react-router";
import UserLayout from "../layout/user-layout";
import HomePage from "../pages/user/home-page";
import TablePage from "../pages/user/table-page";
import AdminLayout from "../layout/admin-layout";
import AuthPage from "../pages/auth-page";
import WithdrawPage from "../pages/admin/withdraw-page";
import UserPage from "../pages/admin/user-page";
import DepositPage from "../pages/admin/deposit-page";
import AdminSettingsPage from "../pages/admin/admin-settings-page";
import AdminTable from "../pages/admin/admin-table";
import ProfilePage from "../pages/user/profile-page";
import UserWithdrawPage from "../pages/user/user-withdraw-page";

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
                <UserPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/withdraw/*"
            element={
              <AdminLayout>
                <WithdrawPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/deposit/*"
            element={
              <AdminLayout>
                <DepositPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/settings/*"
            element={
              <AdminLayout>
                <AdminSettingsPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/table/*"
            element={
              <AdminLayout>
                <AdminTable />
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
          path="/profile"
          element={
            <UserLayout>
              <ProfilePage />
            </UserLayout>
          }
        />
        <Route
          path="/balance"
          element={
            <UserLayout>
              <UserWithdrawPage />
            </UserLayout>
          }
        />
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
