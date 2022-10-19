import ParticipationListLoader from "../Participations/ParticipationListLoader";
import {getBalance, withdraw} from "../../../services/contractApi";
import {useOutletContext, useNavigate} from "react-router-dom";
import logo from "../../../assets/img/polygon-logo.svg";
import {useState, useEffect} from "react";
import {ethers} from "ethers";

const MyAccount = () => {
  const [ account ] = useOutletContext();
  const [ balance, setBalance ] = useState(0)

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (!account) {
          navigate("/");
        }
        const balance = await getBalance()
        setBalance(balance);
      } catch (e) {
        console.log("Check your network: ", e)
      }
    }
    fetchBalance()
  }, [account])

  const withdrawFunds = async () => {
    try {
      const receipt = await withdraw()
      console.log(receipt)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <h2 className="text-white text-center text-3xl my-6">My account</h2>
      <div className="border-4 bg-back-black border-sky-500 rounded-2xl">
        <div className="my-6">
          <h2 className="text-white text-center text-3xl">My funds</h2>
          <div className="flex flex-col-reverse sm:flex-row justify-center sm:justify-end items-center my-6  sm:mr-6">
            <button className="border-4 bg-sky-500 border-sky-500 text-black rounded-2xl text-2xl p-3 sm:mr-10" onClick={withdrawFunds}
            >
              Withdraw
            </button>
            <div className="flex flex-row items-center">
              <img className="h-auto h-12 mr-2" alt="" src={logo}></img>
              <span className="text-white text-6xl digital-font">{ethers.utils.formatEther(balance)}</span>
            </div>
          </div>
        </div>
      </div>
      <ParticipationListLoader />
    </div>
  )
}

export default MyAccount;
