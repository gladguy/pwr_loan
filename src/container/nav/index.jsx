import { useWallets } from "@wallet-standard/react";
import {
  Col,
  ConfigProvider,
  Divider,
  Drawer,
  Flex,
  Grid,
  Menu,
  Modal,
  Row,
  Tabs,
  Tooltip,
  Tour,
  Typography,
} from "antd";
import { ethers } from "ethers";
import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineDisconnect } from "react-icons/ai";
import { IoIosSwitch } from "react-icons/io";
import { PiCopyBold } from "react-icons/pi";
import { RiWallet3Fill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { AddressPurpose, BitcoinNetworkType, getAddress } from "sats-connect";
import Web3 from "web3";
import ordinals_O_logo from "../../assets/brands/ordinals_O_logo.png";
import Bitcoin from "../../assets/coin_logo/Bitcoin.png";
import Eth from "../../assets/coin_logo/eth_logo.png";
import pwr_logo from "../../assets/coin_logo/pwr-logo.png";
import myordinalslogo from "../../assets/logo/ordinalslogo.png";
import CustomButton from "../../component/Button";
import CardDisplay from "../../component/card";
import ModalDisplay from "../../component/modal";
import Notify from "../../component/notification";
import {
  clearStates,
  setLendHeader,
  setLoading,
} from "../../redux/slice/constant";
import {
  clearWalletState,
  setActiveChain,
  setMagicEdenCredentials,
  setMetaCredentials,
  setUnisatCredentials,
  setXverseCredentials,
} from "../../redux/slice/wallet";
import { storageIdlFactory } from "../../storage_canister";
import {
  agentCreator,
  API_METHODS,
  apiUrl,
  BtcChainId,
  BtcChainNumber,
  BTCWallets,
  EthchainId,
  EthchainNumber,
  IndexContractAddress,
  MAGICEDEN_WALLET_KEY,
  META_WALLET_KEY,
  paymentWallets,
  sliceAddress,
  storage,
  UNISAT_WALLET_KEY,
  XVERSE_WALLET_KEY,
} from "../../utils/common";
import indexJson from "../../utils/index_abi.json";
import { propsContainer } from "../props-container";

const Nav = (props) => {
  const { Text } = Typography;
  const { useBreakpoint } = Grid;
  const breakPoint = useBreakpoint();
  const { wallets } = useWallets();

  const { location, navigate } = props.router;
  const { dispatch, reduxState } = props.redux;

  const walletState = reduxState.wallet;
  const activeWallet = reduxState.wallet.active;
  const metaAddress = walletState.meta.address;
  const xverseAddress = walletState.xverse.ordinals.address;
  const unisatAddress = walletState.unisat.address;
  const magicEdenAddress = walletState.magicEden.ordinals.address;
  const activeChain = reduxState.wallet.activeChain;
  const [isConnectModal, setConnectModal] = useState(false);
  const [tabKey, setTabKey] = useState("1");
  const [open, setOpen] = useState(false);
  const [screenDimensions, setScreenDimensions] = React.useState({
    width: window.screen.width,
    height: window.screen.height,
  });
  const [current, setCurrent] = useState();
  const [activeConnections, setActiveConnections] = useState([]);
  const [walletConnection, setWalletConnection] = useState({});
  const [activeAddresses, setActiveAddresses] = useState({});

  const avatar = process.env.REACT_APP_AVATAR;
  const SatsConnectNamespace = "sats-connect:";

  const { confirm } = Modal;
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);

  const [openTour, setOpenTour] = useState(
    localStorage.getItem("isTourEnabled") ?? true
  );

  const tourSteps = [
    {
      title: (
        <Text strong style={{ color: "violet", fontSize: "20px" }}>
          Browse
        </Text>
      ),
      description:
        "In this you can veiw the approved collections and partners we have in group with us and we have a suprise page to view borrow and lend page.",
      target: () => ref1.current,
    },
    {
      title: (
        <Text strong style={{ color: "violet", fontSize: "20px" }}>
          Dashboard
        </Text>
      ),
      description:
        "In Dashboard page, we have the wallet supplies details, your asset supplies details, asset to supply details and we also have your lendings, asset to lend details.",
      target: () => ref2.current,
    },
    {
      title: (
        <Text strong style={{ color: "violet", fontSize: "20px" }}>
          Portfolio
        </Text>
      ),
      description:
        "In Portfolio page, we have the all the three wallet addresses plug wallet, unisat wallet and xverse wallet and we know what are the loan requests avaliable and we have details of our assets.",
      target: () => ref3.current,
    },
    {
      title: (
        <Text strong style={{ color: "violet", fontSize: "20px" }}>
          Connect Button
        </Text>
      ),
      description:
        "This button is used to connect the wallet. when you click the button modal opens with two tabs, in BTC tab we connect plug wallet and in ICP tab we connect unisat or xverse wallet",
      target: () => ref4.current,
    },
  ];

  const tourConfirm = () => {
    confirm({
      className: "backModel",
      title: (
        <Text style={{ color: "white", fontSize: "20px", marginTop: -30 }}>
          Tour Alert
        </Text>
      ),
      okText: "Yes",
      cancelText: "No",
      type: "error",
      okButtonProps: { htmlType: "submit" },
      content: (
        <>
          <Row>
            <Col>
              <Typography
                style={{ marginBottom: 5, color: "white", fontSize: "18px" }}
              >
                Are you sure want to cancel tour?
              </Typography>
            </Col>
          </Row>
        </>
      ),
      onOk() {
        localStorage.setItem("isTourEnabled", false);
        setOpenTour(localStorage.getItem("isTourEnabled"));
      },
    });
  };

  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label,
    };
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setCurrent("tmp-0");
    } else if (location.pathname === "/borrow") {
      setCurrent("tmp-1");
    } else if (location.pathname === "/lend") {
      setCurrent("tmp-2");
    }
    if (location.pathname === "/portfolio") {
      setCurrent("tmp-3");
    }
  }, [current, location.pathname]);

  const errorMessageNotify = (message) => {
    Notify("error", message);
  };

  const successMessageNotify = (message) => {
    Notify("success", message);
  };

  const collapseConnectedModal = () => {
    setConnectModal(!isConnectModal);
    setOpen(false);
  };

  function isSatsConnectCompatibleWallet(wallet) {
    return SatsConnectNamespace in wallet.features;
  }

  const connectNetwork = async (activeChain, isInit) => {
    const web3 = new Web3(window.ethereum);
    const chainId = activeChain === "BTC" ? BtcChainId : EthchainId;
    const chainNumber = activeChain === "BTC" ? BtcChainNumber : EthchainNumber;
    let accounts;
    try {
      if (isInit) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        accounts = await web3.eth.getAccounts();
      }
      let networkId = await web3.eth.net.getId();

      if (Number(networkId) !== chainNumber) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            // This error code indicates that the chain has not been added to MetaMask.
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId,
                    chainName: activeChain === "BTC" ? "PWR BTC" : "PWR ETH",
                    rpcUrls: [
                      activeChain === "BTC"
                        ? "https://bitcoinplus.pwrlabs.io/"
                        : "https://ethereumplus.pwrlabs.io/",
                    ],
                    blockExplorerUrls: [
                      activeChain === "BTC"
                        ? "https://btcplusexplorer.pwrlabs.io/"
                        : "https://ethplusexplorer.pwrlabs.io/",
                    ],
                    nativeCurrency: {
                      name: activeChain === "BTC" ? "BTC" : "ETH",
                      symbol: activeChain === "BTC" ? "PBTC" : "PETH", // Replace with the symbol of the native token
                      decimals: activeChain === "BTC" ? 8 : 18,
                    },
                  },
                ],
              });
            } catch (addError) {
              console.error("Failed to add the network:", addError);
            }
          } else {
            console.error("Failed to switch the network:", switchError);
          }
        }
      }

      if (isInit) {
        setWalletConnection({
          ...walletConnection,
          [META_WALLET_KEY]: {
            address: accounts[0],
            publicKey: null,
          },
        });
        setActiveConnections([...activeConnections, META_WALLET_KEY]);
        setActiveAddresses({
          ...activeAddresses,
          [META_WALLET_KEY]: accounts[0],
        });
        dispatch(setActiveChain(activeChain));
      } else {
        await verifyAddress();
      }
    } catch (error) {
      console.error("User denied account access", error);
    }
  };

  const clearConnectionStates = () => {
    setWalletConnection({});
    setActiveConnections([]);
    setActiveAddresses({});
  };

  const connectWallet = async (walletName) => {
    if (walletName === XVERSE_WALLET_KEY) {
      const getAddressOptions = {
        payload: {
          purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
          message: "Address for receiving Ordinals and payments",
          network: {
            type: BitcoinNetworkType.Mainnet,
          },
        },
        onFinish: async (response) => {
          if (response.addresses) {
            const { addresses } = response;
            const ordinals = addresses.find(
              (ele) => ele.purpose === AddressPurpose.Ordinals
            );
            const payment = addresses.find(
              (ele) => ele.purpose === AddressPurpose.Payment
            );
            // dispatch(setXversePayment(payment));
            // dispatch(setXverseOrdinals(ordinals));

            const result = await API_METHODS.get(
              `${apiUrl.Unisat_open_api}/v1/indexer/address/${payment.address}/balance`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.REACT_APP_UNISAT_BEARER}`,
                },
              }
            );

            const xverseBtc =
              result.data.data.satoshi / process.env.REACT_APP_BTC_ZERO;
            setWalletConnection({
              ...walletConnection,
              [XVERSE_WALLET_KEY]: {
                ordinals: ordinals,
                payment: payment,
                btcBalance: xverseBtc,
              },
            });
            setActiveConnections([...activeConnections, XVERSE_WALLET_KEY]);
            setActiveAddresses({
              ...activeAddresses,
              [XVERSE_WALLET_KEY]: ordinals.address,
            });
            successMessageNotify("x-verse Wallet connected!");
          }
        },
        onCancel: () => errorMessageNotify("User rejected the request."),
      };
      try {
        await getAddress(getAddressOptions);
      } catch (error) {
        errorMessageNotify(error.message);
      }
    } else if (walletName === UNISAT_WALLET_KEY) {
      // UNISAT
      if (typeof window.unisat !== "undefined") {
        try {
          dispatch(setLoading(true));
          var accounts = await window.unisat.requestAccounts();
          let publicKey = await window.unisat.getPublicKey();
          let { confirmed: BtcBalance } = await window.unisat.getBalance();
          dispatch(setLoading(false));
          setWalletConnection({
            ...walletConnection,
            [UNISAT_WALLET_KEY]: {
              address: accounts[0],
              publicKey,
              btcBalance: BtcBalance / process.env.REACT_APP_BTC_ZERO,
            },
          });
          setActiveConnections([...activeConnections, UNISAT_WALLET_KEY]);
          setActiveAddresses({
            ...activeAddresses,
            [UNISAT_WALLET_KEY]: accounts[0],
          });
          successMessageNotify("Unisat Wallet connected!");
        } catch (error) {
          dispatch(setLoading(false));
          errorMessageNotify(error.message);
        }
      } else {
        errorMessageNotify("No unisat wallet installed!");
      }
    } else if (walletName === MAGICEDEN_WALLET_KEY) {
      try {
        const provider = wallets.find(isSatsConnectCompatibleWallet);
        await getAddress({
          getProvider: async () =>
            provider.features[SatsConnectNamespace]?.provider,
          payload: {
            purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
            message: "Address for receiving Ordinals and payments",
            network: {
              type: BitcoinNetworkType.Mainnet,
            },
          },
          onFinish: async (response) => {
            const { addresses } = response;
            const ordinals = addresses.find(
              (ele) => ele.purpose === AddressPurpose.Ordinals
            );
            const payment = addresses.find(
              (ele) => ele.purpose === AddressPurpose.Payment
            );

            const result = await API_METHODS.get(
              `${apiUrl.Unisat_open_api}/v1/indexer/address/${payment.address}/balance`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.REACT_APP_UNISAT_BEARER}`,
                },
              }
            );

            const magicEdenBtc =
              result.data.data.satoshi / process.env.REACT_APP_BTC_ZERO;
            setWalletConnection({
              ...walletConnection,
              [MAGICEDEN_WALLET_KEY]: {
                ordinals,
                payment,
                btcBalance: magicEdenBtc,
              },
            });
            setActiveConnections([...activeConnections, MAGICEDEN_WALLET_KEY]);
            setActiveAddresses({
              ...activeAddresses,
              [MAGICEDEN_WALLET_KEY]: ordinals.address,
            });
            successMessageNotify("Magiceden Wallet connected!");
          },
          onCancel: () => {
            // alert("Request canceled");
          },
        });
      } catch (err) {
        console.log("magiceden error", err);
      }
    } else {
      // Meta wallet
      if (window.ethereum) {
        await connectNetwork(activeChain, true);
      } else if (window.web3) {
        // Legacy dapp browsers...
        // const web3 = new Web3(window.web3.currentProvider);
      } else {
        Notify(
          "warning",
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    }
  };

  const storeWallets = (wallet) => {
    if (META_WALLET_KEY === wallet) {
      dispatch(setMetaCredentials(walletConnection[META_WALLET_KEY]));
    } else if (XVERSE_WALLET_KEY === wallet) {
      dispatch(setXverseCredentials(walletConnection[XVERSE_WALLET_KEY]));
    } else if (UNISAT_WALLET_KEY === wallet) {
      dispatch(setUnisatCredentials(walletConnection[UNISAT_WALLET_KEY]));
    } else {
      dispatch(setMagicEdenCredentials(walletConnection[MAGICEDEN_WALLET_KEY]));
    }
  };

  const verifyAddress = async () => {
    const chainNumber = activeChain === "BTC" ? EthchainNumber : BtcChainNumber;
    const chain = activeChain === "BTC" ? "ETH" : "BTC";
    const web3 = new Web3(window.ethereum);
    let networkId = await web3.eth.net.getId();

    if (Number(networkId) === chainNumber) {
      try {
        dispatch(setLoading(true));
        const API = agentCreator(storageIdlFactory, storage);
        const btcAddress = xverseAddress
          ? xverseAddress
          : unisatAddress
          ? unisatAddress
          : magicEdenAddress;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          IndexContractAddress,
          indexJson,
          signer
        );
        const isAcExist = await contract.getBitcoinAddressId(metaAddress);
        const isAccountExistInABI = Number(isAcExist.toString());

        let verifyAddress = await API.verifyAddressPair({
          chain_id: chainNumber,
          bitcoinAddress: btcAddress,
          ethereumAddress: metaAddress,
        });
        verifyAddress = Number(verifyAddress);

        if (verifyAddress === 0 && isAccountExistInABI) {
          dispatch(setActiveChain(chain));
          dispatch(setLoading(false));
          Notify("success", `Switched to ${chain} network!`, 3000);
          onClose();
        } else if (verifyAddress === 3) {
          const storeAddress = await API.storeAddress({
            chain_id: chainNumber,
            bitcoinAddress: btcAddress,
            ethereumAddress: metaAddress,
          });

          if (!isAccountExistInABI) {
            const saveResult = await contract.saveBitcoinAddress(
              Number(storeAddress),
              metaAddress
            );
            if (saveResult.hash) {
              Notify("success", "Account creation success!", 3000);
              dispatch(setActiveChain(chain));
              onClose();
            }
          }
        }

        dispatch(setLoading(false));
      } catch (error) {
        dispatch(clearStates());
        dispatch(setActiveChain("BTC"));
        successMessageNotify("Connection aborted, logging you out!");
        dispatch(clearWalletState());
        dispatch(setLoading(false));
        onClose();
        console.log("Switching connection error", error);
      }
    }
  };

  const handleConnectionFinish = async () => {
    const chainNumber = activeChain === "BTC" ? BtcChainNumber : EthchainNumber;
    collapseConnectedModal();
    try {
      dispatch(setLoading(true));
      let isConnectionExist = false;
      const API = agentCreator(storageIdlFactory, storage);
      const btcAddress = walletConnection?.xverse
        ? walletConnection.xverse.ordinals.address
        : walletConnection?.magiceden
        ? walletConnection.magiceden.ordinals.address
        : walletConnection?.unisat?.address;
      const metaAddress = walletConnection.meta.address;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        IndexContractAddress,
        indexJson,
        signer
      );
      const isAcExist = await contract.getBitcoinAddressId(metaAddress);
      const isAccountExistInABI = Number(isAcExist.toString());

      let verifyAddress = await API.verifyAddressPair({
        chain_id: chainNumber,
        bitcoinAddress: btcAddress,
        ethereumAddress: metaAddress,
      });
      verifyAddress = Number(verifyAddress);
      console.log("verifyAddress", verifyAddress);
      console.log(("isAccountExistInABI", isAccountExistInABI));

      if (verifyAddress === 0 && isAccountExistInABI) {
        isConnectionExist = true;
      } else if (verifyAddress === 1) {
        const btcAddress = await API.getByEthereumAddress({
          chainId: chainNumber,
          ethereumAddress: metaAddress,
        });
        Notify(
          "warning",
          `Account not found, try connecting ${btcAddress} BTC account!`
        );
        clearConnectionStates();
      } else if (verifyAddress === 2) {
        const ethAddress = await API.getByBitcoinAddress({
          chainId: chainNumber,
          bitcoinAddress: btcAddress,
        });
        Notify(
          "warning",
          `Account not found, try connecting ${ethAddress} ETH account!`
        );
        clearConnectionStates();
      } else if (
        verifyAddress === 3 ||
        (verifyAddress === 0 && !isAccountExistInABI)
      ) {
        const storeAddress = await API.storeAddress({
          chain_id: chainNumber,
          bitcoinAddress: btcAddress,
          ethereumAddress: metaAddress,
        });

        if (!isAccountExistInABI) {
          const saveResult = await contract.saveBitcoinAddress(
            Number(storeAddress),
            metaAddress
          );
          if (saveResult.hash) {
            Notify("success", "Account creation success!", 3000);
          }
        }
        isConnectionExist = true;
      }

      if (isConnectionExist) {
        activeConnections.forEach((wallet) => {
          storeWallets(wallet);
        });
        Notify("success", "Wallet connection success!");
        collapseConnectedModal();
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      clearConnectionStates();
      console.log("finish connection error", error);
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const isDisabled = (key) => {
    const connected = activeConnections.includes(key);
    if (connected) return "card-disabled";
    const cond = (bool) => (bool ? "card-disabled" : "");
    switch (key) {
      case XVERSE_WALLET_KEY: {
        return cond(
          activeConnections.includes(UNISAT_WALLET_KEY) ||
            activeConnections.includes(MAGICEDEN_WALLET_KEY)
        );
      }
      case UNISAT_WALLET_KEY: {
        return cond(
          activeConnections.includes(XVERSE_WALLET_KEY) ||
            activeConnections.includes(MAGICEDEN_WALLET_KEY)
        );
      }
      case MAGICEDEN_WALLET_KEY: {
        return cond(
          activeConnections.includes(XVERSE_WALLET_KEY) ||
            activeConnections.includes(UNISAT_WALLET_KEY)
        );
      }
      default:
        return "";
    }
  };

  const walletCards = (wallet, index) => (
    <CardDisplay
      key={`${wallet.label}-${index + 1 * 123}`}
      className={`modalCardBg card-hover width pointer grey-bg m-top-bottom ${isDisabled(
        wallet.key
      )}`}
      hoverable={true}
      onClick={() => {
        connectWallet(wallet.key);
      }}
    >
      <Row align={"middle"}>
        <img
          src={wallet.image}
          alt={`${wallet.key}_logo`}
          style={{
            marginRight: wallet.key === "xverse" ? "20px" : "10px",
          }}
          width={wallet.key === "xverse" ? "7%" : "10%"}
        />{" "}
        <h2
          style={{ margin: "0" }}
          className="white-color font-courier font-large letter-spacing-medium"
          level={2}
        >
          {wallet.label}
        </h2>
      </Row>
    </CardDisplay>
  );

  const getScreenDimensions = (e) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setScreenDimensions({ width, height });
  };

  useEffect(() => {
    window.addEventListener("resize", getScreenDimensions);
    return () => {
      window.removeEventListener("resize", getScreenDimensions);
    };
  }, []);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const options = [
    getItem(
      <Row
        className="font-style"
        onClick={() => {
          navigate("/");
          setOpen(false);
        }}
      >
        Browse
      </Row>
    ),
    getItem(
      <Row
        className="font-style"
        onClick={() => {
          navigate("/lending");
          setOpen(false);
        }}
      >
        Lending
      </Row>
    ),
    getItem(
      <Row
        className="font-style"
        onClick={() => {
          navigate("/borrowing");
          setOpen(false);
        }}
      >
        Borrowing
      </Row>
    ),
    getItem(
      <Row
        className="font-style "
        onClick={() => {
          navigate("/bridge");
          setOpen(false);
        }}
      >
        Bridge Ordinals
      </Row>
    ),
    getItem(
      <Row
        className="font-style"
        onClick={() => {
          navigate("/portfolio");
          setOpen(false);
        }}
      >
        Portfolio
      </Row>
    ),
  ];

  const addressRendererWithCopy = (address) => {
    return (
      <Tooltip arrow title={"Copied"} trigger={"click"} placement="top">
        <PiCopyBold
          className="pointer"
          onClick={() => {
            navigator.clipboard.writeText(address);
          }}
          size={15}
        />
      </Tooltip>
    );
  };

  const avatarRenderer = (width) => (
    <img
      src={`${avatar}/svg?seed=${
        xverseAddress
          ? xverseAddress
          : unisatAddress
          ? unisatAddress
          : magicEdenAddress
          ? magicEdenAddress
          : metaAddress
      }`}
      width={width}
      className="avatar"
      alt="avatar"
    />
  );
  gsap.to(".round", {
    rotation: 360,
    duration: 4,
    repeat: -1,
    repeatDelay: 10,
    ease: "none",
  });

  return (
    <>
      <Row
        justify={{
          xs: "space-between",
          lg: "space-between",
          xl: "space-between",
        }}
        className="mt-2"
        align={"middle"}
      >
        <Col>
          <Row align={"middle"}>
            <Col>
              <img
                src={myordinalslogo}
                alt="logo"
                className="pointer"
                width={65}
                onClick={() => {
                  navigate("/");
                  dispatch(setLendHeader(false));
                }}
              />
            </Col>
          </Row>
        </Col>

        <Col>
          {screenDimensions.width >= 1200 && (
            <>
              <Flex gap={50}>
                <Text
                  className={`${
                    location.pathname === "/"
                      ? "headertitle headerStyle"
                      : "font-style headerCompanyName"
                  } pointer heading-one `}
                  onClick={() => {
                    navigate("/");
                    dispatch(setLendHeader(false));
                  }}
                  ref={ref1}
                >
                  Browse
                </Text>
                <Text className="font-xsmall color-grey">|</Text>
                <Text
                  className={`${
                    location.pathname === "/lending"
                      ? "headertitle headerStyle"
                      : "font-style headerCompanyName"
                  } pointer heading-one `}
                  onClick={() => {
                    navigate("/lending");
                    dispatch(setLendHeader(false));
                  }}
                  ref={ref2}
                >
                  Lending
                </Text>
                <Text className="font-xsmall color-grey">|</Text>

                <Text
                  className={`${
                    location.pathname === "/borrowing"
                      ? "headertitle headerStyle"
                      : "font-style headerCompanyName"
                  } pointer heading-one `}
                  onClick={() => {
                    navigate("/borrowing");
                    dispatch(setLendHeader(false));
                  }}
                  ref={ref2}
                >
                  Borrowing
                </Text>

                <Text className="font-xsmall color-grey">|</Text>

                <Text
                  className={`${
                    location.pathname === "/bridge"
                      ? "headertitle headerStyle"
                      : "font-style headerCompanyName"
                  } pointer heading-one `}
                  onClick={() => {
                    navigate("/bridge");
                    dispatch(setLendHeader(false));
                  }}
                  ref={ref3}
                >
                  Bridge Ordinals
                </Text>
                <Text className="font-xsmall color-grey">|</Text>
                <Text
                  className={`${
                    location.pathname.includes("portfolio")
                      ? "headertitle headerStyle"
                      : "font-style headerCompanyName"
                  } pointer heading-one  `}
                  onClick={() => {
                    navigate("/portfolio");
                    dispatch(setLendHeader(false));
                  }}
                  ref={ref5}
                >
                  Portfolio
                </Text>

                <Text className="font-xsmall color-grey">|</Text>

                <Text
                  className={`${
                    location.pathname === "/activeloans"
                      ? "headertitle headerStyle"
                      : "font-style headerCompanyName"
                  } pointer heading-one `}
                  onClick={() => {
                    navigate("/activeloans");
                    dispatch(setLendHeader(false));
                  }}
                  ref={ref6}
                >
                  Active Loans
                </Text>
              </Flex>
            </>
          )}
        </Col>

        <Col>
          <Flex gap={10} justify="end" align={"center"} ref={ref4}>
            {activeWallet.length ? (
              <Col>
                <Flex
                  gap={5}
                  align="center"
                  className="pointer"
                  onClick={showDrawer}
                  justify="space-evenly"
                >
                  {screenDimensions.width > 767 ? (
                    <>{avatarRenderer(45)}</>
                  ) : (
                    <label class="hamburger">
                      <input type="checkbox" checked={open} />
                      <svg viewBox="0 0 32 32">
                        <path
                          class="line line-top-bottom"
                          d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                        ></path>
                        <path class="line" d="M7 16 27 16"></path>
                      </svg>
                    </label>
                  )}
                </Flex>
              </Col>
            ) : (
              <Col>
                {!breakPoint.xs ? (
                  <Row justify={"end"}>
                    <CustomButton
                      className="click-btn font-weight-600 letter-spacing-small"
                      // old btn style
                      // className="button-css lend-button"
                      title={"Connect"}
                      onClick={() => {
                        if (walletState.active.length < 2) {
                          collapseConnectedModal();
                        } else {
                          successMessageNotify("Wallet already connected!");
                        }
                      }}
                    />
                  </Row>
                ) : (
                  <RxHamburgerMenu
                    color="violet"
                    size={25}
                    onClick={showDrawer}
                  />
                )}
              </Col>
            )}
          </Flex>
        </Col>
      </Row>

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "green",
          },
        }}
      >
        <Tour
          scrollIntoViewOptions={true}
          open={openTour === "false" ? false : true}
          zIndex={1}
          animated
          onClose={(location) => {
            if (location === 3) {
              localStorage.setItem("isTourEnabled", false);
              setOpenTour(localStorage.getItem("isTourEnabled"));
            } else {
              tourConfirm();
            }
          }}
          steps={tourSteps}
          indicatorsRender={(current, total) => (
            <span>
              {current + 1} / {total}
            </span>
          )}
        />
      </ConfigProvider>

      <ModalDisplay
        open={isConnectModal}
        footer={""}
        onCancel={() => {
          collapseConnectedModal();
          clearConnectionStates();
        }}
        width={breakPoint.xs ? "100%" : "35%"}
      >
        <Row justify={"start"} align={"middle"}>
          <Text
            className={`${
              breakPoint.xs ? "font-medium" : "font-large"
            } gradient-text-one biticon heading-one`}
          >
            <RiWallet3Fill
              color="#55AD9B"
              size={breakPoint.xs ? 27 : 35}
              className="border-radius-5"
            />{" "}
            Connect Wallet{" "}
          </Text>
        </Row>

        {/* <Row justify={"start"} align={"middle"}>
            <Text className={`font-small text-color-two biticon mt-15`}>
              Choose how you want to connect. If you don't have a wallet, you
              can select a provider and create one.
            </Text>
          </Row> */}

        <Row justify={"start"} align={"middle"}>
          <Text className={`font-small text-color-two biticon mt-15`}>
            Connect the Meta wallet for payments and connect any one BTC wallet
            for lending and borrowing.
          </Text>
        </Row>

        <Row justify={"start"} align={"middle"}>
          <Text className={`font-small text-color-two biticon mt-15`}>
            Note: Connect one wallet from each category.
          </Text>
        </Row>

        <Row justify={"center"}>
          <Divider />
        </Row>

        {Object.entries(activeAddresses).map((wallet) => {
          const [walletName, address] = wallet;
          return (
            <Row>
              <Flex gap={15}>
                <Text className="text-color-one font-medium">
                  {walletName === "meta" ? "Payment" : "Ordinals"} {"-->"}
                </Text>
                <Text className="text-color-four font-small">
                  {sliceAddress(address, 9)} {addressRendererWithCopy(address)}
                </Text>
              </Flex>
            </Row>
          );
        })}

        <Row>
          <Col xs={24}>
            <Tabs
              activeKey={tabKey}
              onChange={(e) => {
                e !== "3" && setTabKey(e);
              }}
              items={[
                {
                  key: "1",
                  label: (
                    <Row align={"middle"}>
                      <img
                        src={pwr_logo}
                        alt="noimage"
                        style={{ paddingRight: "10px" }}
                        width={30}
                      />
                      <Text className="font-weight-600 letter-spacing-medium text-color-one font-large">
                        {" "}
                        PWR CHAIN
                      </Text>
                    </Row>
                  ),
                  children: (
                    <>
                      {paymentWallets.map((wallet, index) => {
                        return (
                          <Row key={`index-${wallet.key}`}>
                            {walletCards(wallet, index)}
                          </Row>
                        );
                      })}
                    </>
                  ),
                },
                {
                  key: "2",
                  label: (
                    <Row align={"middle"}>
                      <img
                        src={Bitcoin}
                        alt="noimage"
                        style={{ paddingRight: "10px" }}
                        width={25}
                      />
                      <Text className="font-weight-600 letter-spacing-medium text-color-one font-large">
                        {" "}
                        BTC
                      </Text>
                    </Row>
                  ),
                  children: (
                    <>
                      {BTCWallets.map((wallet, index) => {
                        return (
                          <Row key={`index-${wallet.key}`}>
                            {walletCards(wallet, index)}
                          </Row>
                        );
                      })}
                    </>
                  ),
                },
                {
                  key: "3",
                  label: (
                    <>
                      {activeConnections.length === 2 ? (
                        <Row align={"middle"}>
                          <CustomButton
                            block
                            title={"Sign in"}
                            onClick={handleConnectionFinish}
                            className={
                              "click-btn font-weight-600 letter-spacing-small"
                            }
                          />
                        </Row>
                      ) : (
                        ""
                      )}
                    </>
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      </ModalDisplay>

      <Drawer
        closeIcon
        width={screenDimensions.width > 425 ? "320px" : "280px"}
        style={{ height: screenDimensions.width > 1199 ? "50%" : "100%" }}
        title={
          <>
            <Row justify={"space-evenly"} align={"middle"}>
              <Flex gap={10} align="center">
                {avatarRenderer(45)}
                <Text className="text-color-one">
                  {xverseAddress ? (
                    <>{sliceAddress(xverseAddress, 5)}</>
                  ) : unisatAddress ? (
                    <>{sliceAddress(unisatAddress, 5)}</>
                  ) : magicEdenAddress ? (
                    <>{sliceAddress(magicEdenAddress, 5)}</>
                  ) : (
                    <>{sliceAddress(metaAddress, 5)}</>
                  )}
                </Text>
              </Flex>
            </Row>
            <Row justify={"center"}>
              <Divider />
            </Row>
          </>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
        footer={
          <>
            <>
              {screenDimensions.width > 1199 && (
                <Row justify={"end"} className="iconalignment pointer">
                  <CustomButton
                    className="click-btn font-weight-600 letter-spacing-small"
                    onClick={async () => {
                      const chain = activeChain === "BTC" ? "ETH" : "BTC";
                      await connectNetwork(chain, false);
                    }}
                    title={
                      <Flex align="center" justify="center" gap={3}>
                        <IoIosSwitch
                          color="white"
                          style={{ fill: "chocolate" }}
                          size={25}
                        />
                        Switch network
                      </Flex>
                    }
                    block
                    size="medium"
                  />
                </Row>
              )}
            </>
            <>
              {screenDimensions.width > 1199 && (
                <Row justify={"end"} className="iconalignment pointer mt-15">
                  <CustomButton
                    className="click-btn font-weight-600 letter-spacing-small"
                    onClick={async () => {
                      dispatch(clearStates());
                      dispatch(setActiveChain("BTC"));
                      successMessageNotify("Your are signed out!");
                      dispatch(clearWalletState());
                      clearConnectionStates();
                      onClose();
                    }}
                    title={
                      <Flex align="center" justify="center" gap={3}>
                        <AiOutlineDisconnect
                          color="white"
                          style={{ fill: "chocolate" }}
                          size={25}
                        />
                        Disconnect
                      </Flex>
                    }
                    block
                    size="medium"
                  />
                </Row>
              )}
            </>
          </>
        }
      >
        {/* Drawer Renderer */}
        <>
          <Row justify={"space-between"} align={"middle"}>
            <Col>
              <Flex align="center">
                {activeChain === "BTC" ? (
                  <img
                    src={Bitcoin}
                    alt="logo"
                    style={{ marginRight: "40px" }}
                    width={25}
                  />
                ) : (
                  <img
                    src={Eth}
                    alt="logo"
                    style={{ marginRight: "40px" }}
                    width={20}
                  />
                )}
                <Flex vertical>
                  <Text className="text-color-two font-medium">Payments</Text>
                  <Text className="text-color-one font-xsmall">
                    {metaAddress ? (
                      <>
                        {sliceAddress(metaAddress, 9)}{" "}
                        {addressRendererWithCopy(metaAddress)}
                      </>
                    ) : (
                      "---"
                    )}
                  </Text>
                </Flex>
              </Flex>
            </Col>

            <Col>
              {walletState.active.includes(META_WALLET_KEY) ? null : (
                <CustomButton
                  className="font-size-18 black-bg text-color-one border-none"
                  title={"Connect"}
                  onClick={() => {
                    if (walletState.active.length < 2) {
                      collapseConnectedModal();
                    } else {
                      successMessageNotify("Wallet already connected!");
                    }
                  }}
                />
              )}
            </Col>
          </Row>

          <Row justify={"space-between"} className="mt" align={"middle"}>
            <Col>
              <Flex align="center">
                <img
                  src={ordinals_O_logo}
                  alt="bitcoin"
                  style={{ marginRight: "40px", borderRadius: "50%" }}
                  width={25}
                />
                <Flex vertical>
                  <Text className="text-color-two font-medium">Ordinals</Text>
                  <Text className="text-color-one font-xsmall">
                    {xverseAddress ? (
                      <>
                        {sliceAddress(xverseAddress, 9)}{" "}
                        {addressRendererWithCopy(xverseAddress)}
                      </>
                    ) : unisatAddress ? (
                      <>
                        {sliceAddress(unisatAddress, 9)}{" "}
                        {addressRendererWithCopy(unisatAddress)}
                      </>
                    ) : magicEdenAddress ? (
                      <>
                        {sliceAddress(magicEdenAddress, 9)}{" "}
                        {addressRendererWithCopy(magicEdenAddress)}
                      </>
                    ) : (
                      "---"
                    )}
                  </Text>
                </Flex>
              </Flex>
            </Col>

            {/* <Col>
              <CustomButton
                className="font-size-18 black-bg text-color-one border-none"
                title={"Connect"}
                onClick={() => {
                  handleTransfer();
                }}
              />
            </Col> */}

            <Col>
              {walletState.active.includes(XVERSE_WALLET_KEY) ||
              walletState.active.includes(UNISAT_WALLET_KEY) ||
              walletState.active.includes(MAGICEDEN_WALLET_KEY) ? null : (
                <CustomButton
                  className="font-size-18 black-bg text-color-one border-none"
                  title={"Connect"}
                  onClick={() => {
                    if (walletState.active.length < 2) {
                      collapseConnectedModal();
                    } else {
                      successMessageNotify("Wallet already connected!");
                    }
                  }}
                />
              )}
            </Col>
          </Row>

          {screenDimensions.width < 1200 && (
            <>
              <Row
                style={{ marginTop: "10px" }}
                justify={{
                  xs: "center",
                  sm: "center",
                  md: "end",
                  lg: "end",
                  xl: "end",
                }}
                className="iconalignment pointer"
              >
                <CustomButton
                  className={"click-btn font-weight-600 letter-spacing-small"}
                  onClick={async () => {
                    dispatch(clearStates());
                    dispatch(setActiveChain("BTC"));
                    successMessageNotify("Your are signed out!");
                    dispatch(clearWalletState());
                    clearConnectionStates();
                    onClose();
                  }}
                  title={
                    <>
                      <AiOutlineDisconnect
                        color="white"
                        style={{ fill: "chocolate" }}
                        size={25}
                      />
                      <Text className="text-color-two font-small heading-one">
                        Disconnect
                      </Text>
                    </>
                  }
                  block
                  size="medium"
                />
              </Row>
              <Row justify={"center"}>
                <Divider />
              </Row>
              <Menu
                onClick={onClick}
                style={{ width: screenDimensions.width > 425 ? 270 : 230 }}
                defaultOpenKeys={["sub1"]}
                selectedKeys={[current]}
                mode="inline"
                items={options}
              />
              {/* {screenDimensions.width < 992 && (
                <Row style={{ padding: " 0px 24px", marginTop: "10px" }}>
                  <Col>
                    <Loading
                      spin={!constantState.btcvalue}
                      indicator={
                        <TailSpin
                          stroke="#6a85f1"
                          alignmentBaseline="central"
                        />
                      }
                    >
                      {constantState.btcvalue ? (
                        <Flex gap={5}>
                          <Text className="gradient-text-one font-small heading-one">
                            BTC
                          </Text>
                          <img
                            src={Bitcoin}
                            alt="noimage"
                            style={{ justifyContent: "center" }}
                            width="35dvw"
                          />{" "}
                          <Text className="gradient-text-one font-small heading-one">
                            $ {constantState.btcvalue}
                          </Text>
                        </Flex>
                      ) : (
                        ""
                      )}
                    </Loading>
                  </Col>
                </Row>
              )} */}
            </>
          )}
        </>
        {/* Drawer renderer ended */}
      </Drawer>
    </>
  );
};

export default propsContainer(Nav);
