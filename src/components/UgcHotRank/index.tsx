import { listHotUgcUsingGet } from '@/services/socialx/ugcController';
import { Link } from '@umijs/max';
import { Card, List, Skeleton } from 'antd';
import { useEffect, useState } from 'react';

const UgcHotRank = () => {
  const [hotUgcList, setHotUgcList] = useState<API.UgcResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const loadHotUgc = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    listHotUgcUsingGet()
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
    return <Skeleton active />;
  }

  return (
    <Card title="📈 文章榜">
      <List
        size="small"
        dataSource={hotUgcList}
        renderItem={(item) => (
          <List.Item>
            <Link
              to={`/article/${item.ugcId}`}
              style={{
                display: 'inline-block',
                maxWidth: 'calc(100% - 38px)',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                verticalAlign: 'middle',
              }}
              key={item.ugcId}
            >
              {item.title}
            </Link>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default UgcHotRank;
