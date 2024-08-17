import { Modal } from "antd";
import React from "react";

const ModalDisplay = ({
  width,
  title,
  open,
  onOK,
  onCancel,
  footer,
  children,
  className,
  style,
}) => {
  return (
    <Modal
      style={style}
      forceRender
      width={width}
      open={open}
      onOk={onOK}
      onCancel={onCancel}
      footer={footer}
      className={className}
      title={title}
    >
      {children}
    </Modal>
  );
};
export default ModalDisplay;
