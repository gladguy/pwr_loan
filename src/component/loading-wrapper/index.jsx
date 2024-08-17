import { Spin } from "antd";
import { useSelector } from "react-redux";
import bitcoin from "../../assets/coin_logo/Bitcoin.png";

const LoadingWrapper = ({ children }) => {
  const loading = useSelector((state) => state.constant.isLoading);
  return (
    <Spin
      style={{ zIndex: 2 }}
      indicator={
        <img
          className="image"
          src={bitcoin}
          alt=""
          width="60%"
          height="60%"
        ></img>
      }
      spinning={loading}
    >
      {children}
    </Spin>
  );
};

export default LoadingWrapper;
