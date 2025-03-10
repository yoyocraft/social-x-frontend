import { queryUgcCommentaryUsingGet } from '@/services/socialx/commentaryController';
import { useParams } from '@umijs/max';
import { Button, Empty, List, message, Skeleton } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CommentItem from './CommentItem';
import ReplyList from './ReplyList';

interface CommentSectionProps {
  onRefresh?: () => void;
  isQuestion?: boolean;
  ugcAuthorId?: string;
}

const CommentSection = forwardRef<{ refreshComments: () => void }, CommentSectionProps>(
  ({ onRefresh, isQuestion = false, ugcAuthorId = '' }, ref) => {
    const [ugcCommentary, setUgcCommentary] = useState<API.CommentaryResponse[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const cursorRef = useRef<string>('0');
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

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

    // 处理展开/折叠
    const toggleReplies = (commentId: string) => {
      setExpandedComments((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(commentId)) {
          newSet.delete(commentId);
        } else {
          newSet.add(commentId);
        }
        return newSet;
      });
    };

    return (
      <InfiniteScroll
        dataLength={ugcCommentary.length}
        next={loadCommentary}
        hasMore={hasMore}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        pullDownToRefreshThreshold={50}
      >
        <List
          itemLayout="vertical"
          dataSource={ugcCommentary}
          renderItem={(item) => (
            <List.Item style={{ padding: 0, border: 'none' }}>
              {item.topCommentary && (
                <>
                  <CommentItem
                    ugcAuthorId={ugcAuthorId}
                    isQuestion={isQuestion}
                    refreshComments={refreshComments}
                    comment={item.topCommentary}
                  />
                  {item.replyList && item.replyList.length > 0 && (
                    <>
                      <Button
                        type="link"
                        onClick={() => toggleReplies(item.topCommentary?.commentaryId || '')}
                        style={{ marginLeft: 48, padding: '4px 0' }}
                      >
                        {expandedComments.has(item.topCommentary?.commentaryId || '')
                          ? '收起回复'
                          : `查看 ${item.replyList.length} 条回复`}
                      </Button>
                      {expandedComments.has(item.topCommentary?.commentaryId || '') && (
                        <ReplyList
                          ugcAuthorId={ugcAuthorId}
                          refreshComments={refreshComments}
                          topCommentaryId={item.topCommentary?.commentaryId}
                          replies={item.replyList}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </List.Item>
          )}
        />
      </InfiniteScroll>
    );
  },
);

export default CommentSection;
