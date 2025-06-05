import { ConfigProvider, theme } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "./theme-slice";

const pokerLightTheme = {
  token: {
    colorPrimary: "#d32f2f", // deep red for poker
    colorSuccess: "#388e3c", // poker table green
    colorInfo: "#0288d1",
    colorWarning: "#fbc02d",
    colorError: "#c62828",
    borderRadius: 6,
    colorBgBase: "#fafafa", // light table background
    colorTextBase: "#1a1a1a",
    colorBgContainer: "#ffffff",
    fontFamily: "Play, sans-serif", // poker-style font if available
  },
  components: {
    Button: {
      colorPrimaryHover: "#b71c1c",
      borderRadius: 4,
    },
    Card: {
      colorBgContainer: "#fffaf0",
    },
    Modal: {
      colorBgElevated: "#fff",
    },
  },
  algorithm: theme.defaultAlgorithm,
};

const pokerDarkTheme = {
  token: {
    colorPrimary: "#ef5350", // vivid red
    colorSuccess: "#66bb6a", // lighter table green
    colorInfo: "#29b6f6",
    colorWarning: "#ffb300",
    colorError: "#e53935",
    borderRadius: 6,
    colorBgBase: "#2C2F33", // dark background
    colorTextBase: "#e0e0e0",
    colorBgContainer: "#2C2F33",
    fontFamily: "Play, sans-serif",
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
  },
  algorithm: theme.darkAlgorithm,
};

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSelector((state: any) => state.theme.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    dispatch(setMode(savedMode));
  }, []);

  return (
    <ConfigProvider theme={mode === "dark" ? pokerDarkTheme : pokerLightTheme}>
      {children}
    </ConfigProvider>
  );
}

export default ThemeProvider;
