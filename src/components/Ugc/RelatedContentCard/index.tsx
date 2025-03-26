import { UgcType } from '@/constants/UgcConstant';
import { listTimelineUgcFeedUsingPost } from '@/services/socialx/ugcController';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Empty, List, Skeleton, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';

interface Props {
  ugcId: string;
  ugcType: string;
  tags?: string[];
  categoryId?: string;
  style?: React.CSSProperties;
}

const { Link } = Typography;

const RelatedContentCard = (props: Props) => {
  const { ugcId, ugcType, tags, categoryId } = props;

  const [relatedUgc, setRelatedUgc] = useState<API.UgcResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const cursorRef = useRef('0');

  const loadRelatedUgc = () => {
    setLoading(true);

    listTimelineUgcFeedUsingPost({
      ugcId,
      ugcType,
      tags,
      categoryId,
      cursor: cursorRef.current,
      size: 8,
    })
      .then((res) => {
        setRelatedUgc(res.data?.data || []);
        cursorRef.current = res.data?.cursor || '0';
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const calLink = (item: API.UgcResponse) => {
    if (item.type === UgcType.ARTICLE) {
      return `/article/${item.ugcId}`;
    }
    if (item.type === UgcType.POST) {
      return `/post/${item.ugcId}`;
    }
    if (item.type === UgcType.QUESTION) {
      return `/question/${item.ugcId}`;
    }
  };

  const cardExtra = (
    <Button type="text" icon={<ReloadOutlined />} onClick={loadRelatedUgc}>
      换一换
    </Button>
  );

  useEffect(() => {
    loadRelatedUgc();
  }, []);

  if (!relatedUgc || relatedUgc.length === 0) {
    return (
      <Card title="相关内容" style={props.style}>
        <Empty description="暂无相关内容" />
      </Card>
    );
  }
  if (loading) {
    return (
      <Card title="相关内容" style={props.style}>
        <Skeleton active />
      </Card>
    );
  }

  return (
    <Card title="相关内容" extra={cardExtra} style={props.style}>
      <List
        size="small"
        dataSource={relatedUgc}
        renderItem={(item) => (
          <List.Item>
            <Link
              href={calLink(item) || ''}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
                width: '100%',
              }}
              key={item.ugcId}
            >
              <Typography.Text
                ellipsis
                style={{
                  flex: 1,
                  fontSize: '14px',
                  color: 'rgba(0, 0, 0, 0.88)',
                }}
              >
                {ugcType === UgcType.POST ? item.content : item.title}
              </Typography.Text>
            </Link>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RelatedContentCard;
