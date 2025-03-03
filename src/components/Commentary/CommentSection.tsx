import { queryUgcCommentaryUsingGet } from '@/services/socialx/commentaryController';
import { useParams } from '@umijs/max';
import { Empty, List, message, Skeleton } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CommentItem from './CommentItem';
import ReplyList from './ReplyList';

interface CommentSectionProps {
  onRefresh?: () => void;
  isQuestion?: boolean;
}

const CommentSection = forwardRef<{ refreshComments: () => void }, CommentSectionProps>(
  ({ onRefresh, isQuestion = false }, ref) => {
    const [ugcCommentary, setUgcCommentary] = useState<API.CommentaryResponse[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const cursorRef = useRef<string>('0');

    const params = useParams();
    const { ugcId } = params;

    const loadCommentary = async () => {
      try {
        const res = await queryUgcCommentaryUsingGet({
          cursor: cursorRef.current,
          ugcId,
        });
        setUgcCommentary((prev) => [...prev, ...(res.data?.data ?? [])]);
        cursorRef.current = res.data?.cursor ?? '0';
        setHasMore(res.data?.hasMore ?? false);
      } catch (error: any) {
        message.error(error.message);
      }
    };

    const refreshComments = () => {
      setUgcCommentary([]);
      cursorRef.current = '0';
      loadCommentary();
      onRefresh?.();
    };

    useImperativeHandle(ref, () => ({
      refreshComments,
    }));

    useEffect(() => {
      loadCommentary();
    }, [ugcId]);

    if (!ugcCommentary || !ugcCommentary.length) {
      return <Empty description="暂无评论" />;
    }

    return (
      <div id="scrollableDiv" className="comment-section">
        <InfiniteScroll
          dataLength={ugcCommentary.length}
          next={loadCommentary}
          hasMore={hasMore}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          scrollableTarget="scrollableDiv"
        >
          <List
            itemLayout="vertical"
            dataSource={ugcCommentary}
            renderItem={(item) => (
              <List.Item style={{ padding: 0, border: 'none' }}>
                {item.topCommentary && (
                  <CommentItem
                    isQuestion={isQuestion}
                    refreshComments={refreshComments}
                    comment={item.topCommentary}
                  />
                )}
                {item.replyList && item.replyList.length > 0 && (
                  <ReplyList
                    refreshComments={refreshComments}
                    topCommentaryId={item.topCommentary?.commentaryId}
                    replies={item.replyList}
                  />
                )}
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    );
  },
);

export default CommentSection;
