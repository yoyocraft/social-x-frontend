import CommentaryCard from '@/components/Commentary/CommentaryCard';
import MdNavbar from '@/components/MdNavbar';
import RelatedContentCard from '@/components/Ugc/RelatedContentCard';
import UgcCard from '@/components/Ugc/UgcCard';
import UserCard from '@/components/User/UserCard';
import { queryUgcDetailUsingPost } from '@/services/socialx/ugcController';
import { useModel, useParams } from '@umijs/max';
import { Affix, Col, message, Row, Skeleton, Space } from 'antd';
import { useEffect, useState } from 'react';

const QuestionDetail: React.FC = () => {
  const params = useParams();
  const { ugcId } = params;

  const [questionDetail, setQuestionDetail] = useState<API.UgcResponse>();

  const { initialState } = useModel('@@initialState');

  const loadUgcDetail = async () => {
    try {
      const res = await queryUgcDetailUsingPost({ ugcId });
      setQuestionDetail(res.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    loadUgcDetail();
  }, [ugcId]);

  if (!questionDetail) {
    return <Skeleton active />;
  }

  return (
    <div id="ugc-detail" style={{ padding: '24px', backgroundColor: '#f9f9f9' }}>
      <Row gutter={20}>
        <Col
          span={18}
          style={{
            padding: '16px',
            borderRadius: 8,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <UgcCard ugc={questionDetail} />
          <CommentaryCard isQuestion />
        </Col>

        <Col span={6}>
          <Space direction="vertical">
            {questionDetail.author && (
              <UserCard
                self={initialState?.currentUser?.userId === questionDetail.author.userId}
                user={questionDetail.author}
              />
            )}
            <Affix offsetTop={56}>
              {questionDetail.content && <MdNavbar content={questionDetail.content} />}
              <RelatedContentCard
                style={{ marginTop: 16 }}
                ugcId={questionDetail.ugcId || ''}
                ugcType={questionDetail.type || ''}
                categoryId={questionDetail.categoryId || ''}
              />
            </Affix>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default QuestionDetail;
