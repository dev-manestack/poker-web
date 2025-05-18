import { useEffect, useState } from "react";
import { BackCard, PokerCardImage } from "../../assets/card";
import { motion } from "motion/react";
import { Howl } from "howler";
import { FlipCardAudio } from "../../assets/sounds";

type Suit = keyof typeof PokerCardImage;
type Rank = keyof (typeof PokerCardImage)[Suit];

type CardInfo = {
  suit: Suit;
  rank: Rank;
  isRevealed: boolean;
};

function PokerCard({
  suit,
  rank,
  isRevealed = false,
}: {
  suit: Suit;
  rank: Rank;
  isRevealed: boolean;
}) {
  const [cardImage, setCardImage] = useState<null | string>(null);

  useEffect(() => {
    const suitObj = PokerCardImage[suit];
    const imagePath = suitObj ? suitObj[rank] : undefined;

    if (typeof imagePath === "string") {
      setCardImage(imagePath);
    } else {
      setCardImage("");
      console.error(`Image not found for card: ${suit} ${rank}`);
    }
  }, [suit, rank]);

  useEffect(() => {
    if (isRevealed) {
      const sound = new Howl({
        src: [FlipCardAudio],
        volume: 0.5,
      });
      sound.play();
    }
  }, [isRevealed]);

  if (!cardImage) {
    return null;
  }

  return (
    <motion.img
      src={isRevealed ? cardImage : BackCard}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1, rotateY: isRevealed ? 0 : 180 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  );
}

export default PokerCard;

export type { CardInfo, Suit, Rank };
