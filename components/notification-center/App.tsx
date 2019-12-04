import * as React from "react";
import { StoreProvider } from "./store/Store";
import Center from "./components/Center";
import Notification from "./components/Notification";

const App = () => {
  return (
    <StoreProvider>
      <Center />
    </StoreProvider>
  );
};

export default App;
