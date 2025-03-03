import MdViewer from '@/components/MdViewer';
import {
  publishNotificationUsingPost,
  queryNotificationUsingGet,
} from '@/services/socialx/notificationController';
import { dateTimeFormat } from '@/services/utils/time';
import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Button, message, Modal, Tooltip } from 'antd';
import type React from 'react';
import { useRef, useState } from 'react';
import NotificationForm from './NotificationForm';

const AdminNotificationPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [systemNotificationList, setSystemNotificationList] = useState<API.NotificationResponse[]>(
    [],
  );
  const [hasMore, setHasMore] = useState(true);
  const cursorRef = useRef('0');
  const { initialState } = useModel('@@initialState');
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewNotification, setViewNotification] = useState<API.NotificationResponse>();
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleView = (record: API.NotificationResponse) => {
    setIsViewModalVisible(true);
    setViewNotification(record);
  };
  const handlePublishNotification = async (values: API.NotificationPublishRequest) => {
    try {
      await publishNotificationUsingPost({
        ...values,
        reqId: initialState?.currentUser?.userId,
        notificationType: 'SYSTEM',
      });
      message.success('创建成功');
    } catch (error) {
      message.error('创建失败');
    }
  };

  const loadData = async () => {
    if (loading || !hasMore) {
      return;
    }
    setLoading(true);
    try {
      const res = await queryNotificationUsingGet({
        cursor: cursorRef.current,
        notificationType: 'SYSTEM',
      });
      setSystemNotificationList((prev) => [...prev, ...(res.data?.data || [])]);
      cursorRef.current = res.data?.cursor || '0';
      setHasMore(res.data?.hasMore || false);
    } catch (error) {
      console.error('Error loading system notification list:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ProColumns<API.NotificationResponse>[] = [
    {
      title: '标题',
      dataIndex: 'summary',
      key: 'title',
      width: 200,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      ellipsis: true,
      tooltip: '内容过长会自动收缩',
      render: (_, record) => (
        <Tooltip title={null}>
          <span>{record.content}</span>
        </Tooltip>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: 200,
      render: (_, record) => dateTimeFormat(record.gmtCreate),
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      width: 100,
      render: (_, record) => [
        <Button key={'view'} type="link" onClick={() => handleView(record)}>
          查看
        </Button>,
      ],
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <ProTable<API.NotificationResponse>
        columns={columns}
        dataSource={systemNotificationList}
        rowKey="notificationId"
        search={false}
        request={async () => {
          await loadData();
          return { success: true };
        }}
        dateFormatter="string"
        headerTitle="系统通知列表"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={showModal}>
            新建
          </Button>,
        ]}
        pagination={false}
        scroll={{ y: 500 }}
        // @ts-ignore
        onScroll={({ target }) => {
          const element = target as HTMLElement;
          if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            loadData();
          }
        }}
      />
      <Modal
        title={'新建通知'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <NotificationForm
          onFinish={async (values) => {
            await handlePublishNotification(values);
            handleCancel();
            await loadData();
          }}
        />
      </Modal>

      <Modal
        title={'查看通知'}
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
        width={1000}
      >
        <MdViewer value={viewNotification?.content} />
      </Modal>
    </div>
  );
};

export default AdminNotificationPage;
