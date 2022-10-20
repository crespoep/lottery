import {getContract} from "./ethereumConnectionManager";
import {ethers} from "ethers";

const getOpenLotteries = async () => {
  const {contract} = await getContract();

  const lotteriesIds = await contract.getOpenLotteriesIds();

  return await Promise.all(
    lotteriesIds.map(async (id) => await contract.getLottery(id))
  );
};

const participate = async (id, ticket) => {
  const {contract, signer} = await getContract();

  return await contract.connect(signer).participate(parseInt(id), {
    value: ticket.toString(),
  });
};

const withdraw = async () => {
  const {contract, signer} = await getContract();
  return await contract.connect(signer).withdraw();
};

const getParticipationsByUser = async () => {
  const {contract, signerAddress} = await getContract();
  const participationIds = await contract.getParticipationsByUser(
    ethers.utils.getAddress(signerAddress)
  );

  return await Promise.all(
    participationIds.map(async (id) => await contract.getLottery(id))
  );
};

const getParticipantsByLottery = async (lotteryId) => {
  const {contract} = await getContract();
  return await contract.getParticipantsByLotteryId(lotteryId);
};

const getBalance = async () => {
  const {contract, signer} = await getContract();
  return await contract.connect(signer).getBalance();
};

export {
  getOpenLotteries,
  getParticipationsByUser,
  getParticipantsByLottery,
  getBalance,
  withdraw,
  participate,
};
