import {
  CloseOutlined,
  CrownOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Drawer, Flex, Modal, Typography } from "antd";
import { useEffect, useState } from "react";
import LoginForm from "../features/user/login-form";
import RegisterForm from "../features/user/register-form";
import ForgotPasswordForm from "../features/user/forgot-password-form";
import { useDispatch, useSelector } from "react-redux";
import { useMeQuery } from "../api/user";
import { logout, setAuthenticated, setUserInfo } from "../providers/auth-slice";
import { useNavigate } from "react-router";
import "../index.css";
import Logo from "../assets/logo.webp";
import { useTranslation } from "react-i18next";
import balance from "../assets/balance-icon2.png";

const { Text } = Typography;

function UserHeader() {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isActive, setIsActive] = useState(true); // Manually controlled active status

  const themeMode = useSelector((state: any) => state.theme.mode);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const { t, i18n } = useTranslation();

  const { data: userInfo, refetch } = useMeQuery();

  useEffect(() => {
    refetch();
  }, [isAuthenticated]);

  useEffect(() => {
    if (userInfo) {
      dispatch(setAuthenticated(true));
      dispatch(setUserInfo(userInfo));
    }
  }, [userInfo]);

  const handleMenuClick = (key: string) => {
    switch (key) {
      case "admin":
        navigate("/admin");
        break;
      case "play":
        navigate("/");
        break;
      case "profile":
        navigate("/profile");
        break;
      case "balance":
        navigate("/balance");
        break;
      case "logout":
        dispatch(logout());
        break;
      default:
        break;
    }
    setDrawerOpen(false);
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      className="user-header-flex"
      style={{
        background: "#10152E",
        width: "100%",
        height: "100%",
        padding: "0px 20px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Flex
        align="center"
        gap={12}
        className="user-header-logo-section"
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        <MenuOutlined
          className="user-header-menu-button"
          style={{ fontSize: 22, cursor: "pointer" }}
          onClick={() => setDrawerOpen(true)}
          aria-label="Menu"
        />
        <img
          src={Logo}
          alt="Logo"
          onClick={() => navigate("/")}
          className="user-header-logo-image"
          style={{
            height: 40,
            objectFit: "cover",
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.5)",
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />

        <span
          onClick={() => navigate("/")}
          className="user-header-logo-text"
          style={{
            fontWeight: "800",
            fontSize: 20,
            userSelect: "none",
            fontStyle: "italic",
          }}
        >
          OchirPoker
        </span>
      </Flex>

      {isAuthenticated ? (
        <Flex align="center" gap={12} className="user-header-flex">
          <Flex
            justify="center"
            align="center"
            onClick={() => navigate("/balance")}
            className="user-header-balance"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate("/balance")}
            aria-label="User balance"
            gap={8}
          >
            <img
              src={balance}
              alt="balance icon"
              className="user-header-balance-icon"
            />

            <Text className="user-header-balance-value">
              {userInfo?.userBalance?.balance.toLocaleString()}₮
            </Text>
          </Flex>

          <Flex
            className="user-header-profile"
            onClick={() => navigate("/profile")}
            align="center"
            gap={12}
          >
            <Avatar
              className="user-header-avatar"
              src={"https://i.imgur.com/SyIZEu7.png"}
              alt={`${userInfo?.username}'s avatar`}
            />

            <Flex vertical style={{ flex: 1 }}>
              <Flex align="center" gap={6}>
                <Text className="user-header-username">
                  {userInfo?.username.toLocaleUpperCase()}
                </Text>
                <span
                  className={`user-status-dot ${
                    isActive ? "active" : "inactive"
                  }`}
                  aria-label={isActive ? "Active user" : "Inactive user"}
                  title={isActive ? "Active" : "Inactive"}
                />
              </Flex>
              <Text
                className="user-header-email"
                style={{ fontSize: 12, color: "#888" }}
              >
                {userInfo?.email}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Button
          type="default"
          onClick={() => setModalType("login")}
          lang="mn"
          className="user-header-login-button"
          style={{ fontSize: 16, padding: "8px 20px" }}
        >
          {t("userHeader.login")}
        </Button>
      )}

      <Drawer
        title={<span lang={i18n.language}>{t("userHeader.menu")}</span>}
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width="auto"
      >
        {isAuthenticated && (
          <Flex vertical gap={10}>
            <Button
              icon={<CrownOutlined />}
              type="text"
              block
              style={{ textAlign: "left", paddingLeft: 10 }}
              onClick={() => handleMenuClick("admin")}
            >
              <span lang={i18n.language}>{t("userHeader.adminMenu")}</span>
            </Button>
            <Button
              icon={<UserOutlined />}
              type="text"
              block
              style={{ textAlign: "left", paddingLeft: 10 }}
              onClick={() => handleMenuClick("profile")}
            >
              <span lang={i18n.language}>{t("userHeader.userProfile")}</span>
            </Button>
            <Button
              icon={<LogoutOutlined />}
              type="text"
              block
              style={{ textAlign: "left", paddingLeft: 10, color: "#888" }}
              onClick={() => handleMenuClick("logout")}
            >
              <span lang={i18n.language}>{t("userHeader.logout")}</span>
            </Button>
          </Flex>
        )}
      </Drawer>

      {/* Modal for Login/Register/Forgot */}
      <Modal
        open={modalType?.length > 0}
        onOk={() => setModalType("")}
        onCancel={() => setModalType("")}
        title={
          modalType === "login"
            ? t("userHeader.login")
            : modalType === "register"
            ? t("userHeader.register")
            : t("userHeader.forgotPassword")
        }
        closeIcon={<CloseOutlined style={{ color: "#EEFFFF" }} />}
        footer={null}
        wrapClassName="custom-login-modal"
      >
        {modalType === "login" && <LoginForm setModalType={setModalType} />}
        {modalType === "register" && (
          <RegisterForm setModalType={setModalType} />
        )}
        {modalType === "forgot-password" && <ForgotPasswordForm />}
      </Modal>
    </Flex>
  );
}

export default UserHeader;
