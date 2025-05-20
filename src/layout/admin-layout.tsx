import { Flex, Layout, Menu, Spin, Typography, type MenuProps } from "antd";
import AdminHeader from "../components/admin-header";
import {
  ContainerOutlined,
  MoneyCollectFilled,
  PieChartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
const { Content, Sider } = Layout;
const { Text } = Typography;

type MenuItem = Required<MenuProps>["items"][number];

function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const checkedAuth = useSelector((state: any) => state.auth.checkedAuth);

  const items: MenuItem[] = [
    {
      key: "1",
      icon: <PieChartOutlined />,
      label: "Хяналтын Самбар",
      onClick: () => navigate("/admin"),
    },
    {
      key: "2",
      icon: <ContainerOutlined />,
      label: "Хэрэглэгч",
      onClick: () => navigate("/admin/user"),
    },
    {
      key: "sub1",
      label: "Гүйлгээ",
      icon: <MoneyCollectFilled />,
      children: [
        {
          key: "3",
          label: "Цэнэглэлт",
          onClick: () => navigate("/admin/withdraw"),
        },
        {
          key: "4",
          label: "Мөнгө Олгох",
          onClick: () => navigate("/admin/deposit"),
        },
      ],
    },
  ];

  useEffect(() => {
    if (!checkedAuth) {
      return;
    }
    if (!isAuthenticated) {
      navigate("/auth/login", { replace: true });
    } else {
    }
    setIsCheckingAuth(false);
  }, [isAuthenticated, navigate, checkedAuth]);

  if (isCheckingAuth) {
    return (
      <Flex
        vertical
        justify="center"
        align="center"
        gap={10}
        style={{
          height: "100vh",
          width: "100%",
        }}
      >
        <AdminHeader style={{ display: "none" }} />
        <Spin />
        <Text>Түр хүлээнэ үү. Таны эрхийн тохиргоог шалгаж байна.</Text>
      </Flex>
    );
  }

  return (
    <Layout
      style={{
        height: "100vh",
        width: "100%",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Sider>
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          items={items}
        />
      </Sider>
      <Content>
        <AdminHeader />
        <Flex
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "10px 24px",
          }}
        >
          {children}
        </Flex>
      </Content>
    </Layout>
  );
}

export default AdminLayout;
