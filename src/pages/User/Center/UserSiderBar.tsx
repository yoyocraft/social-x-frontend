import {
  BookOutlined,
  CalendarOutlined,
  CommentOutlined,
  FileTextOutlined,
  FireOutlined,
  LikeOutlined,
  QuestionCircleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Card, Divider, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import type React from 'react';

const { Text } = Typography;

interface Props {
  userInfo?: API.UserBasicInfoResponse;
  ugcStatistic?: API.UgcStatisticResponse;
}

const UserSiderBar: React.FC<Props> = ({ userInfo, ugcStatistic = {} }) => {
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* 关注信息 */}
      <Card bordered={false}>
        <div style={{ display: 'flex', textAlign: 'center' }}>
          <div style={{ flex: 1 }}>
            <div>
              <Text strong style={{ fontSize: 16 }}>
                {userInfo?.followingCount || 0}
              </Text>
            </div>
            <Text type="secondary">关注了</Text>
          </div>
          <Divider type="vertical" style={{ height: 'auto', margin: '0 16px' }} />
          <div style={{ flex: 1 }}>
            <div>
              <Text strong style={{ fontSize: 16 }}>
                {userInfo?.followerCount || 0}
              </Text>
            </div>
            <Text type="secondary">关注者</Text>
          </div>
        </div>
      </Card>

      {/* 内容统计卡片 */}
      <Card
        title={
          <>
            <FileTextOutlined /> 内容统计
          </>
        }
        bordered={false}
        size="small"
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <BookOutlined />
              <Text>文章</Text>
            </Space>
            <Text strong>{ugcStatistic?.articleCount || 0}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <CommentOutlined />
              <Text>动态</Text>
            </Space>
            <Text strong>{ugcStatistic?.postCount || 0}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <QuestionCircleOutlined />
              <Text>问答</Text>
            </Space>
            <Text strong>{ugcStatistic?.questionCount || 0}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <StarOutlined />
              <Text>收藏</Text>
            </Space>
            <Text strong>{ugcStatistic?.collectCount || 0}</Text>
          </div>
        </Space>
      </Card>

      {/* 活跃度卡片 */}
      <Card
        title={
          <>
            <FireOutlined /> 活跃度
          </>
        }
        bordered={false}
        size="small"
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <LikeOutlined />
              <Text>获赞</Text>
            </Space>
            <Text strong>{ugcStatistic?.likeCount || 0}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <CommentOutlined />
              <Text>发表评论</Text>
            </Space>
            <Text strong>{ugcStatistic?.commentaryCount || 0}</Text>
          </div>
        </Space>
      </Card>

      {/* 用户标签 */}
      <Card title="个人标签" bordered={false} size="small">
        {userInfo?.personalizedTags?.length ? (
          <Space size={[8, 8]} wrap>
            {userInfo.personalizedTags.map((tag, index) => (
              <Tag key={index} color="blue">
                {tag}
              </Tag>
            ))}
          </Space>
        ) : (
          <Text type="secondary">暂无标签</Text>
        )}
      </Card>

      {/* 用户信息卡片 */}
      <Card bordered={false} size="small">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <CalendarOutlined />
              <Text>加入于</Text>
            </Space>
            <Text strong>{dayjs(userInfo?.joinTime).format('YYYY-MM-DD')}</Text>
          </div>
        </Space>
      </Card>
    </Space>
  );
};

export default UserSiderBar;
