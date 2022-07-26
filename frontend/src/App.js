import { useState } from "react";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import './App.css';

function App() {
  const [ account, setAccount ] = useState(null)

  return (
    <div className="App">
      <Header account={account} setAccount={setAccount} />
      <Outlet />
    </div>
  );
}

export default App;
