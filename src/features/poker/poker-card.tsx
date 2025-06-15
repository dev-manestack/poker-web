import { useEffect, useState } from "react";
import { BackCard, PokerCardImage } from "../../assets/card";
import { motion } from "motion/react";
import { Howl } from "howler";
import { FlipCardAudio } from "../../assets/sounds";
import type { GameCard } from "../../api/game";

function PokerCard({
  style,
  info,
}: {
  style?: React.CSSProperties;
  info: GameCard;
}) {
  const [cardImage, setCardImage] = useState<null | string>(null);

  useEffect(() => {
    if (info.secret) {
      setCardImage(BackCard);
      return;
    } else if (info.suit && info.rank) {
      const suitObj = PokerCardImage[info.suit];
      const imagePath = suitObj ? suitObj[info.rank] : undefined;
      if (typeof imagePath === "string") {
        setCardImage(imagePath);
      } else {
        setCardImage("");
        console.error(`Image not found for card: ${info.suit} ${info.rank}`);
      }
    }
  }, [info]);

  useEffect(() => {
    if (info.secret) {
      const sound = new Howl({
        src: [FlipCardAudio],
        volume: 0.5,
      });
      sound.play();
    }
  }, [info.secret]);

  if (!cardImage) {
    return null;
  }

  return (
    <motion.img
      src={cardImage}
      style={{
        ...style,
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  );
}

export default PokerCard;
