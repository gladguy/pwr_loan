import { Button, ConfigProvider } from "antd";
import React from "react";

const CustomButton = ({
  ref,
  onClick,
  htmlType,
  className,
  icon = "",
  style = {},
  block = false,
  size = "large",
  danger = false,
  loading = false,
  type = "default",
  disabled = false,
  colorPrimary = "",
  colorPrimaryHover = "",
  title = "Default Title",
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimaryHover: colorPrimaryHover,
          colorPrimary: colorPrimary,
        },
      }}
    >
      <Button
        loading={loading}
        type={type}
        size={size}
        icon={icon}
        block={block}
        style={style}
        danger={danger}
        onClick={onClick}
        disabled={disabled}
        htmlType={htmlType}
        className={className}
        ref={ref}
      >
        {title}
      </Button>
    </ConfigProvider>
  );
};
export default CustomButton;
