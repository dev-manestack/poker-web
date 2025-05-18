import { Provider, useSelector } from "react-redux";
import { store } from "./store";
import { ConfigProvider } from "antd";
import { theme } from "antd";

const { defaultAlgorithm, darkAlgorithm } = theme;

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSelector((state: any) => state.theme.mode);
  return (
    <ConfigProvider
      theme={{
        algorithm: mode === "dark" ? [darkAlgorithm] : [defaultAlgorithm],
      }}
    >
      {children}
    </ConfigProvider>
  );
}

function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}

export default AppProvider;
