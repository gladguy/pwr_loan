import { Card, Col, ConfigProvider, Row } from "antd";

const CardDisplay = ({
  hoverable,
  className,
  bordered,
  cover,
  onClick,
  children,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <Card
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={className}
      hoverable={hoverable}
      cover={cover}
      bordered={bordered}
    >
      {children}
    </Card>
  );
};

export default CardDisplay;

export function StatCard({ icon, value, label }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBorderSecondary: "none",
        },
      }}
    >
      <Card
        rootClassName="stat-card"
        style={{
          width: 280,
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          background: "#282a36",
        }}
        hoverable
        className="airdropCard"
      >
        <Row justify={"space-between"} align={"middle"}>
          <Col>{icon}</Col>
          <Col>
            <Row justify={"center"}>
              <span style={{ fontSize: 30, color: "#c572ef", fontWeight: 700 }}>
                {value}
              </span>
            </Row>
            <Row>
              <span style={{ fontSize: 20 }}>{label}</span>
            </Row>
          </Col>
        </Row>
      </Card>
    </ConfigProvider>
  );
}
