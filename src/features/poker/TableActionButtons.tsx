import React from "react";
import { Button, Tooltip } from "antd";
import { MdFullscreen } from "react-icons/md";
import { PiPokerChipLight } from "react-icons/pi";
import { CiLogout, CiSaveUp1 } from "react-icons/ci";
import { SlSettings } from "react-icons/sl";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdOutlineReplay } from "react-icons/md";
import { LuMenu } from "react-icons/lu";
import { AiOutlinePlus } from "react-icons/ai";
import pokerTableIcon from "../../assets/pokerTable.svg"; // imported as URL

interface TableActionButtonsProps {
  isPreview: boolean;
  iconBtnStyle: () => React.CSSProperties;
  setModalType: (type: string) => void;
  userHasSeat: boolean;
  seatOut: () => void;
  leaveSeat: (seat: number) => void;
  selectedSeat?: number;
  navigate: (path: string) => void;
  badBeatText?: string; // you can remove this prop if unused elsewhere
}

export default function TableActionButtons({
  isPreview,
  iconBtnStyle,
  setModalType,
  userHasSeat,
  seatOut,
  leaveSeat,
  selectedSeat,
  navigate,
}: TableActionButtonsProps) {
  if (isPreview) return null;

  return (
    <>
      {/* Top-right action buttons */}
      <div
        style={{
          position: "absolute",
          top: 15,
          right: 20,
          display: "flex",
          gap: 7,
          alignItems: "center",
        }}
      >
        <Tooltip title="Recharge" mouseEnterDelay={0} mouseLeaveDelay={0}>
          <Button
            type="text"
            style={iconBtnStyle()}
            onClick={() => setModalType("RECHARGE")}
            icon={<PiPokerChipLight size={28} />}
          />
        </Tooltip>

        <Tooltip title="Replay" mouseEnterDelay={0} mouseLeaveDelay={0}>
          <Button
            type="text"
            style={iconBtnStyle()}
            icon={<MdOutlineReplay size={26} />}
            onClick={() => console.log("replay clicked")}
          />
        </Tooltip>

        <Tooltip title="Information" mouseEnterDelay={0} mouseLeaveDelay={0}>
          <Button
            type="text"
            style={iconBtnStyle()}
            icon={<IoInformationCircleOutline size={28} />}
            onClick={() => console.log("info clicked")}
          />
        </Tooltip>

        <Tooltip title="Settings" mouseEnterDelay={0} mouseLeaveDelay={0}>
          <Button
            type="text"
            style={iconBtnStyle()}
            icon={<SlSettings size={24} />}
            onClick={() => console.log("settings clicked")}
          />
        </Tooltip>

        <Tooltip title="Sit Out" mouseEnterDelay={0} mouseLeaveDelay={0}>
          <Button
            type="text"
            style={{
              ...iconBtnStyle(),
              color: userHasSeat ? "white" : "#888888",
            }}
            icon={<CiSaveUp1 size={28} />}
            disabled={!userHasSeat}
            onClick={() => {
              if (userHasSeat) seatOut();
            }}
          />
        </Tooltip>

        <Tooltip title="Menu" mouseEnterDelay={0} mouseLeaveDelay={0}>
          <Button
            type="text"
            style={iconBtnStyle()}
            icon={<LuMenu size={26} />}
            onClick={() => console.log("menu clicked")}
          />
        </Tooltip>

        <Tooltip title="Full screen" mouseEnterDelay={0} mouseLeaveDelay={0}>
          <Button
            type="text"
            style={iconBtnStyle()}
            onClick={() => {
              const elem = document.documentElement;
              if (!document.fullscreenElement) {
                elem.requestFullscreen();
              } else {
                document.exitFullscreen();
              }
            }}
            icon={<MdFullscreen size={30} style={{ color: "white" }} />}
          />
        </Tooltip>
      </div>

      {/* Logout Button (Top Left) */}
      <Tooltip title="Leave Table" mouseEnterDelay={0} mouseLeaveDelay={0}>
        <Button
          type="primary"
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
          icon={<CiLogout size={24} />}
          onClick={() => {
            leaveSeat(selectedSeat || 0);
            navigate("/");
          }}
        />
      </Tooltip>
      <Tooltip title="Join New Table" mouseEnterDelay={0} mouseLeaveDelay={0}>
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 85,
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={pokerTableIcon}
            alt="Table"
            style={{
              width: 50,
              height: 50,
              filter: "invert(1)",
            }}
          />
        </div>
      </Tooltip>
      <Tooltip title="Join New Table" mouseEnterDelay={0} mouseLeaveDelay={0}>
        <Button
          type="default"
          shape="circle"
          style={{
            position: "absolute",
            top: 25,
            left: 145,
            width: 25,
            height: 30,
            padding: 0,
            boxShadow: "none",
            background: "none",
          }}
          onClick={() => navigate("/")}
        >
          <AiOutlinePlus size={20} style={{ filter: "drop-shadow(0 0 0.5px currentColor)" }} />
        </Button>
      </Tooltip>
    </>
  );
}
