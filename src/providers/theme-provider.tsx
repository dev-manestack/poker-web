import { ConfigProvider, theme } from "antd";

const pokerDarkTheme = {
  token: {
    colorPrimary: "#ef5350",
    colorSuccess: "#66bb6a",
    colorInfo: "#29b6f6",
    colorWarning: "#ffb300",
    colorError: "#e53935",
    borderRadius: 6,
    colorBgBase: "#090F21",
    colorTextBase: "#e0e0e0",
    colorBgContainer: "#0b1a48",
    fontFamily: "Montserrat, sans-serif",
  },
  components: {
    Button: {
      colorPrimaryHover: "#ff1744",
      borderRadius: 4,
    },
    Card: {
      colorBgContainer: "#1c1c1c",
    },
    Modal: {
      colorBgElevated: "#2c2c2c",
    },
    Select: {
      colorBgContainer: "#121529",
      colorText: "#fff",
      // colorBorder: "#6a1b9a",
      // colorPrimaryHover: "#ff1744",
    },
    Badge: {
      dotSize: 16,
    },
  },
  algorithm: theme.darkAlgorithm,
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <ConfigProvider theme={pokerDarkTheme}>{children}</ConfigProvider>;
};

export default ThemeProvider;
