import { Row, Typography } from "antd";
import { LiaConnectdevelop } from "react-icons/lia";

const WalletConnectDisplay = ({ isPlugError, heading, message }) => {
  const { Text } = Typography;
  return (
    <>
      <Row justify={"center"} className="mt-70">
        <LiaConnectdevelop
          color="violet"
          className="egg border-radius-50"
          size={150}
        />
      </Row>
      <Row justify={"center"}>
        <Text className="text-color-one font-large font-weight-600">
          {heading ? heading : `Please connect your wallet`}
        </Text>
      </Row>
      <Row justify={"center"}>
        <Text className="text-color-two font-small mt">
          {message
            ? message
            : "Please connect your wallet to see your supplies, borrowings, and open positions."}
        </Text>
      </Row>
    </>
  );
};

export default WalletConnectDisplay;
