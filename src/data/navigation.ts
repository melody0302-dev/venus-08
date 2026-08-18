import { NavGroup, Region } from '../types';

export const NAVIGATION_GROUPS: NavGroup[] = [
  {
    id: 'main',
    items: [
      { id: 'overview', label: '概览', iconName: 'LayoutDashboard' },
      { id: 'task-center', label: '任务中心', iconName: 'ListTodo' },
      { id: 'ai-assets', label: 'AI资产管理', iconName: 'Box' },
      { id: 'api-key', label: 'API KEY', iconName: 'KeyRound' },
    ]
  },
  {
    id: 'monitoring',
    title: '监控',
    items: [
      { id: 'cluster-monitor', label: '集群监控', iconName: 'Monitor' },
      { id: 'node-monitor', label: '节点监控', iconName: 'Cpu' },
      { id: 'task-monitor', label: '任务监控', iconName: 'Activity' },
    ]
  },
  {
    id: 'resources',
    title: '资源',
    items: [
      { id: 'node-management', label: '节点管理', iconName: 'HardDrive' },
      { id: 'tenant-resources', label: '租户资源', iconName: 'Building2' },
      { id: 'scheduling-config', label: '调度区配置', iconName: 'Sliders' },
      { id: 'resource-specs', label: '资源规格', iconName: 'SlidersHorizontal' },
    ]
  },
  {
    id: 'billing',
    title: '计费',
    items: [
      { id: 'billing-settings', label: '计费设置', iconName: 'Receipt' },
      { id: 'billing-details', label: '账单详情', iconName: 'Wallet' },
    ]
  },
  {
    id: 'management',
    title: '管理',
    items: [
      { id: 'audit-log', label: '审计日志', iconName: 'FileText' },
      { id: 'service-config', label: '服务配置', iconName: 'Settings' },
      { id: 'priority-config', label: '优先级配置', iconName: 'Flame' },
      { id: 'cluster-service-management', label: '集群服务管理', iconName: 'Boxes' },
      { id: 'organization-management', label: '组织管理', iconName: 'GitFork' },
    ]
  }
];

export const REGIONS_LIST: Region[] = [
  { id: 'dc-aliyun', name: 'dc-aliyun', provider: '阿里云算力中心', status: 'online' },
  { id: 'dc-tencent', name: 'dc-tencent', provider: '腾讯云算力中心', status: 'online' },
  { id: 'dc-bj-local', name: 'dc-beijing-01', provider: '北京自建算力节点', status: 'online' },
  { id: 'dc-hz-local', name: 'dc-hangzhou-02', provider: '杭州异构算力集群', status: 'online' },
];
