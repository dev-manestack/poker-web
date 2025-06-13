import { useState, useEffect } from "react";
import { Layout } from "antd";
import UserHeader from "../components/user-header";
import LoadingPage from "../components/loadingPage";

const { Header, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  padding: 0,
  background: "none",
};

interface UserLayoutProps {
  children: React.ReactNode;
}

function UserLayout({ children }: UserLayoutProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

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
