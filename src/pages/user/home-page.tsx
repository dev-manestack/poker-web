import { Row, Col, Tabs, type TabsProps } from "antd";
import TableList from "../../features/poker/table-list";
import { useState } from "react";
import TableDetails from "../../features/poker/table-details";

function HomePage() {
  const [selectedTable, setSelectedTable] = useState<any>(null);

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Ширээ",
      children: (
        <Row gutter={[16, 16]} style={{ height: "100%" }}>
          <Col xs={24} md={16} style={{ height: "100%" }}>
            <TableList setSelectedTable={setSelectedTable} />
          </Col>
          <Col xs={24} md={8} style={{ height: "100%" }}>
            {selectedTable ? (
              <TableDetails table={selectedTable} />
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#999",
                  fontStyle: "italic",
                }}
              >
                Ширээ сонгоогүй байна
              </div>
            )}
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: "Тэмцээн",
      children: <div>Тоглогчид</div>,
      disabled: true,
    },
  ];

  return (
    <div style={{ padding: 20, height: "100%" }}>
      <Tabs
        style={{ width: "100%", height: "100%" }}
        defaultActiveKey="1"
        items={tabItems}
      />
    </div>
  );
}

export default HomePage;
