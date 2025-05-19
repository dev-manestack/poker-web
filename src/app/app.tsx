import { Flex } from "antd";
import AppProvider from "./provider";
import Router from "./router";

function App() {
  return (
    <Flex style={{}}>
      <AppProvider>
        <Router />
      </AppProvider>
    </Flex>
  );
}

export default App;
