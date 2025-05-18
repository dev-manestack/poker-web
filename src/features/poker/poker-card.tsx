import { useEffect, useState } from "react";
import { PokerCardImage } from "../../assets/card";

type Suit = keyof typeof PokerCardImage;
type Rank = keyof (typeof PokerCardImage)[Suit];

function PokerCard({ suit, rank }: { suit: Suit; rank: Rank }) {
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

  if (!cardImage) {
    return null; // or a placeholder image
  }

  return (
    <img
      src={cardImage}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  );
}

export default PokerCard;
