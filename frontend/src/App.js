import { useState } from "react";
import './App.css';
import LotteryList from "./components/LotteryList";
import Header from "./components/Header";

function App() {
  const [ account, setAccount ] = useState(null)



  return (
    <div className="App">
      <Header account={account} setAccount={setAccount} />

      <LotteryList />
    </div>
  );
}

export default App;
