import PictureUploader from '@/components/PictureUpload';
import { MediaSource } from '@/constants/MediaConstant';
import { ResponseCode } from '@/constants/ResponseCode';
import { queryUgcInterestTagUsingGet } from '@/services/socialx/ugcMetadataController';
import { editUserInfoUsingPost } from '@/services/socialx/userController';
import {
  ProCard,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Card, Divider, message, Space, Tag, theme, Typography } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const { Text } = Typography;
const { CheckableTag } = Tag;

const ProfileSettings: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const [interestTags, setInterestTags] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>(currentUser?.avatar || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(currentUser?.personalizedTags || []);

  const [initialValue, setInitialValue] = useState<API.UserEditInfoRequest>({
    nickname: currentUser?.nickname,
    workStartTime: currentUser?.workStartTime,
    workDirection: currentUser?.workDirection,
    jobTitle: currentUser?.jobTitle,
    company: currentUser?.company,
    bio: currentUser?.bio,
    personalizedTags: currentUser?.personalizedTags,
    avatar: currentUser?.avatar,
  });

  useEffect(() => {
    queryUgcInterestTagUsingGet().then((res) => {
      if (res.data && res.data.ugcTagList) {
        const sortedTags = res.data.ugcTagList.sort(
          (a, b) => (a.priority ?? 0) - (b.priority ?? 0),
        );
        const allTags = sortedTags
          .map((tag) => tag.tagName)
          .filter((tagName): tagName is string => tagName !== undefined);
        setInterestTags(allTags);
      }
    });
  }, []);

  const handleTagChange = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  const doUpdateProfile = async (values: API.UserEditInfoRequest) => {
    try {
      const resp = await editUserInfoUsingPost({
        ...values,
        userId: currentUser?.userId,
        avatar: avatarUrl,
        personalizedTags: selectedTags,
      });
      if (resp.code === ResponseCode.SUCCESS) {
        message.success('修改成功！');
        if (initialState?.fetchUserInfo) {
          const newUserInfo = await initialState.fetchUserInfo();
          setInitialValue({ ...newUserInfo });
        }
        return;
      }
    } catch (error) {
      message.error('修改失败，请重试');
    }
  };

  return (
    <ProForm
      layout="vertical"
      onFinish={doUpdateProfile}
      initialValues={initialValue}
      submitter={{
        searchConfig: {
          submitText: '保存更改',
        },
        resetButtonProps: {
          style: {
            display: 'none',
          },
        },
      }}
    >
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ flex: 1 }}>
          <ProCard title="基本信息" bordered={false} style={{ marginBottom: '24px' }}>
            <ProForm.Group>
              <ProFormText
                name="nickname"
                label="用户名"
                tooltip="2-20个字符"
                placeholder="请输入用户名"
                rules={[{ required: true }]}
                fieldProps={{
                  showCount: true,
                  maxLength: 20,
                }}
              />
              <ProFormDatePicker
                name="workStartTime"
                label="开始工作"
                rules={[{ required: true }]}
              />
            </ProForm.Group>

            <ProFormSelect
              name="workDirection"
              label="职业方向"
              rules={[{ required: true }]}
              options={[
                { label: '后端开发', value: 1 },
                { label: '前端开发', value: 2 },
                { label: '全栈开发', value: 3 },
                { label: '移动开发', value: 4 },
                { label: 'UI/UX设计', value: 5 },
                { label: '产品经理', value: 6 },
                { label: '测试工程师', value: 7 },
                { label: '运维工程师', value: 8 },
                { label: '数据分析师', value: 9 },
                { label: '人工智能', value: 10 },
                { label: '其他', value: 11 },
              ]}
            />

            <ProForm.Group>
              <ProFormText
                name="company"
                label="公司"
                tooltip="2-50个字符"
                fieldProps={{
                  showCount: true,
                  maxLength: 50,
                }}
              />
              <ProFormText
                name="jobTitle"
                label="职位"
                tooltip="2-50个字符"
                fieldProps={{
                  showCount: true,
                  maxLength: 50,
                }}
              />
            </ProForm.Group>

            <ProFormTextArea
              name="bio"
              label="个人介绍"
              tooltip="4-100个字符"
              fieldProps={{
                showCount: true,
                maxLength: 100,
                autoSize: { minRows: 3, maxRows: 5 },
              }}
            />
          </ProCard>

          <ProCard title="兴趣标签管理" bordered={false}>
            <Card
              title="已选标签"
              style={{ marginBottom: 16 }}
              styles={{ body: { padding: '12px' } }}
              bordered={false}
            >
              {selectedTags.length > 0 ? (
                <Space size={[8, 8]} wrap>
                  {selectedTags.map((tag) => (
                    <Tag
                      key={tag}
                      closable
                      color="blue"
                      onClose={() => handleTagChange(tag, false)}
                      style={{
                        borderRadius: '16px',
                        padding: '4px 12px',
                        fontSize: '14px',
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </Space>
              ) : (
                <Text type="secondary">暂无选中标签</Text>
              )}
            </Card>

            <Divider style={{ margin: '16px 0' }} />

            <Card title="选择兴趣标签" styles={{ body: { padding: '12px' } }} bordered={false}>
              <Space size={[8, 8]} wrap>
                {interestTags.map((tag) => (
                  <CheckableTag
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onChange={(checked) => handleTagChange(tag, checked)}
                    style={{
                      borderRadius: '16px',
                      padding: '4px 12px',
                      backgroundColor: selectedTags.includes(tag) ? token.colorPrimary : '#f0f2f5',
                      color: selectedTags.includes(tag) ? '#fff' : '#595959',
                      border: selectedTags.includes(tag)
                        ? `1px solid ${token.colorPrimary}`
                        : '1px solid #d9d9d9',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: selectedTags.includes(tag)
                        ? `0 2px 5px ${token.colorPrimary}33`
                        : 'none',
                      fontSize: '14px',
                    }}
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </Space>
            </Card>
          </ProCard>
        </div>

        <ProCard
          style={{
            width: 280,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
          bordered={false}
        >
          <PictureUploader source={MediaSource.AVATAR} value={avatarUrl} onChange={setAvatarUrl} />
          <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
            格式：支持JPG、PNG、JPEG
            <br />
            大小：5MB以内
            <br />
            建议尺寸：200x200像素
          </Text>
        </ProCard>
      </div>
    </ProForm>
  );
};

export default ProfileSettings;
