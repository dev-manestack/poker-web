import { Provider } from "react-redux";
import { store } from "./store";
import { ConfigProvider } from "antd";
import { theme } from "./theme";

function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </Provider>
  );
}

export default AppProvider;
