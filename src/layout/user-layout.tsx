import { Layout } from "antd";
import UserHeader from "../components/user-header";
const { Header, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  padding: 0,
  background: "none",
};

function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Header style={headerStyle}>
        <UserHeader />
      </Header>
      <Content>{children}</Content>
    </Layout>
  );
}

export default UserLayout;
