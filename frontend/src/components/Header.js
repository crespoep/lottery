import HamburgerButton from "./HamburgerButton";
import Navbar from "./Navbar";

const Header = ({ account, setAccount }) => {
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
    <header>
      <HamburgerButton />
      <Navbar />
      {
        account
          ? <div>{ account }</div>
          : <button id="connectWallet" onClick={connectWallet}>Connect wallet</button>
      }
    </header>
  )
}

export default Header;
