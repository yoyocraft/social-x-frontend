import type React from 'react';

import { UgcType } from '@/constants/UgcConstant';
import { listHotUgcUsingPost } from '@/services/socialx/ugcController';
import { FireOutlined, StarFilled } from '@ant-design/icons';
import { Card, Empty, List, Skeleton, Typography } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  ugcType: string;
  title?: string;
}

const { Link } = Typography;

const UgcHotRank: React.FC<Props> = ({ ugcType, title = '文章榜' }) => {
  const [hotUgcList, setHotUgcList] = useState<API.UgcResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const calculateJumpUrl = (item: API.UgcResponse) => {
    switch (ugcType) {
      case UgcType.ARTICLE:
        return `/article/${item.ugcId}`;
      case UgcType.POST:
        return `/post/${item.ugcId}`;
      case UgcType.QUESTION:
        return `/question/${item.ugcId}`;
      default:
        return `/article/${item.ugcId}`;
    }
  };

  const loadHotUgc = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    listHotUgcUsingPost({ ugcType })
      .then((res) => {
        setHotUgcList(res.data || []);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadHotUgc();
  }, []);

  if (loading) {
    return (
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StarFilled style={{ color: '#faad14' }} />
            <span>{title}</span>
          </div>
        }
        style={{ background: '#f0f7ff' }}
      >
        <Skeleton active />
      </Card>
    );
  }

  if (!ugcType || !hotUgcList.length) {
    return (
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StarFilled style={{ color: '#faad14' }} />
            <span>{title}</span>
          </div>
        }
        style={{ background: '#f0f7ff' }}
      >
        <Empty description="暂无数据" />
      </Card>
    );
  }

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StarFilled style={{ color: '#faad14' }} />
          <span>{title}</span>
        </div>
      }
      styles={{ body: { padding: '12px 24px' } }}
    >
      <List
        size="small"
        dataSource={hotUgcList}
        renderItem={(item) => (
          <List.Item style={{ padding: '12px 0', border: 'none' }}>
            <div style={{ width: '100%' }}>
              <Link
                href={calculateJumpUrl(item)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                }}
              >
                <Typography.Text
                  ellipsis
                  style={{
                    flex: 1,
                    fontSize: '14px',
                    color: 'rgba(0, 0, 0, 0.88)',
                  }}
                >
                  {item.title}
                </Typography.Text>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    color: '#8c8c8c',
                    fontSize: '12px',
                    flexShrink: 0,
                  }}
                >
                  <FireOutlined style={{ fontSize: '12px' }} />
                  <span>{item.viewCount || 0}</span>
                </div>
              </Link>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default UgcHotRank;
