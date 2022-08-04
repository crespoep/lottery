import {useEffect, useState} from "react";
import { ethers } from "ethers";
import logo from "../../../assets/img/eth-logo.png";
import contractAddress from "../../../contracts/contract-address.json";
import LotteryArtifact from "../../../contracts/LotteryGame.json";
import { lotteryStates } from "../../../contractEnumStates";
import Message from "./../../Message";
import {useOutletContext} from "react-router-dom";
import withLoading from "../../withLoading";

const LotteryListLoader = () => {
  const [ account ] = useOutletContext()
  const [ lotteryContract, setLotteryContract ] = useState(null)
  const [ lotteries, setLotteries ] = useState([])
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    setLoading(true);

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
      try {
        if (lotteryContract) {
          const lotteriesIds = await lotteryContract.getOpenLotteriesIds()

          const lotteries = await Promise.all(lotteriesIds.map(
            async (id) => await lotteryContract.getLottery(id)
          ))

          setLotteries(lotteries)
          setLoading(false)
        }
      } catch (e) {
        setLoading(false)
        console.log("Check your network: ", e)
      }
    }
    getNumber()
  }, [lotteryContract])

  const participate = async (id, ticket) => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner()
    await lotteryContract.connect(signer).participate(
      parseInt(id),
      {
        value: ticket.toString(),
      }
    )
  }

  const hasParticipated = participants => {
    if (account) {
      return participants.includes(ethers.utils.getAddress(account))
    }
  }

  const LotteryListWithLoading = withLoading(LotteryList);

  return (
    <div className="my-6">
      <h2 className="text-white text-center text-3xl">Available lotteries</h2>
      {
        <LotteryListWithLoading
          isLoading={loading}
          lotteries={lotteries}
          hasParticipated={hasParticipated}
          participate={participate}
        />
      }
    </div>
  )
}

const LotteryList = ({
  lotteries,
  hasParticipated,
  participate
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
                  hasParticipated={hasParticipated(lottery.participants)}
                  participate={participate}
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
  participants,
  endTime,
  state,
  participate,
  hasParticipated
}) => {
  const lotteryState = lotteryStates[state];

  const formatToEther = number => ethers.utils.formatEther(number);

  const getDate = finalizationTime =>
    (new Date(finalizationTime.toNumber() * 1000)).toTimeString()

  const participateWithId = () => {
    participate(id, ticket)
  }

  return (
    <div
      className="h-85 my-4 border-2 border-light-green shadow-lg shadow-light-green rounded-2xl bg-back-black my-6 p-4 flex flex-col justify-between"
    >
      <div>
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
        hasParticipated={hasParticipated}
        participateWithId={participateWithId}
        lotteryState={lotteryState}
      />
    </div>
  )
}

const ParticipateButton = ({
  hasParticipated,
  participateWithId,
  lotteryState
}) => {
  return (
    <>
      {
        lotteryState === "OPEN"
          ? hasParticipated
            ? <div className="text-2xl p-3 mx-auto">You already participated !</div>
            : <button
              type="button"
              className="border-2 border-light-green text-2xl p-3 mx-auto w-40 button-shadow block"
              onClick={participateWithId}
            >
              Participate
            </button>
          : <div className="text-2xl p-3 mx-auto">
              Lottery is closed to new participants. Winner is being determined.
            </div>
      }
    </>
  )
}

export default LotteryListLoader


