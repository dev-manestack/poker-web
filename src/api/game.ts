import type { PokerCardImage } from "../assets/card";
import type { User } from "./user";

const websocketURL = "ws://127.0.0.1:8080/ws/table";

interface WebsocketEvent {
  id: string;
  type: string;
  data: {
    accessToken?: string;
    user?: User;
    error?: string;
  };
}

interface TableState {
  seats: Record<number, GamePlayer>;
}

type Suit = keyof typeof PokerCardImage;
type Rank = keyof (typeof PokerCardImage)[Suit];

type GameCard = {
  suit: Suit | null;
  rank: Rank | null;
  secret: boolean;
};

interface GamePlayer {
  user: User;
  stack: number;
  isAllIn: boolean;
  isFolded: boolean;
  holeCards: GameCard[];
  currentBet: number;
  seatId: number;
  hand: GameHand | null;
}

interface GameHand {
  rank:
    | "HIGH_CARD"
    | "ONE_PAIR"
    | "TWO_PAIR"
    | "THREE_OF_A_KIND"
    | "STRAIGHT"
    | "FLUSH"
    | "FULL_HOUSE"
    | "FOUR_OF_A_KIND"
    | "STRAIGHT_FLUSH"
    | "ROYAL_FLUSH";
  combinationCards: GameCard[];
}

export { websocketURL };
export type { WebsocketEvent, TableState, GamePlayer, GameCard };
