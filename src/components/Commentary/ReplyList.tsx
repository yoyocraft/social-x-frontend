import { List } from 'antd';
import CommentItem from './CommentItem';

const ReplyList: React.FC<{
  replies?: API.CommentaryInfo[];
  topCommentaryId?: string;
  refreshComments?: () => void;
  ugcAuthorId?: string;
}> = ({ replies = [], topCommentaryId = '', refreshComments, ugcAuthorId = '' }) => {
  if (replies.length === 0) return null;

  return (
    <div
      style={{
        marginTop: 4,
        marginLeft: 36,
        background: '#fafafa',
        padding: '8px 16px',
        borderRadius: '4px',
      }}
    >
      <List
        itemLayout="vertical"
        dataSource={replies}
        split={false}
        renderItem={(reply) => (
          <List.Item style={{ padding: 0 }}>
            <CommentItem
              ugcAuthorId={ugcAuthorId}
              refreshComments={refreshComments}
              topCommentaryId={topCommentaryId}
              comment={reply}
              isReply={true}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ReplyList;
