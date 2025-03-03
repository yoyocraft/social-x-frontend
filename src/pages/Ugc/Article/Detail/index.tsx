import CommentaryCard from '@/components/Commentary/CommentaryCard';
import MdNavbar from '@/components/MdNavbar';
import RelatedContentCard from '@/components/Ugc/RelatedContentCard';
import UgcCard from '@/components/Ugc/UgcCard';
import UserCard from '@/components/User/UserCard';
import { queryUgcDetailUsingPost } from '@/services/socialx/ugcController';
import { useParams } from '@umijs/max';
import { Affix, Col, message, Row, Skeleton, Space } from 'antd';
import { useEffect, useState } from 'react';

const UgcDetail: React.FC = () => {
  const params = useParams();
  const { ugcId } = params;

  const [ugcDetail, setUgcDetail] = useState<API.UgcResponse>();

  const loadUgcDetail = async () => {
    try {
      const res = await queryUgcDetailUsingPost({ ugcId });
      if (res.data) {
        setUgcDetail(res.data);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    loadUgcDetail();
  }, [ugcId]);

  if (!ugcDetail) {
    return <Skeleton active />;
  }

  return (
    <div id="ugc-detail" style={{ padding: '24px', backgroundColor: '#f9f9f9' }}>
      <Row gutter={20}>
        <Col
          span={18}
          style={{
            backgroundColor: '#fff',
            padding: '16px',
            borderRadius: 8,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <UgcCard ugc={ugcDetail} />
          <CommentaryCard />
        </Col>

        <Col span={6}>
          <Space direction="vertical">
            {ugcDetail.author && <UserCard user={ugcDetail.author} />}
            <Affix offsetTop={56}>
              {ugcDetail.content && <MdNavbar content={ugcDetail.content} />}
              <RelatedContentCard
                style={{ marginTop: 16 }}
                ugcId={ugcDetail.ugcId || ''}
                ugcType={ugcDetail.type || ''}
                tags={ugcDetail.tags || []}
                categoryId={ugcDetail.categoryId || ''}
              />
            </Affix>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default UgcDetail;
