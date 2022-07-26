import {lotteries} from "../lotteries";
import {useEffect, useState} from "react";
import { ethers } from "ethers";
import contractAddress from "../contracts/contract-address.json";
import LotteryArtifact from "../contracts/LotteryGame.json";

const LotteryList = () => {
  const [ lotteryContract, setLotteryContract ] = useState(null)
  const [ lotteries, setLotteries ] = useState([])

  useEffect(() => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);

    const lotteryContract = new ethers.Contract(
      contractAddress.Lottery,
      LotteryArtifact.abi,
      provider.getSigner(0)
    )

    setLotteryContract(lotteryContract)
  }, [])

  useEffect(() => {
    const getNumber = async () => {
      if (lotteryContract) {
        const lotteries = await lotteryContract.getOpenLotteriesIds()
        setLotteries(lotteries)
      }
    }
    getNumber()
  }, [lotteryContract])

  return (
    <div>
      <h2>Available lotteries</h2>
      <div>
        {
          lotteries.map(
            lottery =>
              <div key={lottery.id}>
                { lottery.id }
              </div>
            )
        }
      </div>
    </div>
  )
}

export default LotteryList


