import { InteractType } from '@/constants/UgcConstant';
import { interactUgcUsingPost } from '@/services/socialx/ugcController';
import { message } from 'antd';
import { useState } from 'react';

export const useUgcInteraction = (
  ugcId: string,
  initialLikeCount: number = 0,
  initialCollectCount: number = 0,
  initialLiked: boolean = false,
  initialCollected: boolean = false,
) => {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [collectCount, setCollectCount] = useState(initialCollectCount);
  const [liked, setLiked] = useState(initialLiked);
  const [collected, setCollected] = useState(initialCollected);

  const handleInteraction = async (interactionType: InteractType) => {
    const isLike = interactionType === InteractType.LIKE;
    const newState = isLike ? !liked : !collected;

    try {
      await interactUgcUsingPost({
        targetId: ugcId,
        interactionType,
        interact: newState,
        reqId: ugcId,
      });

      if (isLike) {
        setLikeCount((prev) => (newState ? prev + 1 : prev - 1));
        setLiked(newState);
      } else {
        setCollectCount((prev) => (newState ? prev + 1 : prev - 1));
        setCollected(newState);
      }

      message.success(`${isLike ? '点赞' : '收藏'}成功`);
    } catch (error) {
      message.error(`${isLike ? '点赞' : '收藏'}失败，请重试`);
    }
  };

  return {
    likeCount,
    collectCount,
    liked,
    collected,
    handleLike: () => handleInteraction(InteractType.LIKE),
    handleCollect: () => handleInteraction(InteractType.COLLECT),
  };
};
