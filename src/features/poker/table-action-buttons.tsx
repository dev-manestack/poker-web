import React, { useState } from "react";
import { Button, Tooltip, Drawer } from "antd";
import { MdFullscreen } from "react-icons/md";
import { PiPokerChipLight } from "react-icons/pi";
import { CiLogout, CiSaveUp1 } from "react-icons/ci";
import { SlSettings } from "react-icons/sl";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdOutlineReplay } from "react-icons/md";
import { LuMenu } from "react-icons/lu";
import type { ReactElement } from "react";

interface TableActionButtonsProps {
  isPreview: boolean;
  iconBtnStyle: () => React.CSSProperties;
  setModalType: (type: string) => void;
  userHasSeat: boolean;
  userSeatIndex: number;
  seatOut: () => void;
  leaveSeat: (seat: number) => void;
  selectedSeat?: number;
  navigate: (path: string) => void;
}

export default function TableActionButtons({
  isPreview,
  setModalType,
  userHasSeat,
  userSeatIndex,
  seatOut,
  navigate,

  leaveSeat,
}: TableActionButtonsProps) {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const isTabletOrMobile =
    typeof window !== "undefined" && window.innerWidth <= 1024;
  const isTouchDevice = isTabletOrMobile; // touch devices: no tooltip on touch devices

  if (isPreview) return null;

  const renderWithTooltip = (title: string, element: ReactElement) =>
    !isTouchDevice ? <Tooltip title={title}>{element}</Tooltip> : element;

  const renderLeftButtons = () => (
    <>
      {renderWithTooltip(
        "Recharge",
        <Button
          type="text"
          style={{ fontSize: 10 }}
          onClick={() => {
            setModalType("RECHARGE");
            setDrawerVisible(false);
          }}
          icon={<PiPokerChipLight size={28} />}
        >
          Recharge
        </Button>
      )}
      {renderWithTooltip(
        "Replay",
        <Button
          type="text"
          style={{ fontSize: 10 }}
          icon={<MdOutlineReplay size={26} />}
          onClick={() => setDrawerVisible(false)}
        >
          Replay
        </Button>
      )}
      {renderWithTooltip(
        "Information",
        <Button
          type="text"
          style={{ fontSize: 10 }}
          icon={<IoInformationCircleOutline size={28} />}
          onClick={() => setDrawerVisible(false)}
        >
          Information
        </Button>
      )}
    </>
  );

  const renderRightButtons = () => (
    <>
      {renderWithTooltip(
        "Settings",
        <Button
          type="text"
          style={{ fontSize: 10 }}
          icon={<SlSettings size={24} />}
          onClick={() => setDrawerVisible(false)}
        >
          Settings
        </Button>
      )}
      {renderWithTooltip(
        "Sit Out",
        <Button
          type="text"
          style={{ fontSize: 10, color: userHasSeat ? "white" : "#888888" }}
          icon={<CiSaveUp1 size={28} />}
          disabled={!userHasSeat}
          onClick={() => {
            if (userHasSeat) seatOut();
            setDrawerVisible(false);
          }}
        >
          Sit Out
        </Button>
      )}
      {renderWithTooltip(
        "Full screen",
        <Button
          type="text"
          style={{ fontSize: 10 }}
          onClick={() => {
            const elem = document.documentElement;
            if (!document.fullscreenElement) elem.requestFullscreen();
            else document.exitFullscreen();
            setDrawerVisible(false);
          }}
          icon={<MdFullscreen size={30} />}
        >
          Full Screen
        </Button>
      )}
      {renderWithTooltip(
        "Leave Table",
        <Button
          type="text"
          style={{ fontSize: 10, color: "white" }}
          icon={<CiLogout size={28} />}
          onClick={() => {
            if (userHasSeat) {
              leaveSeat(userSeatIndex);
            }
            navigate("/");
            setDrawerVisible(false);
          }}
        >
          Leave Table
        </Button>
      )}
    </>
  );

  return (
    <>
      {/* Desktop View (width > 1024) */}
      {!isTabletOrMobile && (
        <>
          <div
            style={{
              position: "absolute",
              top: 15,
              left: 20,
              display: "flex",
              gap: 7,
              alignItems: "center",
              zIndex: 10,
            }}
          >
            {renderLeftButtons()}
          </div>
          <div
            style={{
              position: "absolute",
              top: 15,
              right: 20,
              display: "flex",
              gap: 7,
              alignItems: "center",
              zIndex: 10,
            }}
          >
            {renderRightButtons()}
          </div>
        </>
      )}

      {/* Mobile & Tablet View (width <= 1024) */}
      {isTabletOrMobile &&
        renderWithTooltip(
          "Menu",
          <Button
            type="text"
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 999,
            }}
            icon={<LuMenu size={26} />}
            onClick={() => setDrawerVisible(true)}
          />
        )}

      <Drawer
        title="Table Options"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={250}
        bodyStyle={{ padding: 10 }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          {renderLeftButtons()}
          {renderRightButtons()}
        </div>
      </Drawer>
    </>
  );
}
