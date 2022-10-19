import {useEffect, useState} from "react";
import { ethers } from "ethers";
import logo from "../../../assets/img/eth-logo.png";
import { lotteryStates } from "../../../contractEnumStates";
import {useOutletContext} from "react-router-dom";
import { getOpenLotteries, participate, getParticipantsByLottery } from "../../../services/contractApi";
import Message from "./../../Message";
import withLoading from "../../withLoading";

const LotteryListLoader = () => {
  const [ lotteries, setLotteries ] = useState([])
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    const fetchOpenLotteries = async () => {
      try {
        const lotteries = await getOpenLotteries();

        setLotteries(lotteries)
        setLoading(false)
      } catch (e) {
        setLoading(false)
        console.log("Check your network: ", e)
      }
    }
    fetchOpenLotteries()
  }, [])

  const LotteryListWithLoading = withLoading(LotteryList);

  return (
    <div className="my-6">
      <h2 className="text-white text-center text-3xl">Available lotteries</h2>
      {
        <LotteryListWithLoading
          isLoading={loading}
          lotteries={lotteries}
        />
      }
    </div>
  )
}

const LotteryList = ({
  lotteries,
}) => {
  return (
    lotteries.length > 0
      ? <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 my-6 text-white">
        {
          lotteries.map(
            lottery =>
              <div key={lottery.id.toNumber()}>
                <Lottery
                  {...lottery}
                />
              </div>
          )
        }
      </div>
      : <Message message="There is no available lotteries at the moment, come back later!" color="red-600" />
  )
}

const Lottery = ({
  id,
  ticket,
  jackpot,
  endTime,
  state,
}) => {
  const [account] = useOutletContext()
  const lotteryState = lotteryStates[state];

  const [participants, setParticipants] = useState([])
  // const [hasParticipated, setHasParticipated] = useState(false)

  useEffect(() => {
    const getParticipants = async () => {

      const participants = await getParticipantsByLottery(id);
      setParticipants(participants);

      // const hasParticipated = userHasParticipated(participants)
      // setHasParticipated(hasParticipated)
    }
    getParticipants()
  }, [account])

  // const userHasParticipated = (participants) => {
  //   if (account) {
  //     return participants.includes(ethers.utils.getAddress(account))
  //   }
  //   return false;
  // }

  const formatToEther = number => ethers.utils.formatEther(number);

  const getDate = finalizationTime =>
    (new Date(finalizationTime.toNumber() * 1000)).toTimeString()

  const participateWithId = async () => {
    try {
      const receipt = await participate(id, ticket)
      // setHasParticipated(true)
      console.log(receipt)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div
      className="h-85 my-4 border-2 border-light-green shadow-lg shadow-light-green rounded-2xl bg-back-black my-6 p-4 flex flex-col justify-between"
    >
      <div className="mb-4">
        <div className="flex flex-col text-center text-3xl text-light-green">
          <h3>Prize</h3>
          <div className="flex justify-center  mb-4 items-center">
            <img src={logo} alt="" className="h-auto h-12" />
            <span className="text-white text-6xl pl-4 digital-font">{ formatToEther(jackpot) }</span>
          </div>
        </div>
        <div className="text-center text-custom-gray font-bold text-2xl italic">{ lotteryState }</div>
        <ul>
          <li className="uppercase text-custom-gray">ends at: <span className="text-white">{ getDate(endTime) }</span></li>
          <li className="uppercase text-custom-gray">participants: <span className="text-white">{ participants.length }</span></li>
          <li className="uppercase text-custom-gray">
            Ticket price:
            <span className="text-white">{ formatToEther(ticket) } ETH</span></li>
        </ul>
      </div>
      <ParticipateButton
        participateWithId={participateWithId}
        lotteryState={lotteryState}
        participants={participants}
        account={account}
      />
    </div>
  )
}

const ParticipateButton = ({
  participateWithId,
  lotteryState,
  participants,
  account
}) => {
  if (lotteryState !== "OPEN") {
    return (
      <div className="text-2xl p-3 mx-auto">
        Lottery is closed to new participants. Winner is being determined.
      </div>
    )
  } else if (!account) {
    return (
      <div className="border-2 border-sky-500 rounded-2xl text-2xl p-3 mx-auto">
        Connect!
      </div>
    )
  } else if (account && participants.includes(ethers.utils.getAddress(account))) {
    return (
      <div className="text-2xl p-3 mx-auto">You already participated !</div>
    )
  } else {
    return (
      <button
        type="button"
        className="border-2 border-light-green text-2xl p-3 mx-auto w-40 button-shadow block"
        onClick={participateWithId}
      >
        Participate
      </button>
    )
  }
}

export default LotteryListLoader
