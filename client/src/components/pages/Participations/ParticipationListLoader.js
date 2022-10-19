import {useEffect, useState} from "react";
import {ethers} from "ethers";
import logo from "../../../assets/img/polygon-green-logo.svg";
import { useOutletContext, useNavigate } from "react-router-dom"
import ParticipationFilterButton from "./ParticipationFilterButton";
import Message from "./../../Message";
import withLoading from "../../withLoading";
import { getParticipationsByUser } from "../../../services/contractApi";

const ParticipationListLoader = () => {
  const [ account ] = useOutletContext()
  const [ won, setWon ] = useState(true)
  const [ participations, setParticipations ] = useState([])
  const [ loading, setLoading ] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchParticipations = async () => {
      try {
        if (!account) {
          navigate("/");
        }
        const participations = await getParticipationsByUser()

        setParticipations(participations)
        setLoading(false);
      } catch (e) {
        setLoading(false)
        console.log("Check your network: ", e)
      }
    }
    fetchParticipations()
  }, [account])

  const filteredParticipations = participations.filter(
    participation => {
      if (won) {
        return participation.winner === ethers.utils.getAddress(account)
      } else {
        return participation.winner !== ethers.utils.getAddress(account)
      }
    }
  )

  const ParticipationListWithLoading = withLoading(ParticipationList);

  return (
    <div className="mt-20">
      <h2 className="text-white text-center text-3xl mb-6">My participations</h2>
      <ParticipationListWithLoading
        isLoading={loading}
        participations={participations}
        filteredParticipations={filteredParticipations}
        won={won}
        setWon={setWon}
      />
    </div>
  )
}

const ParticipationList = ({
  participations,
  filteredParticipations,
  won,
  setWon
}) => {
  return (
    <>
      {
        participations.length > 0
          ? <ParticipationFilterButton won={won} setWon={setWon} />
          : <Message message="You have no participations in any lottery game" color="hard-yellow" />
      }
      {
        participations.length > 0 && filteredParticipations.length === 0 &&
        <Message message={
          won
            ? "You have not won any lotteries"
            : "You have not lost any lotteries"
        } color="hard-yellow" />
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 my-6 text-white">
        {
          filteredParticipations.map(lottery => <Participation key={lottery.id.toNumber()} {...lottery} />)
        }
      </div>
    </>
  )
}

const Participation = ({
   jackpot,
   id,
   ticket,
   winner
}) => {
  const formatToEther = number => ethers.utils.formatEther(number)

  const isThereAWinner = () => winner !== ethers.constants.AddressZero

  return (
    <div
      className="h-60 my-4 border-2 border-light-green shadow-lg shadow-light-green rounded-2xl bg-back-black my-6 p-4 flex flex-col justify-between"
    >
      <div className="flex flex-col justify-between h-60">
        <div>
          <div className="flex flex-col text-center text-3xl text-light-green">
            <h3>Prize</h3>
            <div className="flex justify-center  mb-4 items-center">
              <img src={logo} alt="" className="h-auto h-12" />
              <span className="text-white text-6xl pl-4 digital-font">{ formatToEther(jackpot) }</span>
            </div>
          </div>
          <ul>
            <li className="uppercase text-custom-gray">ID: { id.toNumber() }</li>
            <li className="uppercase text-custom-gray">
              Ticket:
              <span className="text-white">{ formatToEther(ticket) } ETH</span>
            </li>
          </ul>
        </div>
        {
          isThereAWinner()
            ? <div>
                <h3 className="text-3xl text-center">Winner</h3>
                <span className="truncate block">{ winner }</span>
              </div>
            : <div className="text-2xl text-center">There's no winner yet</div>
        }
      </div>
    </div>
  )
}

export default ParticipationListLoader;
