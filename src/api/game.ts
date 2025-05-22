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

interface GameState {
  isAuthenticated: boolean;
  currentSeat: number | undefined;
}

export { websocketURL };
export type { WebsocketEvent, GameState };
