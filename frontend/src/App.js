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
        <div id="hamburger">
          <svg className="fill-white" viewBox="0 0 120 80" width="30" height="30">
            <rect width="100" height="10"></rect>
            <rect y="30" width="100" height="10"></rect>
            <rect y="60" width="100" height="10"></rect>
          </svg>
        </div>
        <nav>
          <ul>
            <li>Home</li>
            <li>About</li>
          </ul>
        </nav>
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
