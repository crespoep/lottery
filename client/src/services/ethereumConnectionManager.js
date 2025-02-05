import {BigNumber, ethers} from "ethers";
import data from "../contracts.json";

const connect = async () => {
  const connection = await getConnection();
  const provider = getProvider(connection);
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();
  const network = await provider.getNetwork();
  const chainId = network.chainId;

  return {signer, signerAddress, chainId};
};

const getProvider = (connection) => {
  return new ethers.providers.Web3Provider(connection);
};

const getActiveAddress = async () => {
  const connection = await getConnection();
  const signerAddress = connection.selectedAddress;
  return {signerAddress};
};

const getConnection = async () => {
  const {ethereum} = window;
  ethereum.on("accountsChanged", (accounts) => {
    window.location.reload();
  });
  ethereum.on("chainChanged", (chainId) => {
    window.location.reload();
  });

  return ethereum;
};

const getBalance = async (account) => {
  const connection = await getConnection();

  const hexEthBalance = await connection.request({
    method: "eth_getBalance",
    params: [account, "latest"],
  });

  const ethBalance = ethers.utils.formatEther(BigNumber.from(hexEthBalance));
  return (+ethBalance).toFixed(4);
};

const getContract = async () => {
  return await initContract(
    data.contracts.LotteryGame.address,
    data.contracts.LotteryGame.abi
  );
};

const initContract = async (contractAddress, abi) => {
  const {signer, signerAddress, chainId} = await connect();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  return {contract, chainId, signer, signerAddress};
};

export {getActiveAddress, getContract, getBalance, connect};
