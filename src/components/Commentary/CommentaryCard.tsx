import { useParams } from '@umijs/max';
import { Card } from 'antd';
import { useRef } from 'react';
import CommentPublisher from './CommentPublisher';
import CommentSection from './CommentSection';

interface CommentaryCardProps {
  isQuestion?: boolean;
  ugcAuthorId?: string;
}

const CommentaryCard = (props: CommentaryCardProps) => {
  const { isQuestion = false, ugcAuthorId = '' } = props;
  const commentSectionRef = useRef<{ refreshComments: () => void } | null>(null);

  const params = useParams();
  const { ugcId } = params;

  const refreshAll = async () => {
    if (commentSectionRef.current) {
      commentSectionRef.current.refreshComments();
    }
  };

  return (
    <Card title="评论区" bordered={false} style={{ marginTop: 16 }}>
      <CommentPublisher refreshComments={refreshAll} ugcId={ugcId} />
      <CommentSection ugcAuthorId={ugcAuthorId} isQuestion={isQuestion} ref={commentSectionRef} />
    </Card>
  );
};

export default CommentaryCard;
