import { followUserUsingPost } from '@/services/socialx/userController';
import { useModel } from '@umijs/max';
import { Avatar, Button, Card, Divider, message, Space, Typography } from 'antd';
import React, { useState } from 'react';

const { Meta } = Card;
const { Text } = Typography;

interface Props {
  user: API.UserBasicInfoResponse;
  self?: boolean;
}

const UserCard: React.FC<Props> = ({ user, self = false }) => {
  const [hasFollowed, setHasFollowed] = useState(user.hasFollowed);
  const { initialState } = useModel('@@initialState');
  const toggleFollow = () => {
    followUserUsingPost({
      followUserId: user.userId,
      reqId: initialState?.currentUser?.userId,
      follow: !hasFollowed,
    })
      .then(() => {
        message.success(!hasFollowed ? '关注成功' : '取关成功');
        setHasFollowed(!hasFollowed);
      })
      .catch(() => {
        message.error('操作失败，请重试');
      });
  };

  return (
    <Card
      style={{
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '8px',
      }}
      hoverable
    >
      <Meta
        avatar={<Avatar src={user.avatar} size={64} />}
        title={<Text strong>{user.nickname}</Text>}
        description={
          <Text type="secondary" style={{ fontSize: 14 }}>
            {user.bio}
          </Text>
        }
        style={{ marginBottom: 16 }}
      />
      {self ? (
        <Card bordered={false} style={{ borderRadius: 8 }}>
          <div style={{ display: 'flex', textAlign: 'center' }}>
            <div style={{ flex: 1 }}>
              <div>
                <Text strong style={{ fontSize: 16 }}>
                  {user.followingCount}
                </Text>
              </div>
              <Text type="secondary">关注了</Text>
            </div>
            <Divider type="vertical" style={{ height: 'auto', margin: '0 16px' }} />
            <div style={{ flex: 1 }}>
              <div>
                <Text strong style={{ fontSize: 16 }}>
                  {user.followerCount}
                </Text>
              </div>
              <Text type="secondary">关注者</Text>
            </div>
          </div>
        </Card>
      ) : (
        <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
          <Button
            type={hasFollowed ? 'default' : 'primary'}
            onClick={toggleFollow}
            style={{
              width: '100%',
              borderRadius: 20,
              fontWeight: 'bold',
              transition: 'all 0.3s',
            }}
          >
            {hasFollowed ? '取关' : '关注'}
          </Button>
        </Space>
      )}
    </Card>
  );
};

export default UserCard;
