import * as React from "react";
import Center from "./components/Center";
import useNotifications from "../hooks/useNotifications";

const App = (): React.ReactElement => {
  const { notifications } = useNotifications();
  return (
    <div>
      <Center notifications={notifications} />
    </div>
  );
};

export default App;
