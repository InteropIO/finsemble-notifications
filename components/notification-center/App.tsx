import * as React from "react";
import { StoreProvider } from "./store/Store";
import Center from "./components/Center";
import Notification from "./components/Notification";
import useNotifications from "../hooks/useNotifications";

const App = () => {
  const { notifications } = useNotifications();
  return (
    <StoreProvider>
      <Center notifications={notifications} />
    </StoreProvider>
  );
};

export default App;
