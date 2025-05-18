import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  algorithm: [],
  token: {
    colorBgBase: "#030711",
    colorPrimary: "#743c74",
    colorText: "#EEFFFF",
    colorBgContainer: "#0B1028",
    controlOutline: "#743c74",
  },
  components: {
    Table: {
      rowHoverBg: "#2d2c36",
    },
    Skeleton: {
      gradientFromColor: "#2d2c36",
      gradientToColor: "#743c74",
    },
  },
};

export { theme };

/*
primary: "#a59aa2",
secondary: "#2d2c36",
tertiary: "#743c74",
*/
