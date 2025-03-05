import CommentaryCard from '@/components/Commentary/CommentaryCard';
import MdNavbar from '@/components/MdNavbar';
import RelatedContentCard from '@/components/Ugc/RelatedContentCard';
import UgcCard from '@/components/Ugc/UgcCard';
import UserCard from '@/components/User/UserCard';
import { queryUgcDetailUsingPost } from '@/services/socialx/ugcController';
import { history, useModel, useParams } from '@umijs/max';
import { Affix, Col, message, Row, Skeleton, Space } from 'antd';
import { useEffect, useState } from 'react';

const UgcDetail: React.FC = () => {
  const params = useParams();
  const { ugcId } = params;

  const [article, setArticle] = useState<API.UgcResponse>();
  const { initialState } = useModel('@@initialState');

  const loadUgcDetail = async () => {
    try {
      const res = await queryUgcDetailUsingPost({ ugcId });
      if (res.data) {
        setArticle(res.data);
      }
    } catch (error: any) {
      message.error(error.message);
      history.back();
    }
  };

  useEffect(() => {
    loadUgcDetail();
  }, [ugcId]);

  if (!article) {
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
          <UgcCard ugc={article} />
          <CommentaryCard ugcAuthorId={article.author?.userId} />
        </Col>

        <Col span={6}>
          <Space direction="vertical">
            {article.author && (
              <UserCard
                self={initialState?.currentUser?.userId === article.author.userId}
                user={article.author}
              />
            )}
            <Affix offsetTop={56}>
              {article.content && <MdNavbar content={article.content} />}
              <RelatedContentCard
                style={{ marginTop: 16 }}
                ugcId={article.ugcId || ''}
                ugcType={article.type || ''}
                tags={article.tags || []}
                categoryId={article.categoryId || ''}
              />
            </Affix>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default UgcDetail;
