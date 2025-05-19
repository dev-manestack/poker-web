import { Provider } from "react-redux";
import { store } from "./store";
import ThemeProvider from "../providers/theme-provider";

function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}

export default AppProvider;
