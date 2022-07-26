import {useEffect, useState} from "react";
import { ethers } from "ethers";
import logo from "../eth-logo.png";
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

        setLotteries(lotteries)
      }
    }
    getNumber()
  }, [lotteryContract])

  return (
    <div className="my-6">
      <h2 className="text-white text-center text-3xl">Available lotteries</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 my-6 text-white">
        {
          lotteries.map(
            lottery =>
              <div key={lottery.id.toNumber()}>
                <Lottery {...lottery} />
              </div>
            )
        }
      </div>
    </div>
  )
}

const Lottery = ({
  id,
  ticket,
  jackpot,
  participants,
  endTime,
  state
}) => {
  const formatToEther = number => ethers.utils.formatEther(number)

  const getDate = finalizationTime =>
    (new Date(finalizationTime.toNumber() * 1000)).toTimeString()

  return (
    <div
      className="h-80 my-4 border-2 border-light-green shadow-lg shadow-light-green rounded-2xl bg-back-black my-6 p-4 flex flex-col justify-between"
    >
      <div>
        <div className="flex flex-col text-center text-3xl text-light-green">
          <h3>Prize</h3>
          <div className="flex justify-center  mb-4 items-center">
            <img src={logo} alt="" className="h-auto h-12" />
            <span className="text-white text-6xl pl-4 digital-font">{ formatToEther(jackpot) }</span>
          </div>
        </div>
        <ul>
          <li className="uppercase text-custom-gray">ends at: <span className="text-white">{ getDate(endTime) }</span></li>
          <li className="uppercase text-custom-gray">participants: <span className="text-white">{ participants.length }</span></li>
          <li className="uppercase text-custom-gray">
            Ticket price:
            <span className="text-white">{ formatToEther(ticket) } ETH</span></li>
        </ul>

        {/*<div>{ id.toNumber()}</div>*/}
        {/*<div>{ jackpot.toNumber()}</div>*/}
        {/*<div>{ ethers.utils.formatEther(ticket)}</div>*/}
        {/*<div>*/}
        {/*  {*/}
        {/*    participants.map(p => <div>{ p }</div>)*/}
        {/*  }*/}
        {/*</div>*/}
        {/*<div>{ getDate(endTime) }</div>*/}
        {/*<div>{ state }</div>*/}
      </div>
    </div>
  )
}

export default LotteryList


