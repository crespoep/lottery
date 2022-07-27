import {useEffect, useState} from "react";
import {ethers} from "ethers";
import { useOutletContext } from "react-router-dom"
import contractAddress from "../contracts/contract-address.json";
import LotteryArtifact from "../contracts/LotteryGame.json";

const Participations = () => {
  const [ account ] = useOutletContext()
  const [ contract, setContract ] = useState(null)
  const [ participations, setParticipations ] = useState([])

  useEffect(() => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);

    const lotteryContract = new ethers.Contract(
      contractAddress.Lottery,
      LotteryArtifact.abi,
      provider.getSigner(0)
    );

    setContract(lotteryContract)
  }, [])

  useEffect(() => {
    const fetchParticipations = async () => {
      if (contract && account) {
        const participationIds = await contract.getParticipationsByUser(ethers.utils.getAddress(account))

        const participations = await Promise.all(
          participationIds.map(async (id) => await contract.getLottery(id))
        )
        console.log(participations)
        setParticipations(participations)
      }

    }
    fetchParticipations()
  }, [contract, account])

  return (
    <div>
      Participations
      <div>
        {
          participations.map(p => <div key={p.id.toNumber()}>{ p.id.toNumber() }</div>)
        }
      </div>
    </div>
  )
}

export default Participations;
