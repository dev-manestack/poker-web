import { Row, Col, Tabs, type TabsProps } from "antd";
import TableList from "../../features/poker/table-list";
import { useState } from "react";
import TableDetails from "../../features/poker/table-details";
import type { GameTable } from "../../api/admin";
import "../../index.css";

function HomePage() {
  const [selectedTable, setSelectedTable] = useState<GameTable | null>(null);
  const [activeTableType, setActiveTableType] = useState<"texas" | "omaha">("texas");

  const onTableTypeChange = (key: string) => {
    setActiveTableType(key as "texas" | "omaha");
    setSelectedTable(null);
  };

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: <div className="custom-tab-label">Ширээ</div>,
      children: (
        <>
          <Tabs
            type="line"
            activeKey={activeTableType}
            onChange={onTableTypeChange}
            className="table-type-tabs"
            items={[
              {
                key: "texas",
                label: (
                  <div className={`custom-tab-btn ${activeTableType === "texas" ? "active" : ""}`}>Texas Hold'em</div>
                ),
              },
              {
                key: "omaha",
                label: <div className={`custom-tab-btn ${activeTableType === "omaha" ? "active" : ""}`}>Omaha</div>,
              },
            ]}
          />

          <Row gutter={[16, 16]} className="full-height">
            <Col xs={24} md={16} className="full-height">
              <div className={activeTableType === "texas" ? "table-list-texas" : "table-list-omaha"}>
                <TableList setSelectedTable={setSelectedTable} tableType={activeTableType} />
              </div>
            </Col>
            <Col xs={24} md={8} className="full-height">
              {selectedTable ? (
                <TableDetails table={selectedTable} />
              ) : (
                <div className="empty-placeholder">Ширээ сонгоогүй байна</div>
              )}
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: "2",
      label: <div className="custom-tab-label">Тэмцээн</div>,
      children: <div>Tournament game tables will appear here.</div>,
    },
  ];

  return (
    <div style={{ padding: 20, height: "100%" }}>
      <Tabs className="custom-tabs" style={{ width: "100%", height: "100%" }} defaultActiveKey="1" items={tabItems} />
    </div>
  );
}

export default HomePage;
