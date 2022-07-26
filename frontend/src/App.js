import { useState } from "react";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import './App.css';

function App() {
  const [ account, setAccount ] = useState(null)
  const [ balance, setBalance ] = useState(null)

  return (
    <div className="App">
      <Header account={account} setAccount={setAccount} balance={balance} setBalance={setBalance} />
      <Outlet />
    </div>
  );
}

export default App;
