import axios from "axios";
import unisat from "../assets/wallet-logo/unisat_logo.png";
import meta from "../assets/wallet-logo/meta.png";
import xverse from "../assets/wallet-logo/xverse_logo_whitebg.png";
import magiceden from "../assets/brands/magiceden.svg"
import Bitcoin from "../assets/coin_logo/Bitcoin.png";
import eth from "../assets/coin_logo/eth_logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import Web3 from "web3";
import { ethers } from "ethers";

export const API_METHODS = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
};

export const apiUrl = {
  Coin_base_url: process.env.REACT_APP_COINBASE_API,
  Asset_server_base_url: process.env.REACT_APP_ASSET_SERVER,
  Unisat_open_api: process.env.REACT_APP_UNISAT_OPEN_API,
  Ordiscan_api: process.env.REACT_APP_ORDISCAN_API
};

export const XVERSE_WALLET_KEY = "xverse";
export const UNISAT_WALLET_KEY = "unisat";
export const MAGICEDEN_WALLET_KEY = "magiceden";
export const META_WALLET_KEY = "meta";
export const BtcChainId = (process.env.REACT_APP_BTC_CHAIN_ID); // PowerBtc Testnet Chain ID
export const BtcChainNumber = 21000001; // PowerBtc Testnet Chain ID
export const EthchainId = (process.env.REACT_APP_ETH_CHAIN_ID); // PowerEth Testnet Chain ID
export const EthchainNumber = 10023; // PowerEth Testnet Chain ID
export const IS_USER = true;
export const IS_DEV = true;

export const ordinals = process.env.REACT_APP_ORDINAL_CANISTER_ID;
export const rootstock = process.env.REACT_APP_ROOTSTOCK_CANISTER_ID;
export const storage = process.env.REACT_APP_STORAGE_CANISTER_ID;
export const ordiscan_bearer = process.env.REACT_APP_ORDISCAN_BEARER;
export const foundaryId = Number(process.env.REACT_APP_FOUNDARY_ID);
const BTC_ZERO = process.env.REACT_APP_BTC_ZERO;

export const BTCWallets = [
  {
    label: "MAGICEDEN",
    image: magiceden,
    key: MAGICEDEN_WALLET_KEY,
  },
  {
    label: "XVERSE",
    image: xverse,
    key: XVERSE_WALLET_KEY,
  },
  {
    label: "UNISAT",
    image: unisat,
    key: UNISAT_WALLET_KEY,
  }
];

export const paymentWallets = [
  {
    label: "META",
    image: meta,
    key: META_WALLET_KEY,
  }
]

export const agentCreator = (apiFactory, canisterId) => {
  const agent = new HttpAgent({
    host: process.env.REACT_APP_HTTP_AGENT_ACTOR_HOST,
  });
  const API = Actor.createActor(apiFactory, {
    agent,
    canisterId,
  });
  return API;
};

export const sliceAddress = (address, slicePoint = 5) => (
  <>
    {address?.slice(0, slicePoint)}
    ...
    {address?.slice(address.length - slicePoint, address.length)}
  </>
);

export const calculateFee = (bytes, preference) => {
  return Math.round(
    (Number(
      bytes?.split(" ")[0]
    ) /
      4) *
    preference *
    3.47
  )
}

export const logoRenderer = (activeChain) => (
  <>
    {activeChain === "BTC" ? <img src={Bitcoin} alt="noimage" width={20} height={22} />
      : <img src={eth} alt="noimage" width={18} />}
  </>
)

function fractionToFixed(numerator, denominator, minDecimalPlaces = 2, maxDecimalPlaces = 20) {
  // Convert fraction to decimal
  const decimalValue = numerator / denominator;

  // If the decimalValue is 0, return 0 with minDecimalPlaces
  if (decimalValue === 0) {
    return decimalValue.toFixed(minDecimalPlaces);
  }

  // Calculate the number of significant decimal places needed
  let significantDecimalPlaces = 0;
  for (let i = 2; i <= maxDecimalPlaces; i++) {
    const fixedValue = decimalValue.toFixed(i);
    if (parseFloat(fixedValue) !== 0) {
      significantDecimalPlaces = i;
      break;
    }
  }

  // Ensure at least minDecimalPlaces
  significantDecimalPlaces = Math.max(minDecimalPlaces, significantDecimalPlaces);

  // Use toFixed to format the decimal value to the determined number of decimal places
  const formattedValue = decimalValue.toFixed(significantDecimalPlaces);

  return formattedValue;
}

