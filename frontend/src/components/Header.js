import {BigNumber, ethers} from "ethers";
import HamburgerButton from "./HamburgerButton";
import Navbar from "./Navbar";

const Header = ({
  account,
  setAccount,
  balance,
  setBalance
}) => {
  const connectWallet = async () => {
    const { ethereum } = window;
    const [ account ] = await ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(account)

    const hexEthBalance = await ethereum.request({
      method: "eth_getBalance",
      params: [account, "latest"]
    })

    let ethBalance = ethers.utils.formatEther(BigNumber.from(hexEthBalance));
    ethBalance = (+ethBalance).toFixed(4);
    setBalance(ethBalance);

    ethereum.on("accountsChanged", async (accounts) => {
      const newAccount = accounts[0];
      setAccount(newAccount);

      const newHexBalance = await ethereum.request({
        method: 'eth_getBalance',
        params: [newAccount, 'latest']
      })
      let newEthBalance = ethers.utils.formatEther(BigNumber.from(newHexBalance))
      newEthBalance = (+newEthBalance).toFixed(4);
      setBalance(newEthBalance)
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
