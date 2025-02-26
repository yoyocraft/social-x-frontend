import { Button, Card, Typography } from 'antd';

const CheckInCard = () => {
  return (
    <Card style={{ marginBottom: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <Typography.Text strong style={{ fontSize: 20 }}>
            中午好！
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            点亮在社区的每一天
          </Typography.Text>
        </div>
        <Button type="primary" disabled>
          去签到（TODO）
        </Button>
      </div>
    </Card>
  );
};

export default CheckInCard;
