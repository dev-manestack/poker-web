import { Row, Col, Tabs, Modal } from "antd";
import TableList from "../../features/poker/table-list";
import { useState } from "react";
import TableDetails from "../../features/poker/table-details";
import type { GameTable } from "../../api/admin";
import "../../index.css";
import Footer from "../../components/user-footer";
import { useTranslation } from "react-i18next";
import RegisterForm from "../../features/user/register-form";
import ForgotPasswordForm from "../../features/user/forgot-password-form";
import LoginForm from "../../features/user/login-form";
import { CloseOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

function HomePage() {
  const { t, i18n } = useTranslation();
  const [selectedTable, setSelectedTable] = useState<GameTable | null>(null);
  const [activeTableType, _] = useState<"texas" | "omaha">("texas");
  const [activeTab, setActiveTab] = useState("1");

  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );

  const [modalType, setModalType] = useState("");

  // const onTableTypeChange = (key: string) => {
  //   setActiveTableType(key as "texas" | "omaha");
  //   setSelectedTable(null);
  // };

  const onMainTabChange = (key: string) => {
    setActiveTab(key);
    setSelectedTable(null);
  };

  const lang = i18n.language === "mn" ? "mn" : "en";

  const openLoginModal = () => {
    setModalType("login");
  };

  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}
      >
        <div style={{ flex: 1, padding: 20 }}>
          <Row gutter={[16, 16]} className="full-height">
            <Col xs={24} md={16} className="full-height">
              <Tabs
                className="custom-tabs"
                style={{ width: "100%", height: "100%" }}
                activeKey={activeTab}
                onChange={onMainTabChange}
                items={[
                  {
                    key: "1",
                    label: (
                      <div className="custom-tab-label" lang={lang}>
                        {t("homePage.tabs.tables")}
                      </div>
                    ),
                    children: (
                      <div
                        className={
                          activeTableType === "texas"
                            ? "table-list-texas"
                            : "table-list-omaha"
                        }
                      >
                        <TableList
                          setSelectedTable={setSelectedTable}
                          tableType={activeTableType}
                          isAuthenticated={isAuthenticated}
                          onRequestLogin={openLoginModal}
                        />
                      </div>
                    ),
                  },
                  {
                    key: "2",
                    label: (
                      <div className="custom-tab-label" lang={lang}>
                        {t("homePage.tabs.tournament")}
                      </div>
                    ),
                    children: (
                      <div lang={lang}>
                        {t("homePage.tournament.comingSoon")}
                      </div>
                    ),
                    disabled: true,
                  },
                ]}
              />
            </Col>

            <Col xs={24} md={8} className="full-height">
              <TableDetails table={selectedTable} />
            </Col>
          </Row>
        </div>

        <Footer />

        {/* Modal for Login/Register/Forgot Password */}
        <Modal
          open={modalType.length > 0}
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
      </div>
    </>
  );
}

export default HomePage;
