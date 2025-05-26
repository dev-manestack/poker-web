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
}

export { websocketURL };
export type { WebsocketEvent, TableState, GamePlayer, GameCard };
