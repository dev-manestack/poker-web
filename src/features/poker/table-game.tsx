import { Button } from "antd";
import "./table-game.css";

function TableGame({
  isPreview = false,
  seatCount = 8,
}: {
  isPreview?: boolean;
  seatCount?: number;
}) {
  const centerX = 50;
  const centerY = 50;
  const radiusX = 50;
  const radiusY = 50;

  const seats = Array.from({ length: seatCount }, (_, i) => {
    const angle = (2 * Math.PI * i) / seatCount;
    const x = centerX + radiusX * Math.cos(angle);
    const y = centerY + radiusY * Math.sin(angle);
    const style = {
      left: `${x}%`,
      top: `${y}%`,
      height: "50px",
      width: "50px",
    };
    return (
      <Button className="seat" style={style} key={i}>
        {isPreview ? "" : `Суух`}
      </Button>
    );
  });

  return (
    <div className="table-wrapper">
      <div className="poker-table">{seats}</div>
    </div>
  );
}

export default TableGame;