export const calculateOrdinalInCrypto = (ordinalFloor, BTCPriceInUSD, CryptoPriceInUSD, activeChain) => {
  // Calculate Floor to USD
  const floorInUSD = ordinalFloor / BTC_ZERO;

  // Calculate ordinal price in USD
  const ordinalInUSD = floorInUSD * BTCPriceInUSD;

  // Calculate ordinal price in BNB
  const ordinalIncrypto = fractionToFixed(ordinalInUSD, CryptoPriceInUSD);

  return {
    ordinalIncrypto: activeChain === "BTC" ? floorInUSD : ordinalIncrypto,
    ordinalInUSD: ordinalInUSD.toFixed(2),
  };
}

export const IndexContractAddress = process.env.REACT_APP_REGISTRATION;
export const TokenContractAddress = process.env.REACT_APP_NFT;
export const BorrowContractAddress = process.env.REACT_APP_LOAN_LEDGER;

export const contractGenerator = async (abi, contractAddress) => {
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(abi, contractAddress);
  return contract;
}

export const ethersContractCreator = async (abi, contractAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(abi, contractAddress, signer);
  return contract
}

export const calculateAPY = (interestRate, numberOfDays, toFixed = 2) => {
  const rateDecimal = interestRate / 100;
  const apy = Math.pow(1 + rateDecimal, 365 / numberOfDays) - 1;
  const apyPercentage = apy * 100;

  return apyPercentage.toFixed(toFixed);
}

export const calculateDailyInterestRate = (annualInterestRate, toFixed = 2) => {
  const rateDecimal = annualInterestRate / 100;
  const dailyInterestRate = rateDecimal / 365;
  const dailyInterestRatePercentage = dailyInterestRate * 100;

  return dailyInterestRatePercentage.toFixed(toFixed); // Return daily interest rate rounded to 5 decimal places
}

// Getting time ago statement
export const getTimeAgo = (timestamp) => {
  const now = new Date(); // Current date and time
  const diff = now.getTime() - timestamp; // Difference in milliseconds

  // Convert milliseconds to seconds
  const seconds = Math.floor(diff / 1000);

  // Calculate time difference in various units
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Determine appropriate phrase based on time difference
  if (seconds < 60) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
}

export const Capitalaize = (data) => {
  if (data) {
    const words = data.split(/\s+/);
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join(" ");
  }
};

export const DateTimeConverter = (timestamps) => {
  const date = new Date(timestamps);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let strTime = date.toLocaleString("en-IN", { timeZone: `${timezone}` });
  const timeStamp = strTime.split(",");

  return timeStamp;
};

// Function to format hours in 12-hour clock format
export const format12Hour = (hours) => {
  return hours % 12 || 12;
};

// Function to format single-digit minutes and seconds with leading zero
export const formatTwoDigits = (value) => {
  return value.toString().padStart(2, "0");
};

export const daysCalculator = (_timestamp = Date.now(), _daysAfter = 7) => {
  const timestamp = Number(_timestamp);

  const givenDate = new Date(timestamp);

  const resultDate = new Date(givenDate);
  resultDate.setDate(givenDate.getDate() + _daysAfter);

  const formattedResult = `${resultDate.getDate()}/${resultDate.getMonth() + 1
    }/${resultDate.getFullYear()} ${format12Hour(
      resultDate.getHours()
    )}:${formatTwoDigits(resultDate.getMinutes())}:${formatTwoDigits(
      resultDate.getSeconds()
    )} ${resultDate.getHours() >= 12 ? "pm" : "am"}`;

  return { date_time: formattedResult, timestamp: resultDate.getTime() };
};
