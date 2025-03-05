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

  const [question, setQuestion] = useState<API.UgcResponse>();

  const { initialState } = useModel('@@initialState');

  const loadUgcDetail = async () => {
    try {
      const res = await queryUgcDetailUsingPost({ ugcId });
      setQuestion(res.data);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    loadUgcDetail();
  }, [ugcId]);

  if (!question) {
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
          <UgcCard ugc={question} />
          <CommentaryCard isQuestion ugcAuthorId={question.author?.userId} />
        </Col>

        <Col span={6}>
          <Space direction="vertical">
            {question.author && (
              <UserCard
                self={initialState?.currentUser?.userId === question.author.userId}
                user={question.author}
              />
            )}
            <Affix offsetTop={56}>
              {question.content && <MdNavbar content={question.content} />}
              <RelatedContentCard
                style={{ marginTop: 16 }}
                ugcId={question.ugcId || ''}
                ugcType={question.type || ''}
                categoryId={question.categoryId || ''}
              />
            </Affix>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default QuestionDetail;
