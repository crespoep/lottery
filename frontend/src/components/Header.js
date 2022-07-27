import {BigNumber, ethers} from "ethers";
import HamburgerButton from "./HamburgerButton";
import Navbar from "./Navbar";
import AccountBalanceLabel from "./AccountBalanceLabel";

const Header = ({
  account,
  setAccount,
  balance,
  setBalance
}) => {
  const getEtherBalance = async (account) => {
    const { ethereum } = window;
    const hexEthBalance = await ethereum.request({
      method: "eth_getBalance",
      params: [account, "latest"]
    })

    let ethBalance = ethers.utils.formatEther(BigNumber.from(hexEthBalance));
    ethBalance = (+ethBalance).toFixed(4);

    setBalance(ethBalance);
  }

  const connectWallet = async () => {
    const { ethereum } = window;
    const [ account ] = await ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(account)

    await getEtherBalance(account)

    ethereum.on("accountsChanged", async (accounts) => {
      const newAccount = accounts[0];
      setAccount(newAccount);

      await getEtherBalance(newAccount)
    })
  }

  return (
    <header className="flex flex-row justify-between h-14 items-center">
      <HamburgerButton />
      <div className="flex flex-row items-center">
        <Navbar account={account} />
        {
          account
            ? <AccountBalanceLabel account={account} balance={balance} />
            : <button
                id="connectWallet"
                className="bg-fluor-green text-black font-bold rounded-2xl p-2"
                onClick={connectWallet}
              >
                Connect wallet
              </button>
        }
      </div>
    </header>
  )
}

export default Header;
