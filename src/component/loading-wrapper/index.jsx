import { Spin } from "antd";
import { useSelector } from "react-redux";
import bitcoin from "../../assets/coin_logo/Bitcoin.png";
import ethereum from "../../assets/coin_logo/eth_logo.png";

const LoadingWrapper = ({ children }) => {
  const loading = useSelector((state) => state.constant.isLoading);
  const activeChain = useSelector((state) => state.wallet.activeChain);
  return (
    <Spin
      style={{ zIndex: 2 }}
      indicator={
        <img
          className="image"
          src={activeChain === "BTC" ? bitcoin : ethereum}
          alt=""
          width="60%"
          height={activeChain === "BTC" ? "60%" : "120%"}
        ></img>
      }
      spinning={loading}
    >
      {children}
    </Spin>
  );
};

export default LoadingWrapper;
