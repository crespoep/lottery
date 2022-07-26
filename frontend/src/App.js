import { useState } from "react";
import './App.css';

function App() {
  const [ account, setAccount ] = useState(null)

  const connectWallet = async () => {
    const { ethereum } = window;
    const [ account ] = await ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(account)

    ethereum.on("accountsChanged", async (accounts) => {
      const newAccount = accounts[0];
      setAccount(newAccount);
    })
  }

  return (
    <div className="App">
      <header>
        {
          account
            ? <div>{ account }</div>
            : <button id="connectWallet" onClick={connectWallet}>Connect wallet</button>
        }
      </header>
    </div>
  );
}

export default App;
