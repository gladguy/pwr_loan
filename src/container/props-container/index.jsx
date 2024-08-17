import { Actor, HttpAgent } from "@dfinity/agent";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Notify from "../../component/notification";
import { apiFactory } from "../../ordinal_canister";
import {
  setAgent,
  setAllBorrowRequest,
  setApprovedCollection,
  setBorrowCollateral,
  setBtcValue,
  setCollection,
  setEthValue,
  setUserAssets,
  setUserCollateral,
} from "../../redux/slice/constant";
import { rootstockApiFactory } from "../../rootstock_canister";
import borrowJson from "../../utils/borrow_abi.json";
import {
  API_METHODS,
  BorrowContractAddress,
  IS_USER,
  TokenContractAddress,
  agentCreator,
  apiUrl,
  calculateAPY,
  ordinals,
  rootstock,
} from "../../utils/common";
import tokenAbiJson from "../../utils/tokens_abi.json";

export const propsContainer = (Component) => {
  function ComponentWithRouterProp(props) {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const reduxState = useSelector((state) => state);
    const activeWallet = reduxState.wallet.active;
    const xverseAddress = reduxState.wallet.xverse.ordinals.address;
    const unisatAddress = reduxState.wallet.unisat.address;
    const magicEdenAddress = reduxState.wallet.magicEden.ordinals.address;
    const metaAddress = reduxState.wallet.meta.address;
    const api_agent = reduxState.constant.agent;
    const collections = reduxState.constant.collection;
    const approvedCollections = reduxState.constant.approvedCollections;
    const userAssets = reduxState.constant.userAssets;
    const ckBtcAgent = reduxState.constant.ckBtcAgent;
    const activeChain = reduxState.wallet.activeChain;
    const ckBtcActorAgent = reduxState.constant.ckBtcActorAgent;
    const ckEthAgent = reduxState.constant.ckEthAgent;
    const ckEthActorAgent = reduxState.constant.ckEthActorAgent;
    const withdrawAgent = reduxState.constant.withdrawAgent;

    const [isEthConnected, setIsEthConnected] = useState(false);

    useEffect(() => {
      if (activeWallet.length) {
        (async () => {
          try {
            const isConnected = await window.ethereum.isConnected();
            setIsEthConnected(isConnected);
          } catch (error) {
            console.log("error eth isConnected", error);
          }
        })();
      }
    }, [activeWallet.length]);

    const address = xverseAddress
      ? xverseAddress
      : unisatAddress
      ? unisatAddress
      : magicEdenAddress;

    const WAHEED_ADDRESS = process.env.REACT_APP_WAHEED_ADDRESS;

    const btcPrice = async () => {
      const BtcData = await API_METHODS.get(
        `${apiUrl.Asset_server_base_url}/api/v1/fetch/BtcPrice`
      );
      return BtcData;
    };

    const fetchBTCLiveValue = async () => {
      try {
        const BtcData = await btcPrice();
        if (BtcData.data.data[0]?.length) {
          const btcValue = BtcData.data.data[0].flat();
          dispatch(setBtcValue(btcValue[1]));
        } else {
          fetchBTCLiveValue();
        }
      } catch (error) {
        // Notify("error", "Failed to fetch Btc");
      }
    };

    const ethPrice = async () => {
      const BtcData = await API_METHODS.get(
        `${apiUrl.Asset_server_base_url}/api/v1/fetch/EthPrice`
      );
      return BtcData;
    };

    const fetchETHLiveValue = async () => {
      try {
        const EthData = await ethPrice();
        if (EthData.data.data[0]?.length) {
          const ethValue = EthData.data.data[0].flat();
          dispatch(setEthValue(ethValue[1]));
        } else {
          fetchETHLiveValue();
        }
      } catch (error) {
        // Notify("error", "Failed to fetch Eth");
      }
    };

    useEffect(() => {
      (async () => {
        try {
          if (!api_agent) {
            const ordinalAgent = new HttpAgent({
              host: process.env.REACT_APP_HTTP_AGENT_ACTOR_HOST,
            });

            const agent = Actor.createActor(apiFactory, {
              agent: ordinalAgent,
              canisterId: ordinals,
            });

            dispatch(setAgent(agent));
          }
        } catch (error) {
          Notify("error", error.message);
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
      (() => {
        setInterval(async () => {
          fetchBTCLiveValue();
          fetchETHLiveValue();
        }, [300000]);
        return () => clearInterval();
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api_agent, dispatch]);

    useEffect(() => {
      (async () => {
        if (api_agent) {
          const result = await api_agent.get_collections();
          const approvedCollections = await api_agent.getApproved_Collections();
          const collections = JSON.parse(result);
          if (approvedCollections.length) {
            const collectionPromise = approvedCollections.map(async (asset) => {
              const [, col] = asset;
              const collection = collections.find(
                (predict) => predict.symbol === col.collectionName
              );
              return new Promise(async (resolve, _) => {
                const { data } = await API_METHODS.get(
                  `${apiUrl.Asset_server_base_url}/api/v2/fetch/collection/${col.collectionName}`
                );
                resolve({ ...col, ...data.data, ...collection });
              });
            });

            const collectionDetails = await Promise.all(collectionPromise);
            const finalResult = collectionDetails.map((col) => {
              const { yield: yields, terms } = col;
              const term = Number(terms);
              const APY = calculateAPY(yields, term);
              const LTV = 0;
              return {
                ...col,
                terms: term,
                APY,
                LTV,
              };
            });
            dispatch(setApprovedCollection(finalResult));
          }
          dispatch(setCollection(collections));
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api_agent, dispatch]);

    const getCollectionDetails = async (filteredData) => {
      try {
        const isFromApprovedAssets = filteredData.map(async (asset) => {
          return new Promise(async (resolve) => {
            const result = await API_METHODS.get(
              `${apiUrl.Asset_server_base_url}/api/v2/fetch/asset/${asset.id}`
            );
            resolve(...result.data?.data?.tokens);
          });
        });
        const revealedPromise = await Promise.all(isFromApprovedAssets);
        let collectionSymbols = {};
        collections.forEach(
          (collection) =>
            (collectionSymbols = {
              ...collectionSymbols,
              [collection.symbol]: collection,
            })
        );
        const collectionNames = collections.map(
          (collection) => collection.symbol
        );
        const isFromApprovedCollections = revealedPromise.filter((assets) =>
          collectionNames.includes(assets.collectionSymbol)
        );

        const finalPromise = isFromApprovedCollections.map((asset) => {
          const collection = collectionSymbols[asset.collectionSymbol];
          return {
            ...asset,
            collection,
          };
        });
        return finalPromise;
      } catch (error) {
        console.log("getCollectionDetails error", error);
      }
    };

    const fetchWalletAssets = async (address) => {
      try {
        const result = await API_METHODS.get(
          `${apiUrl.Asset_server_base_url}/api/v1/fetch/assets/${address}`
        );
        if (result.data?.data?.length) {
          const filteredData = result.data.data.filter(
            (asset) =>
              asset.mimeType === "text/html" ||
              asset.mimeType === "image/webp" ||
              asset.mimeType === "image/jpeg" ||
              asset.mimeType === "image/png" ||
              asset.mimeType === "image/svg+xml"
          );
          const finalPromise = await getCollectionDetails(filteredData);
          return finalPromise;
        } else {
          return [];
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    const getCollaterals = async () => {
      let colResult = [];
      try {
        const API = agentCreator(rootstockApiFactory, rootstock);
        const userAssets = await API.getUserSupply(
          IS_USER ? address : WAHEED_ADDRESS
        );
        const supplyData = userAssets.map((asset) => JSON.parse(asset));
        colResult = await getCollectionDetails(supplyData);
        // --------------------------------------------------
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          TokenContractAddress,
          tokenAbiJson,
          signer
        );

        const tokens = await contract.tokensOfOwner(metaAddress);

        const userMintedTokens = tokens.map((token) =>
          Number(token.toString())
        );

        const finalData = colResult.map((asset) => {
          let data = { ...asset, collection: {} };
          approvedCollections.forEach((col) => {
            if (col.symbol === asset.collection.symbol) {
              data = {
                ...asset,
                collection: col,
                isToken: userMintedTokens.includes(asset.inscriptionNumber)
                  ? true
                  : false,
              };
            }
          });
          return data;
        });

        const borrowCollateral = finalData.filter((asset) => asset.isToken);
        dispatch(setBorrowCollateral(borrowCollateral));
        dispatch(setUserCollateral(finalData));
      } catch (error) {
        if (
          error.message.includes("No NFT found") ||
          error.message.includes("No single NFT has been minted yet")
        ) {
          const finalData = colResult.map((asset) => {
            let data = { ...asset, collection: {} };
            approvedCollections.forEach((col) => {
              if (col.symbol === asset.collection.symbol) {
                data = {
                  ...asset,
                  collection: col,
                  isToken: [].includes(asset.inscriptionNumber) ? true : false,
                };
              }
            });
            return data;
          });

          const borrowCollateral = finalData.filter((asset) => asset.isToken);
          dispatch(setBorrowCollateral(borrowCollateral));
          dispatch(setUserCollateral(finalData));
        } else {
          console.log("Collateral fetching error", error.message);
        }
      }
    };

    const getAllBorrowRequests = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const borrowContract = new ethers.Contract(
          BorrowContractAddress,
          borrowJson,
          signer
        );
        const ActiveReq = await borrowContract.getActiveBorrowRequests();
        dispatch(setAllBorrowRequest(ActiveReq));
      } catch (error) {
        console.log("fetching all borrow request error", error);
      }
    };

    useEffect(() => {
      (async () => {
        if (activeWallet.length && collections[0]?.symbol && !userAssets) {
          const result = await fetchWalletAssets(
            IS_USER
              ? xverseAddress
                ? xverseAddress
                : unisatAddress
                ? unisatAddress
                : magicEdenAddress
              : WAHEED_ADDRESS
          );
          const testData = result?.reduce((acc, curr) => {
            // Find if there is an existing item with the same collectionSymbol
            let existingItem = acc.find(
              (item) => item.collectionSymbol === curr.collectionSymbol
            );

            if (existingItem) {
              // If found, add the current item to the duplicates array
              if (!existingItem.duplicates) {
                existingItem.duplicates = [];
              }
              existingItem.duplicates.push(curr);
            } else {
              // If not found, add the current item to the accumulator
              acc.push(curr);
            }

            return acc;
          }, []);

          // Without getting duplicate
          // const uniqueData = result?.filter(
          //   (obj, index, self) =>
          //     index ===
          //     self.findIndex((o) => o.collectionSymbol === obj.collectionSymbol)
          // );

          if (testData?.length) {
            dispatch(setUserAssets(testData));
          }
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeWallet, collections]);

    useEffect(() => {
      if (activeWallet.length && approvedCollections[0]) {
        getCollaterals();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeWallet, approvedCollections, activeChain]);

    useEffect(() => {
      if (activeWallet.length) {
        getAllBorrowRequests();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeWallet, activeChain]);

    useEffect(() => {
      //Fetching BTC Value
      fetchBTCLiveValue();

      fetchETHLiveValue();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
        redux={{ dispatch, reduxState }}
        wallet={{
          api_agent,
          ckBtcAgent,
          ckEthAgent,
          withdrawAgent,
          isEthConnected,
          ckBtcActorAgent,
          ckEthActorAgent,
          getCollaterals,
          getAllBorrowRequests,
        }}
      />
    );
  }
  return ComponentWithRouterProp;
};
