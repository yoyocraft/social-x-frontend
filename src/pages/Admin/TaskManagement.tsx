import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, Modal, Select, message } from 'antd';
import React, { useRef, useState } from 'react';

interface TaskItem {
  id: number;
  taskId: string;
  taskType: string;
  taskStatus: string;
  gmtCreate: number;
  gmtModified: number;
  extraData?: any;
}

const TaskManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data
  const mockTasks: TaskItem[] = [
    {
      id: 1,
      taskId: 'TASK-2024-001',
      taskType: 'DATA_SYNC',
      taskStatus: 'RUNNING',
      gmtCreate: Date.now() - 3600000,
      gmtModified: Date.now(),
      extraData: { source: 'system', priority: 'high' },
    },
    {
      id: 2,
      taskId: 'TASK-2024-002',
      taskType: 'REPORT_GENERATION',
      taskStatus: 'COMPLETED',
      gmtCreate: Date.now() - 7200000,
      gmtModified: Date.now() - 3600000,
      extraData: { reportType: 'daily', format: 'PDF' },
    },
  ];

  const handleView = (record: TaskItem) => {
    Modal.info({
      title: '任务详情',
      width: 600,
      content: (
        <div>
          <p>任务ID: {record.taskId}</p>
          <p>任务类型: {record.taskType}</p>
          <p>任务状态: {record.taskStatus}</p>
          <p>创建时间: {new Date(record.gmtCreate).toLocaleString()}</p>
          <p>修改时间: {new Date(record.gmtModified).toLocaleString()}</p>
          <p>额外数据: {JSON.stringify(record.extraData, null, 2)}</p>
        </div>
      ),
    });
  };

  const handleEdit = (record: TaskItem) => {
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record: TaskItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除任务 ${record.taskId} 吗？`,
      onOk: () => {
        message.success('删除成功');
        actionRef.current?.reload();
      },
    });
  };

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      message.success('操作成功');
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const columns: ProColumns<TaskItem>[] = [
    {
      title: '任务ID',
      dataIndex: 'taskId',
      copyable: true,
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      valueEnum: {
        DATA_SYNC: { text: '数据同步' },
        REPORT_GENERATION: { text: '报表生成' },
        SYSTEM_BACKUP: { text: '系统备份' },
        DATA_CLEANUP: { text: '数据清理' },
      },
    },
    {
      title: '任务状态',
      dataIndex: 'taskStatus',
      valueEnum: {
        PENDING: { text: '待处理', status: 'default' },
        RUNNING: { text: '运行中', status: 'processing' },
        COMPLETED: { text: '已完成', status: 'success' },
        FAILED: { text: '失败', status: 'error' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: '修改时间',
      dataIndex: 'gmtModified',
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <a key="view" onClick={() => handleView(record)}>
          查看
        </a>,
        <a key="edit" onClick={() => handleEdit(record)}>
          编辑
        </a>,
        <a key="delete" onClick={() => handleDelete(record)}>
          删除
        </a>,
      ],
    },
  ];

  return (
    <div>
      <ProTable<TaskItem>
        headerTitle="任务管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={handleAdd}>
            <PlusOutlined /> 新建任务
          </Button>,
        ]}
        request={async () => {
          // Mock API call
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
          return {
            data: mockTasks,
            success: true,
            total: mockTasks.length,
          };
        }}
        columns={columns}
      />

      <Modal
        title="任务信息"
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="taskId"
            label="任务ID"
            rules={[{ required: true, message: '请输入任务ID' }]}
          >
            <Input placeholder="请输入任务ID" />
          </Form.Item>
          <Form.Item
            name="taskType"
            label="任务类型"
            rules={[{ required: true, message: '请选择任务类型' }]}
          >
            <Select
              placeholder="请选择任务类型"
              options={[
                { value: 'DATA_SYNC', label: '数据同步' },
                { value: 'REPORT_GENERATION', label: '报表生成' },
                { value: 'SYSTEM_BACKUP', label: '系统备份' },
                { value: 'DATA_CLEANUP', label: '数据清理' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="taskStatus"
            label="任务状态"
            rules={[{ required: true, message: '请选择任务状态' }]}
          >
            <Select
              placeholder="请选择任务状态"
              options={[
                { value: 'PENDING', label: '待处理' },
                { value: 'RUNNING', label: '运行中' },
                { value: 'COMPLETED', label: '已完成' },
                { value: 'FAILED', label: '失败' },
              ]}
            />
          </Form.Item>
          <Form.Item name="extraData" label="额外数据">
            <Input.TextArea placeholder="请输入JSON格式的额外数据" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskManagement;
