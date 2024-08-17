import { Col, Flex, Row, Typography } from "antd";
import Bars from "react-loading-icons/dist/esm/components/bars";
import { useSelector } from "react-redux";
import Bitcoin from "../../assets/coin_logo/Bitcoin.png";
import { calculateOrdinalInCrypto, getTimeAgo } from "../../utils/common";
import CustomButton from "../Button";
import ModalDisplay from "../modal";
import TableComponent from "../table";

const OffersModal = ({
  modalState,
  offerModalData,
  toggleOfferModal,
  toggleLendModal,
  setLendModalData,
}) => {
  const { Text } = Typography;
  const state = useSelector((state) => state);
  const offers = state.constant.offers;
  const metaAddress = state.wallet.meta.address;
  const btcvalue = state.constant.btcvalue;
  const ethValue = state.constant.EthValue;

  const ETH_ZERO = process.env.REACT_APP_ETH_ZERO;

  const activeOffersColumns = [
    {
      key: "Principal",
      title: "Principal",
      align: "left",
      dataIndex: "loanAmount",
      render: (_, obj) => (
        <Flex
          gap={3}
          align="center"
          className={`text-color-one font-size-16 letter-spacing-small`}
        >
          <img src={Bitcoin} alt="noimage" width={20} />{" "}
          {Number(obj.loanAmount) / ETH_ZERO}
        </Flex>
      ),
    },
    {
      key: "LTV",
      title: "LTV",
      align: "center",
      dataIndex: "loanToValue",
      render: (_, obj) => {
        let floor = Number(offerModalData.floorPrice)
          ? Number(offerModalData.floorPrice)
          : 30000;

        floor = calculateOrdinalInCrypto(
          floor,
          btcvalue,
          ethValue
        ).ordinalIncrypto;

        const loanAmount = Number(obj.loanAmount) / ETH_ZERO;

        const LTV = ((loanAmount / floor) * 100).toFixed(2);

        return (
          <Text className={`text-color-one font-size-16 letter-spacing-small`}>
            {Math.round(Number(LTV))}%
          </Text>
        );
      },
    },
    {
      key: "Date",
      title: "Date",
      align: "center",
      dataIndex: "loanTime",
      render: (_, obj) => (
        <Text className={`text-color-one font-size-16 letter-spacing-small`}>
          {getTimeAgo(Number(obj.createdAt) * 1000)}
        </Text>
      ),
    },
  ];
  // console.log("offerModalData", offerModalData);
  return (
    <ModalDisplay
      width={"70%"}
      footer={null}
      open={modalState}
      onCancel={toggleOfferModal}
    >
      <Row justify={"center"}>
        <Text className={"gradient-text-one font-xlarge letter-spacing-small"}>
          Accept Loan on {offerModalData.collectionName}
        </Text>
      </Row>

      <Row justify={"space-between"} className="mt-15">
        {/* Active Offers */}
        <Col md={12}>
          <Row className="pad-5">
            <Col md={24} className="border border-radius-8 card-box">
              <Row justify={"center"}>
                <Text
                  className={`text-color-two font-small letter-spacing-small`}
                >
                  Active Requests
                </Text>
              </Row>
            </Col>

            <Col
              className={`mt-5 scroll-themed`}
              md={24}
              style={{
                maxHeight: "600px",
                overflowY: offers?.length > 6 && "scroll",
                paddingRight: offers?.length > 6 && "5px",
              }}
            >
              <TableComponent
                rootClassName={"offer-table-theme"}
                loading={{
                  spinning: offers === null,
                  indicator: <Bars />,
                }}
                rowKey={(e) => `${e?.inscriptionid}-${e?.mime_type}`}
                tableColumns={[
                  ...activeOffersColumns,
                  {
                    key: "action",
                    title: " ",
                    align: "center",
                    dataIndex: "borrow",
                    render: (_, obj) => {
                      let floor = Number(offerModalData.floorPrice)
                        ? Number(offerModalData.floorPrice)
                        : 30000;

                      floor = calculateOrdinalInCrypto(
                        floor,
                        btcvalue,
                        ethValue
                      ).ordinalIncrypto;
                      const loanAmount = Number(obj.loanAmount) / ETH_ZERO;
                      const LTV = ((loanAmount / floor) * 100).toFixed(2);
                      return (
                        <CustomButton
                          className={
                            "click-btn font-weight-600 letter-spacing-small"
                          }
                          disabled={obj.borrower === metaAddress}
                          title={
                            <Flex align="center" justify="center" gap={10}>
                              <span
                                className={`text-color-one font-weight-600 pointer iconalignment font-size-16`}
                              >
                                Lend
                              </span>
                            </Flex>
                          }
                          onClick={() => {
                            toggleOfferModal();
                            toggleLendModal();
                            setLendModalData({
                              ...obj,
                              ...offerModalData,
                              floorPrice: floor,
                              LTV: Math.round(LTV),
                            });
                          }}
                        />
                      );
                    },
                  },
                ]}
                tableData={offers}
                pagination={false}
              />
            </Col>
          </Row>
        </Col>

        {/* Active Loans */}
        <Col md={12}>
          <Row className="pad-5">
            <Col md={24} className="border border-radius-8 card-box">
              <Row justify={"center"} align={"middle"}>
                <Text
                  className={`text-color-two font-small letter-spacing-small`}
                >
                  Active Loans
                </Text>
              </Row>
            </Col>

            <Col
              md={24}
              style={{
                maxHeight: "600px",
                // minHeight: "600px",
                // overflowY: offers?.length > 6 && "scroll",
                // paddingRight: offers?.length > 6 && "5px",
              }}
              className="mt-5"
            >
              <TableComponent
                rootClassName={"offer-table-theme"}
                loading={{
                  spinning: false,
                  indicator: <Bars />,
                }}
                rowKey={(e) => `${e?.inscriptionid}-${e?.mime_type}`}
                tableColumns={activeOffersColumns}
                tableData={[]}
                pagination={false}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </ModalDisplay>
  );
};

export default OffersModal;
