import { Col, Flex, Row, Typography } from "antd";
import Link from "antd/es/typography/Link";
import { ethers } from "ethers";
import _ from "lodash";
import { useEffect, useState } from "react";
import { IoInformationCircleSharp } from "react-icons/io5";
import { MdOutlineConfirmationNumber } from "react-icons/md";
import { ThreeDots } from "react-loading-icons";
import CustomButton from "../../component/Button";
import { propsContainer } from "../../container/props-container";
import {
  API_METHODS,
  apiUrl,
  BorrowContractAddress,
  TokenContractAddress,
} from "../../utils/common";
import tokenAbiJson from "../../utils/tokens_abi.json";

const ActiveLoans = (props) => {
  const { Text, Title } = Typography;
  const { reduxState } = props.redux;
  const walletState = reduxState.wallet;

  const CONTENT_API = process.env.REACT_APP_ORDINALS_CONTENT_API;

  const approvedCollections = reduxState.constant.approvedCollections;
  const { active } = walletState;

  const [contractTokens, setContractTokens] = useState(null);
  const [collateralCount, setCollateralCount] = useState(0);
  const [collectionName, setCollectionName] = useState("");

  const getCollectionDetails = async (filteredData) => {
    try {
      const isFromApprovedAssets = filteredData.map(async (asset) => {
        return new Promise(async (resolve) => {
          const result = await API_METHODS.get(
            `${apiUrl.Asset_server_base_url}/api/v2/fetch/asset/${asset.inscription_id}`
          );
          resolve(...result.data?.data?.tokens);
        });
      });
      const revealedPromise = await Promise.all(isFromApprovedAssets);
      let collectionSymbols = {};
      approvedCollections.forEach(
        (collection) =>
          (collectionSymbols = {
            ...collectionSymbols,
            [collection.symbol]: collection,
          })
      );
      const collectionNames = approvedCollections.map(
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

  const getContractCollaterals = async () => {
    try {
      // --------------------------------------------------
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        TokenContractAddress,
        tokenAbiJson,
        signer
      );

      const result = await contract.tokensOfOwner(BorrowContractAddress);
      const tokensArray = result.map((token) => Number(token.toString()));

      const promises = tokensArray.map((token) => {
        return new Promise(async (res) => {
          const result = await API_METHODS.get(
            `${apiUrl.Asset_server_base_url}/api/v2/fetch/inscription/${token}`
          );
          res(result.data.data.data);
        });
      });

      const revealed = await Promise.all(promises);
      const finalPromise = await getCollectionDetails(revealed);

      const grouped = _.groupBy(finalPromise, "collectionSymbol");

      const data = Object.values(grouped).map((col) => col.length);

      let collateral = 0;
      data.forEach((data) => {
        collateral = collateral + data;
      });
      setCollateralCount(collateral);

      setContractTokens(grouped);
    } catch (error) {
      console.log("Collateral fetching error", error);
      if (error.message.includes("No NFT found")) {
        setContractTokens({});
      }
    }
  };

  useEffect(() => {
    if (active.length && approvedCollections[0]) {
      getContractCollaterals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, approvedCollections]);

  return (
    <>
      <Row justify={"space-between"} align={"middle"}>
        <Col>
          <h1 className="font-xlarge text-color-four letter-spacing-medium-one">
            Active Loans
          </h1>
        </Col>
      </Row>

      <Row align={"middle"}>
        <Col md={24}>
          <Flex align="center" className="page-box" gap={5}>
            <IoInformationCircleSharp size={25} color="#55AD9B" />
            <Text className="text-color-two font-small">
              Our platform allows you to leverage your valuable NFT assets as
              collateral for loans. Displayed below are the NFTs currently held
              as collateral, showcasing their unique attributes and market
              value. <Link className="font-size-16 pointer">Learn more.</Link>{" "}
            </Text>
          </Flex>
        </Col>
      </Row>

      <Row justify={"start"} gutter={12} className="mt-30">
        <Col md={4}>
          <Flex
            vertical
            className={`cards-css grey-bg-color pointer card-box-shadow-light`}
            justify="space-between"
          >
            <Flex justify="space-between" align="center">
              <Text
                className={`gradient-text-one font-small letter-spacing-small`}
              >
                Collateral Count
              </Text>
              <MdOutlineConfirmationNumber size={25} color={"grey"} />
            </Flex>
            <Flex
              gap={5}
              align="center"
              className={`text-color-two font-small letter-spacing-small`}
            >
              #{collateralCount}
            </Flex>
          </Flex>
        </Col>
      </Row>

      {/* Collaterals */}
      <Row justify={"space-between"} className="mt-5" align={"middle"}>
        <Title level={3} className={"gradient-text-one"}>
          Collaterals
        </Title>

        {collectionName ? (
          <CustomButton
            className="click-btn font-weight-600 letter-spacing-small"
            onClick={() => setCollectionName("")}
            title={"Back"}
          />
        ) : (
          ""
        )}
      </Row>

      {collectionName ? (
        <Row
          className="mt-15 pad-bottom-30"
          justify={contractTokens === null ? "center" : "start"}
          gutter={[32, 32]}
        >
          {contractTokens[collectionName].map((asset) => {
            const { id, collectionName, inscriptionNumber } = asset;
            return (
              <Col key={`${id}-${collectionName}`} md={3} className="zoom">
                <Row
                  gutter={[12, 12]}
                  justify={"space-between"}
                  className={`border-color-ash border-radius-8 border-padding-medium pointer`}
                >
                  <Col md={24}>
                    <Flex vertical gap={5}>
                      <img
                        className="border-radius-5"
                        src={`${CONTENT_API}/content/${asset.id}`}
                        alt="asset_cards"
                        width={140}
                      />

                      <Text
                        className={`text-color-one font-small letter-spacing-small d-flex-all-center`}
                      >
                        {collectionName === "Rune Specific Internet Canisters"
                          ? "RSIC"
                          : collectionName}
                      </Text>

                      <Text
                        className={`text-color-one font-small letter-spacing-small page-box box-padding-one border-radius-5 d-flex-all-center`}
                      >
                        #{inscriptionNumber}
                      </Text>
                    </Flex>
                  </Col>
                </Row>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Row
          className={`margin-bottom ${
            contractTokens === null ? "mt-90" : "mt-15"
          }`}
          justify={contractTokens === null ? "center" : "start"}
          gutter={[32, 32]}
        >
          {contractTokens === null ? (
            <ThreeDots stroke="#6a85f1" alignmentBaseline="central" />
          ) : (
            <>
              {Object?.keys(contractTokens)?.length ? (
                <>
                  {Object?.entries(contractTokens)?.map((asset, index) => {
                    const [collectionName, assets] = asset;
                    const [_one] = assets;

                    return (
                      <>
                        <Col
                          key={`${collectionName}-${index}-${Math.random()}`}
                          md={4}
                          onClick={() => setCollectionName(collectionName)}
                        >
                          <Row
                            className={`border-color-ash pointer border-radius-8 border-padding-medium`}
                          >
                            <Col md={24}>
                              <Flex vertical>
                                <img
                                  className="border-radius-5"
                                  src={_one.collection.imageURI}
                                  alt="asset_cards"
                                  width={"auto"}
                                />
                                <Text
                                  className={`stamp text-color-one mt-7 font-small letter-spacing-small page-box box-padding-one border-radius-5 d-flex-all-center`}
                                >
                                  {collectionName ===
                                  "Rune Specific Internet Canisters"
                                    ? "RSIC"
                                    : collectionName}
                                </Text>
                                <Text
                                  className={`text-color-one font-small mt-5 letter-spacing-small page-box box-padding-one border-radius-5 d-flex-all-center`}
                                >
                                  Count - #{assets?.length}
                                </Text>
                              </Flex>
                            </Col>
                          </Row>
                        </Col>
                      </>
                    );
                  })}
                </>
              ) : (
                <Text
                  className={`text-color-one mt-7 font-small letter-spacing-small box-padding-one border-radius-5 d-flex-all-center`}
                >
                  No collateral found
                </Text>
              )}
            </>
          )}
        </Row>
      )}
    </>
  );
};

export default propsContainer(ActiveLoans);
