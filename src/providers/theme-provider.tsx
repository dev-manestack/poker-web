import { ConfigProvider, theme } from "antd";
import { useSelector } from "react-redux";

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

export default ThemeProvider;
