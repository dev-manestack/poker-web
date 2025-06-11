import { Row, Col, Tabs } from "antd";
import TableList from "../../features/poker/table-list";
import { useState } from "react";
import TableDetails from "../../features/poker/table-details";
import type { GameTable } from "../../api/admin";
import "../../index.css";
import Footer from "../../components/user-footer";
import { useTranslation } from "react-i18next";

function HomePage() {
  const { t, i18n } = useTranslation();
  const [selectedTable, setSelectedTable] = useState<GameTable | null>(null);
  const [activeTableType, setActiveTableType] = useState<"texas" | "omaha">("texas");
  const [activeTab, setActiveTab] = useState("1");

  const onTableTypeChange = (key: string) => {
    setActiveTableType(key as "texas" | "omaha");
    setSelectedTable(null);
  };

  const onMainTabChange = (key: string) => {
    setActiveTab(key);
    setSelectedTable(null);
  };

  const lang = i18n.language === "mn" ? "mn" : "en";

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
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
                      <>
                        {/* <Tabs
                          type="line"
                          activeKey={activeTableType}
                          onChange={onTableTypeChange}
                          className="table-type-tabs"
                          items={[
                            {
                              key: "texas",
                              label: (
                                <div
                                  className={`custom-tab-btn ${activeTableType === "texas" ? "active" : ""}`}
                                  lang={lang}
                                >
                                  {t("homePage.tableTypes.texas")}
                                </div>
                              ),
                            },
                            {
                              key: "omaha",
                              disabled: true,
                              label: (
                                <div
                                  className={`custom-tab-btn ${activeTableType === "omaha" ? "active" : ""}`}
                                  lang={lang}
                                >
                                  {t("homePage.tableTypes.omaha")}
                                </div>
                              ),
                            },
                          ]}
                        /> */}
                        <div className={activeTableType === "texas" ? "table-list-texas" : "table-list-omaha"}>
                          <TableList setSelectedTable={setSelectedTable} tableType={activeTableType} />
                        </div>
                      </>
                    ),
                  },
                  {
                    key: "2",
                    label: (
                      <div className="custom-tab-label" lang={lang}>
                        {t("homePage.tabs.tournament")}
                      </div>
                    ),
                    children: <div lang={lang}>{t("homePage.tournament.comingSoon")}</div>,
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
      </div>
    </>
  );
}

export default HomePage;
