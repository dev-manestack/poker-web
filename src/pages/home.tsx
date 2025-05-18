import { Flex } from "antd";
import TableList from "../features/poker/table-list";
import { useState } from "react";
import TableDetails from "../features/poker/table-details";

function HomePage() {
  const [selectedTable, setSelectedTable] = useState<any>(null);

  return (
    <Flex
      style={{
        padding: "20px",
      }}
      gap={10}
    >
      <TableList setSelectedTable={setSelectedTable} />
      <Flex style={{ width: "30%", height: "100%" }}>
        <TableDetails table={selectedTable} />
      </Flex>
    </Flex>
  );
}

export default HomePage;
