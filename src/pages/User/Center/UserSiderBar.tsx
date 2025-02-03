import { EyeOutlined, LikeOutlined, RiseOutlined } from '@ant-design/icons';
import { Card, Divider, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import type React from 'react';

const { Text } = Typography;

const UserSiderBar: React.FC<API.UserBasicInfoResponse> = (userInfo) => {
  const achievements = [
    { icon: <LikeOutlined />, label: '文章被点赞', value: 5 },
    { icon: <EyeOutlined />, label: '文章被阅读', value: 2296 },
    { icon: <RiseOutlined />, label: '掘力值', value: 314 },
  ];
  const collections = 19;
  const followedTags = 0;
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card title="个人成就" bordered={false}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {achievements.map((achievement, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(24, 144, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1890ff',
                }}
              >
                {achievement.icon}
              </div>
              <Space size={4}>
                <Text>{achievement.label}</Text>
                <Text strong>{achievement.value.toLocaleString()}</Text>
              </Space>
            </div>
          ))}
        </Space>
      </Card>

      <Card bordered={false}>
        <div style={{ display: 'flex', textAlign: 'center' }}>
          <div style={{ flex: 1 }}>
            <div>
              <Text strong style={{ fontSize: 16 }}>
                {userInfo.followingCount}
              </Text>
            </div>
            <Text type="secondary">关注了</Text>
          </div>
          <Divider type="vertical" style={{ height: 'auto', margin: '0 16px' }} />
          <div style={{ flex: 1 }}>
            <div>
              <Text strong style={{ fontSize: 16 }}>
                {userInfo.followerCount}
              </Text>
            </div>
            <Text type="secondary">关注者</Text>
          </div>
        </div>
      </Card>

      <Card bordered={false}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>收藏集</Text>
            <Text strong>{collections}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>关注标签</Text>
            <Text strong>{followedTags}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>加入于</Text>
            <Text strong>{dayjs(userInfo.joinTime).format('YYYY-MM-DD')}</Text>
          </div>
        </Space>
      </Card>
    </Space>
  );
};

export default UserSiderBar;
