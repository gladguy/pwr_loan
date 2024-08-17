import { Spin } from "antd";

const Loading = ({ children, spin, loaderTip, indicator, className }) => {
  return (
    <Spin
      tip={loaderTip}
      spinning={spin}
      className={className}
      indicator={indicator}
    >
      {children}
    </Spin>
  );
};

export default Loading;

// Bars,
// BallTriangle,
// Audio,
// Circles,
// Grid,
// Hearts,
// Oval,
// Puff,
// Rings,
// SpinningCircles,
// TailSpin,
// ThreeDots,
