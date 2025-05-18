import { Flex } from "antd";
import AppProvider from "./provider";
import Router from "./router";

function App() {
  return (
    <Flex style={{ height: "100vh", width: "100vw" }}>
      <AppProvider>
        <Router />
      </AppProvider>
    </Flex>
  );
}

export default App;
