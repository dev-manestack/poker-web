import { Flex, Button, Tooltip, Dropdown } from "antd";
import { GlobalOutlined, MessageOutlined, WifiOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/footer.css";
import type { MenuProps } from "antd";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [ping, setPing] = useState<number | string | null>(null);
  const appVersion = "v1.0.3";

  useEffect(() => {
    const interval = setInterval(() => {
      const start = Date.now();
      fetch(window.location.origin, { mode: "no-cors" })
        .then(() => setPing(Date.now() - start))
        .catch(() => setPing(t("offline") || "Offline"));
    }, 5000);
    return () => clearInterval(interval);
  }, [t]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languageMenu: MenuProps["items"] = [
    {
      key: "en",
      label: <span lang="en">English</span>,
    },
    {
      key: "mn",
      label: <span lang="mn">Монгол</span>,
    },
  ];

  const getPingColor = (ping: number | string | null): string => {
    if (ping === null) return "#d9d9d9";
    if (ping === "Offline") return "#ff4d4f";
    if (typeof ping === "number" && ping <= 100) return "#52c41a";
    if (typeof ping === "number" && ping > 100) return "#faad14";
    return "#d9d9d9";
  };

  return (
    <Flex className="footer footer-content">
      <Dropdown
        menu={{
          items: languageMenu,
          onClick: ({ key }) => changeLanguage(key),
        }}
        placement="topLeft"
        arrow
      >
        <Button icon={<GlobalOutlined />} type="text">
          <span lang={i18n.language === "mn" ? "mn" : "en"}>{t("language")}</span>
        </Button>
      </Dropdown>

      <Flex className="footer-center">
        <Tooltip title={<span lang={i18n.language === "mn" ? "mn" : "en"}>{t("connectionSpeed")}</span>}>
          <Flex className="footer-ping">
            <WifiOutlined style={{ color: getPingColor(ping) }} />
            <span lang={typeof ping === "string" ? "en" : i18n.language === "mn" ? "mn" : "en"}>
              {ping ? `${ping} ms` : t("loading")}
            </span>
          </Flex>
        </Tooltip>
        <span>
          <span lang={i18n.language === "mn" ? "mn" : "en"}>{t("version")}</span>: {appVersion}
        </span>
      </Flex>

      <Button icon={<MessageOutlined />} type="text" onClick={() => console.log("Chat Opened")} />
    </Flex>
  );
};

export default Footer;
