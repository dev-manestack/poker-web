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

interface GamePlayer {
  user: User;
  stack: number;
}

interface GameState {
  isAuthenticated: boolean;
  seats: GamePlayer[];
}

export { websocketURL };
export type { WebsocketEvent, GameState, TableState, GamePlayer };
