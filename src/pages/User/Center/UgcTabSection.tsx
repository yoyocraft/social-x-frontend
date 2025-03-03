import UserArticleList from '@/components/User/UserArticleList';
import UserCollectionList from '@/components/User/UserCollectionList';
import UserFollowerList from '@/components/User/UserFollowerList';
import UserFollowingUserList from '@/components/User/UserFollowingUserList';
import UserPostList from '@/components/User/UserPostList';
import UserQuestionList from '@/components/User/UserQuestionList';
import { UgcStatus } from '@/constants/UgcConstant';
import { ProCard } from '@ant-design/pro-components';
import { Select, Tabs } from 'antd';
import React, { useState } from 'react';

const selfItems = [
  {
    key: 'collection',
    label: '收藏',
  },
  {
    key: 'follow',
    label: '关注',
  },
  {
    key: 'fan',
    label: '粉丝',
  },
  {
    key: 'draft',
    label: '草稿',
  },
];

const ugcStatusTabItems = [
  {
    value: UgcStatus.PUBLISHED,
    label: '已发布',
  },
  {
    value: UgcStatus.AUDITING,
    label: '审核中',
  },
  {
    value: UgcStatus.REJECTED,
    label: '审核不通过',
  },
];

const showExtraTabKeys = ['article', 'post', 'question'];

interface Props {
  self?: boolean;
}

const UgcTabSection: React.FC<Props> = ({ self = false }) => {
  const baseTabItems = [
    { key: 'article', label: '文章' },
    { key: 'post', label: '动态' },
    { key: 'question', label: '问答' },
  ];

  const tabItems = self ? baseTabItems.concat(selfItems) : baseTabItems;

  const [activeTabKey, setActiveTabKey] = useState(tabItems[0]?.key || 'article');
  const [ugcStatus, setUgcStatus] = useState(UgcStatus.PUBLISHED.toString());

  const handleTabChange = (key: string) => setActiveTabKey(key);
  const handleUgcStatusChange = (value: string) => setUgcStatus(value);

  const operations =
    self && showExtraTabKeys.includes(activeTabKey) ? (
      <Select
        defaultValue={ugcStatus}
        style={{ width: 120 }}
        onChange={handleUgcStatusChange}
        options={ugcStatusTabItems}
      />
    ) : null;

  return (
    <ProCard bodyStyle={{ padding: 24 }}>
      <Tabs
        activeKey={activeTabKey}
        onChange={handleTabChange}
        items={tabItems.map(({ key, label }) => ({ key, label }))}
        size="large"
        tabBarExtraContent={operations}
      />

      {activeTabKey === 'article' && <UserArticleList self={self} ugcStatus={ugcStatus} />}
      {activeTabKey === 'draft' && <UserArticleList self={self} ugcStatus={UgcStatus.DRAFT} />}
      {activeTabKey === 'post' && <UserPostList self={self} ugcStatus={ugcStatus} />}
      {activeTabKey === 'question' && <UserQuestionList self={self} ugcStatus={ugcStatus} />}
      {self && activeTabKey === 'follow' && <UserFollowingUserList />}
      {self && activeTabKey === 'fan' && <UserFollowerList />}
      {self && activeTabKey === 'collection' && <UserCollectionList />}
    </ProCard>
  );
};

export default UgcTabSection;
