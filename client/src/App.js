import { useState } from "react";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";

function App() {
  const [ account, setAccount ] = useState(null)
  const [ balance, setBalance ] = useState(null)

  return (
    <div className="text-light-green w-11/12 m-auto grandient">
      <Header account={account} setAccount={setAccount} balance={balance} setBalance={setBalance} />
      <div className="container">
        <Outlet context={[ account ]} />
      </div>
    </div>
  );
}

export default App;
