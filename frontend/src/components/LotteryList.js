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
        const lotteriesIds = await lotteryContract.getOpenLotteriesIds()

        const lotteries = await Promise.all(lotteriesIds.map(
          async (id) => await lotteryContract.getLottery(id)
        ))

        console.log(lotteries)
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
              <div key={lottery.id.toNumber()}>
                <Lottery lottery={lottery} />
              </div>
            )
        }
      </div>
    </div>
  )
}

const Lottery = ({ lottery }) => {
  const getDate = finalizationTime =>
    (new Date(finalizationTime.toNumber() * 1000)).toTimeString()

  return (
    <div>
      <div>{ lottery.id.toNumber()}</div>
      <div>{ lottery.jackpot.toNumber()}</div>
      <div>{ ethers.utils.formatEther(lottery.ticket)}</div>
      <div>
        {
          lottery.participants.map(p => <div>{ p }</div>)
        }
      </div>
      <div>{ getDate(lottery.endTime) }</div>
      <div>{ lottery.state }</div>
    </div>
  )
}

export default LotteryList


