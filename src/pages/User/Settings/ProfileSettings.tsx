import PictureUploader from '@/components/PictureUpload';
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
import { message, Typography } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';

const { Text } = Typography;

const ProfileSettings: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const [interestTags, setInterestTags] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>(currentUser?.avatar || '');

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
        // 按照 priority 排序
        const sortedTags = res.data.ugcTagList.sort(
          (a, b) => (a.priority ?? 0) - (b.priority ?? 0),
        );
        setInterestTags(
          sortedTags
            .map((tag) => tag.tagName)
            .filter((tagName): tagName is string => tagName !== undefined),
        );
      }
    });
  }, []);

  const doUpdateProfile = async (values: API.UserEditInfoRequest) => {
    try {
      const resp = await editUserInfoUsingPost({
        ...values,
        userId: currentUser?.userId,
        avatar: avatarUrl,
      });
      if (resp.code === ResponseCode.SUCCESS) {
        message.success('修改成功！');
        if (initialState?.fetchUserInfo) {
          const newUserInfo = await initialState.fetchUserInfo();
          setInitialValue({ ...newUserInfo });
        }
        history.push('/account/center');
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
          <ProCard title="基本信息" bordered={false}>
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
              }}
            />
          </ProCard>

          <ProCard title="兴趣标签管理" bordered={false}>
            <ProFormSelect
              name="personalizedTags"
              label="兴趣标签"
              mode="multiple"
              rules={[{ required: true }]}
              options={interestTags.map((tag) => ({ label: tag, value: tag }))}
            />
          </ProCard>
        </div>

        <ProCard style={{ width: 280 }} bordered={false}>
          <PictureUploader source="AVATAR" value={avatarUrl} onChange={setAvatarUrl} />
          <Text type="secondary" style={{ fontSize: 12 }}>
            格式：支持JPG、PNG、JPEG
            <br />
            大小：5MB以内
          </Text>
        </ProCard>
      </div>
    </ProForm>
  );
};

export default ProfileSettings;
