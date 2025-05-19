import { Flex, Tabs, type TabsProps } from "antd";
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
        <Flex style={{ width: "100%", height: "100%" }} gap={10}>
          <TableList setSelectedTable={setSelectedTable} />
          <Flex style={{ width: "30%", height: "100%" }}>
            <TableDetails table={selectedTable} />
          </Flex>
        </Flex>
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
    <Flex
      style={{
        padding: "20px",
      }}
      gap={10}
    >
      <Tabs
        style={{
          width: "100%",
          height: "100%",
        }}
        defaultActiveKey="1"
        items={tabItems}
      />
    </Flex>
  );
}

export default HomePage;
