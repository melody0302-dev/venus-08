import React, { useState } from 'react';
import {
  Shield,
  UserCheck,
  CheckSquare,
  Square,
  ChevronRight,
  ChevronLeft,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Layers,
  Box,
  HardDrive,
  Wallet,
  Building2,
  Users,
  Eye,
  EyeOff,
  CheckCircle2,
  Info,
  Sliders,
  Check,
  Building,
  KeyRound,
  Sparkles,
  Search,
  ArrowRight,
  ArrowLeft,
  User,
  X,
  RefreshCw,
  History,
  Clock,
  FileText,
  Filter,
  Calendar,
  AlertCircle,
  ShieldCheck,
  SlidersHorizontal
} from 'lucide-react';

export interface RolePermissionConfig {
  id: string;
  name: string;
  code: string;
  type: 'system' | 'custom';
  description: string;
  userCount: number;
  permissions: string[]; // list of permission keys
  assignedTenants: string[];
  assignedUsers: string[];
}

export interface RoleChangeLog {
  id: string;
  roleId: string;
  timestamp: string;
  operator: string;
  actionType: 'create' | 'permission_update' | 'binding_update' | 'basic_update';
  actionTitle: string;
  description: string;
  diffSummary?: {
    type: string;
    items?: { label: string; value: string; type?: 'added' | 'removed' | 'neutral' }[];
  };
}

export const INITIAL_ROLE_LOGS: RoleChangeLog[] = [
  {
    id: 'log_sa_1',
    roleId: 'super_admin',
    timestamp: '2026-08-25 09:30:15',
    operator: '系统自动初始化 (System)',
    actionType: 'create',
    actionTitle: '系统预置角色初始化',
    description: '平台启动初始化预置「超级管理员」角色，授予全量 20 项控制面与数据面权限。',
    diffSummary: {
      type: '权限矩阵',
      items: [
        { label: '初始赋权', value: '全量 20 项控制策略全部开启', type: 'added' },
        { label: '权限范围', value: '跨租户管理、算力节点配置、账单定价、组织管理', type: 'neutral' }
      ]
    }
  },
  {
    id: 'log_sa_2',
    roleId: 'super_admin',
    timestamp: '2026-08-25 10:10:42',
    operator: 'admin (超级管理员)',
    actionType: 'binding_update',
    actionTitle: '关联全局租户与主管理员',
    description: '将超级管理员权限绑定至全局租户 (Global) 及 admin、fandejun 账号。',
    diffSummary: {
      type: '关联主体',
      items: [
        { label: '生效租户', value: '全部租户 (Global)', type: 'added' },
        { label: '授权用户', value: 'admin, fandejun', type: 'added' }
      ]
    }
  },
  {
    id: 'log_ta_1',
    roleId: 'tenant_admin',
    timestamp: '2026-08-24 16:45:00',
    operator: '系统自动初始化 (System)',
    actionType: 'create',
    actionTitle: '系统预置角色初始化',
    description: '创建预置「租户管理员」角色，负责各租户内部日常业务、模型资产与账号赋权。',
    diffSummary: {
      type: '基础配置',
      items: [
        { label: '角色代码', value: 'ROLE_TENANT_ADMIN', type: 'neutral' },
        { label: '初始权限', value: '12 项常用业务与审计策略', type: 'added' }
      ]
    }
  },
  {
    id: 'log_ta_2',
    roleId: 'tenant_admin',
    timestamp: '2026-08-25 08:20:18',
    operator: 'admin (超级管理员)',
    actionType: 'permission_update',
    actionTitle: '更新组织权限控制策略',
    description: '调整操作权限：追加「安全审计日志」与「用户账号管理」查看权限。',
    diffSummary: {
      type: '权限策略',
      items: [
        { label: '追加策略', value: 'org:audit:view, org:user:manage', type: 'added' }
      ]
    }
  },
  {
    id: 'log_ta_3',
    roleId: 'tenant_admin',
    timestamp: '2026-08-25 09:15:30',
    operator: 'admin (超级管理员)',
    actionType: 'binding_update',
    actionTitle: '关联业务租户与管理员账号',
    description: '关联租户 bob-0728, alice-0728, test, liuzhao 以及对应租户管理员账号。',
    diffSummary: {
      type: '关联主体',
      items: [
        { label: '关联租户', value: 'bob-0728, alice-0728, test, liuzhao (共 4 个)', type: 'added' },
        { label: '关联用户', value: 'bob-0728, alice-0728, test-1, test, liuzhao (共 5 人)', type: 'added' }
      ]
    }
  },
  {
    id: 'log_au_1',
    roleId: 'algorithm_user',
    timestamp: '2026-08-24 14:00:10',
    operator: '系统自动初始化 (System)',
    actionType: 'create',
    actionTitle: '系统预置角色初始化',
    description: '预置「算法用户」专属角色，提供大模型训练、推理与算力开发机环境使用权限。',
    diffSummary: {
      type: '基础配置',
      items: [
        { label: '角色代码', value: 'ROLE_ALGORITHM_USER', type: 'neutral' },
        { label: '初始权限', value: '9 项模型研发核心策略', type: 'added' }
      ]
    }
  },
  {
    id: 'log_au_2',
    roleId: 'algorithm_user',
    timestamp: '2026-08-25 08:50:00',
    operator: 'admin (超级管理员)',
    actionType: 'binding_update',
    actionTitle: '关联测试租户与算法成员',
    description: '将算法用户角色授权给租户 test 及其算法工程师 fandejun。',
    diffSummary: {
      type: '关联主体',
      items: [
        { label: '生效租户', value: 'test', type: 'added' },
        { label: '生效用户', value: 'fandejun (算法工程师)', type: 'added' }
      ]
    }
  }
];

// 5 大权限分类及其细粒度操作权限
export interface PermissionCategory {
  key: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  items: {
    key: string;
    label: string;
    description: string;
  }[];
}

export const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    key: 'task',
    label: '任务权限',
    icon: <Layers className="w-4 h-4 text-blue-600" />,
    description: '涵盖模型训练任务、开发机交互环境、在线推理服务及模型微调的调度与管理',
    items: [
      { key: 'task:view', label: '任务查看与监控', description: '可查看任务列表、运行指标及日志输出' },
      { key: 'task:create', label: '任务提交与创建', description: '允许提交训练、开发机及推理服务任务' },
      { key: 'task:control', label: '任务启停与调度', description: '允许暂停、重启、终止及调整排队优先级' },
      { key: 'task:delete', label: '任务归档与删除', description: '允许清理历史任务记录及产物目录' },
    ]
  },
  {
    key: 'asset',
    label: '资产权限',
    icon: <Box className="w-4 h-4 text-purple-600" />,
    description: '涵盖模型仓库、数据集资产、自定义镜像仓库以及 API KEY 凭证生命周期管理',
    items: [
      { key: 'asset:model:manage', label: '模型资产管理', description: '查看、上传、版本发布及导出模型权重' },
      { key: 'asset:dataset:manage', label: '数据集管理', description: '数据集挂载、导入、标注及版本快照' },
      { key: 'asset:image:manage', label: '基础镜像管理', description: '构建、推送及配置专属容器运行镜像' },
      { key: 'asset:apikey:manage', label: 'API KEY 凭证', description: '创建、轮转及吊销推理调用凭证' },
    ]
  },
  {
    key: 'resource',
    label: '资源权限',
    icon: <HardDrive className="w-4 h-4 text-emerald-600" />,
    description: '涵盖物理算力节点、GPU 卡槽配额切分、调度区配置及规格标准定义',
    items: [
      { key: 'resource:node:view', label: '节点与拓扑查看', description: '查看算力服务器、GPU 物理卡槽及调度状态' },
      { key: 'resource:quota:allocate', label: '租户配额切分', description: '划分各租户专属 GPU 卡数、显存及 CPU/内存' },
      { key: 'resource:scheduling:config', label: '调度区与队列策略', description: '配置抢占式/独占式调度策略与资源池' },
      { key: 'resource:spec:manage', label: '资源规格管理', description: '自定义标准卡型规格及计费单价标准' },
    ]
  },
  {
    key: 'billing',
    label: '计费权限',
    icon: <Wallet className="w-4 h-4 text-amber-600" />,
    description: '涵盖账单明细流水、充值结算、单价定价策略及租户余额欠费控制',
    items: [
      { key: 'billing:overview:view', label: '账单查看与导出', description: '查看全平台/租户账单、消费流水与充值记录' },
      { key: 'billing:pricing:set', label: '计费费率设置', description: '配置 GPU 卡时单价、存储及网络带宽单价' },
      { key: 'billing:recharge:manage', label: '充值与余额变更', description: '执行租户账户额度充值、扣减与信用透支配置' },
      { key: 'billing:alert:config', label: '余额告警与欠费停机', description: '配置欠费策略、短信/邮件预警阈值' },
    ]
  },
  {
    key: 'organization',
    label: '组织权限',
    icon: <Building2 className="w-4 h-4 text-indigo-600" />,
    description: '涵盖租户创建与隔离、用户账号生命周期、角色赋权及审计日志追溯',
    items: [
      { key: 'org:tenant:manage', label: '租户组织管理', description: '创建租户、变更所属部门及分配默认资源池' },
      { key: 'org:user:manage', label: '用户账号管理', description: '添加用户、重置密码、修改状态与删除账号' },
      { key: 'org:role:assign', label: '角色与权限配置', description: '定义角色权限矩阵并绑定租户与用户' },
      { key: 'org:audit:view', label: '安全审计日志', description: '查看全量操作审计记录与异常行为溯源' },
    ]
  }
];

// 组织体系树结构：租户与其下属用户
export interface TenantGroup {
  tenantName: string;
  tenantCode: string;
  users: {
    username: string;
    email: string;
  }[];
}

export const ALL_TENANTS_AND_USERS: TenantGroup[] = [
  {
    tenantName: '全部租户 (Global)',
    tenantCode: 'TENANT_GLOBAL',
    users: [
      { username: 'admin', email: 'admin@infrawaves.com' },
      { username: 'fandejun', email: 'fan_de_jun@163.com' },
    ]
  },
  {
    tenantName: 'test',
    tenantCode: 'TENANT_TEST',
    users: [
      { username: 'test', email: 'test@123.com' },
      { username: 'test-1', email: '1@11.com' },
      { username: 'fandejun', email: 'fan_de_jun@163.com' },
    ]
  },
  {
    tenantName: 'bob-0728',
    tenantCode: 'TENANT_BOB_0728',
    users: [
      { username: 'bob-0728', email: 'bob-0728@infrawaves.com' },
      { username: 'bob-engineer', email: 'bob_dev@infrawaves.com' },
    ]
  },
  {
    tenantName: 'alice-0728',
    tenantCode: 'TENANT_ALICE_0728',
    users: [
      { username: 'alice-0728', email: 'alice-0728@infrawaves.com' },
      { username: 'alice-research', email: 'alice_ai@infrawaves.com' },
    ]
  },
  {
    tenantName: 'liuzhao',
    tenantCode: 'TENANT_LIUZHAO',
    users: [
      { username: 'liuzhao', email: '12@qq.com' },
      { username: 'liuzhao-assist', email: 'lz_dev@qq.com' },
    ]
  },
];

// 默认 3 个预置角色数据
const ALL_PERMISSION_KEYS = PERMISSION_CATEGORIES.flatMap(c => c.items.map(i => i.key));

export const DEFAULT_ROLES: RolePermissionConfig[] = [
  {
    id: 'super_admin',
    name: '超级管理员',
    code: 'ROLE_SUPER_ADMIN',
    type: 'system',
    description: '平台最高权限掌控者，拥有全平台任务、资产、算力资源、计费与组织的完全管理权限',
    userCount: 2,
    permissions: [...ALL_PERMISSION_KEYS], // 全部权限
    assignedTenants: ['全部租户 (Global)'],
    assignedUsers: ['admin', 'fandejun']
  },
  {
    id: 'tenant_admin',
    name: '租户管理员',
    code: 'ROLE_TENANT_ADMIN',
    type: 'system',
    description: '负责本租户内的算法项目管理、用户账号授权、配额监控及所属账单核对',
    userCount: 5,
    permissions: [
      'task:view', 'task:create', 'task:control', 'task:delete',
      'asset:model:manage', 'asset:dataset:manage', 'asset:image:manage', 'asset:apikey:manage',
      'resource:node:view',
      'billing:overview:view',
      'org:user:manage', 'org:audit:view'
    ],
    assignedTenants: ['bob-0728', 'alice-0728', 'test', 'liuzhao'],
    assignedUsers: ['bob-0728', 'alice-0728', 'test-1', 'test', 'liuzhao']
  },
  {
    id: 'algorithm_user',
    name: '算法用户',
    code: 'ROLE_ALGORITHM_USER',
    type: 'system',
    description: '专注大模型研发的算法工程师，具备算力任务提交运行、资产读写与专属开发机使用权限',
    userCount: 1,
    permissions: [
      'task:view', 'task:create', 'task:control',
      'asset:model:manage', 'asset:dataset:manage', 'asset:image:manage', 'asset:apikey:manage',
      'resource:node:view',
      'billing:overview:view'
    ],
    assignedTenants: ['test'],
    assignedUsers: ['fandejun']
  }
];

export const RolesAndPermissionsView: React.FC = () => {
  // 引导卡片展示/隐藏状态
  const [showGuide, setShowGuide] = useState<boolean>(true);

  // 角色列表状态与筛选
  const [roles, setRoles] = useState<RolePermissionConfig[]>(DEFAULT_ROLES);
  const [activeRoleId, setActiveRoleId] = useState<string>('super_admin');
  const [roleTypeFilter, setRoleTypeFilter] = useState<'all' | 'system' | 'custom'>('all');
  const [roleSearchTerm, setRoleSearchTerm] = useState('');

  // 第二部分步骤 Tab：'role' | 'permission' | 'binding'
  const [activeStepTab, setActiveStepTab] = useState<'role' | 'permission' | 'binding'>('role');

  // 穿梭框搜索关键字与勾选暂存状态 (选待移入/选待移出)
  const [sourceSearchTerm, setSourceSearchTerm] = useState('');
  const [targetSearchTerm, setTargetSearchTerm] = useState('');
  const [checkedSourceKeys, setCheckedSourceKeys] = useState<string[]>([]); // 格式: 'tenant:<name>' 或 'user:<tenant>:<username>'
  const [checkedTargetKeys, setCheckedTargetKeys] = useState<string[]>([]);

  // 角色变更审计日志
  const [roleLogs, setRoleLogs] = useState<RoleChangeLog[]>(INITIAL_ROLE_LOGS);
  // 查看变更日志弹窗的角色 ID (null 表示弹窗关闭)
  const [logModalRoleId, setLogModalRoleId] = useState<string | null>(null);
  // 变更日志弹窗内的筛选条件
  const [logFilterType, setLogFilterType] = useState<'all' | 'binding_update' | 'permission_update' | 'create' | 'basic_update'>('all');
  const [logSearchQuery, setLogSearchQuery] = useState('');

  // 当前选中编辑/查看的角色
  const activeRole = roles.find(r => r.id === activeRoleId) || roles[0];

  // 临时新建角色弹窗 / 编辑态状态（用于交互）
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  // 保存/确认关联状态与反馈提示
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // 确认关联提交处理：保存后自动跳转到「角色定义」Tab，且当前角色保持选中高亮状态
  const handleConfirmBinding = () => {
    setIsSaving(true);
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    // 同步更新角色绑定的实际用户数
    const updatedUserCount = activeRole.assignedUsers.length;
    setRoles(roles.map(r => (r.id === activeRole.id ? { ...r, userCount: updatedUserCount } : r)));

    // 新增变更审计日志记录
    const newLog: RoleChangeLog = {
      id: `log_${Date.now()}`,
      roleId: activeRole.id,
      timestamp: timeStr,
      operator: 'admin (当前平台管理员)',
      actionType: 'binding_update',
      actionTitle: '关联租户与用户变更',
      description: `完成租户与用户关联配置生效确认：当前绑定 ${activeRole.assignedTenants.length} 个租户，${activeRole.assignedUsers.length} 位用户。`,
      diffSummary: {
        type: '生效关联清单',
        items: [
          {
            label: `生效租户 (${activeRole.assignedTenants.length})`,
            value: activeRole.assignedTenants.length > 0 ? activeRole.assignedTenants.join(', ') : '暂无',
            type: 'added'
          },
          {
            label: `授权用户 (${activeRole.assignedUsers.length})`,
            value: activeRole.assignedUsers.length > 0 ? activeRole.assignedUsers.join(', ') : '暂无',
            type: 'added'
          }
        ]
      }
    };
    setRoleLogs(prev => [newLog, ...prev]);

    setTimeout(() => {
      setIsSaving(false);
      // 1. 直接跳转到「角色定义」Step Tab
      setActiveStepTab('role');
      // 2. 确保刚刚关联/配置的角色处于选中状态
      setActiveRoleId(activeRole.id);
      // 3. 设置成功反馈提示
      setSaveToast(`已成功确认并保存「${activeRole.name}」的关联配置！共绑定 ${activeRole.assignedTenants.length} 个租户、${activeRole.assignedUsers.length} 位用户。已切换至角色定义视图，当前角色处于选中状态。`);
      setTimeout(() => {
        setSaveToast(null);
      }, 5000);
    }, 350);
  };

  // 切换单个权限勾选状态
  const togglePermission = (permKey: string) => {
    const exists = activeRole.permissions.includes(permKey);
    const updated = exists
      ? activeRole.permissions.filter(k => k !== permKey)
      : [...activeRole.permissions, permKey];

    setRoles(roles.map(r => (r.id === activeRole.id ? { ...r, permissions: updated } : r)));
  };

  // 切换整组权限全选
  const toggleCategoryAll = (category: PermissionCategory) => {
    const catKeys = category.items.map(i => i.key);
    const allSelected = catKeys.every(k => activeRole.permissions.includes(k));

    let updated: string[];
    if (allSelected) {
      // 取消该类别全部
      updated = activeRole.permissions.filter(k => !catKeys.includes(k));
    } else {
      // 补充缺失权限
      const missing = catKeys.filter(k => !activeRole.permissions.includes(k));
      updated = [...activeRole.permissions, ...missing];
    }
    setRoles(roles.map(r => (r.id === activeRole.id ? { ...r, permissions: updated } : r)));
  };

  // 穿梭框交互：将左侧选中的条目穿梭到右侧（授权）
  const handleTransferToTarget = () => {
    if (checkedSourceKeys.length === 0) return;

    let updatedTenants = [...activeRole.assignedTenants];
    let updatedUsers = [...activeRole.assignedUsers];

    checkedSourceKeys.forEach(key => {
      if (key.startsWith('tenant:')) {
        const tenant = key.replace('tenant:', '');
        if (!updatedTenants.includes(tenant)) {
          updatedTenants.push(tenant);
        }
      } else if (key.startsWith('user:')) {
        const parts = key.split(':');
        const username = parts[2];
        const tenant = parts[1];
        if (!updatedUsers.includes(username)) {
          updatedUsers.push(username);
        }
        if (!updatedTenants.includes(tenant)) {
          updatedTenants.push(tenant);
        }
      }
    });

    setRoles(roles.map(r => r.id === activeRole.id ? {
      ...r,
      assignedTenants: updatedTenants,
      assignedUsers: updatedUsers,
      userCount: updatedUsers.length
    } : r));

    setCheckedSourceKeys([]);
  };

  // 穿梭框交互：将右侧选中的条目移出（取消授权）
  const handleTransferToSource = () => {
    if (checkedTargetKeys.length === 0) return;

    let updatedTenants = [...activeRole.assignedTenants];
    let updatedUsers = [...activeRole.assignedUsers];

    checkedTargetKeys.forEach(key => {
      if (key.startsWith('target_tenant:')) {
        const tenant = key.replace('target_tenant:', '');
        updatedTenants = updatedTenants.filter(t => t !== tenant);
      } else if (key.startsWith('target_user:')) {
        const username = key.replace('target_user:', '');
        updatedUsers = updatedUsers.filter(u => u !== username);
      }
    });

    setRoles(roles.map(r => r.id === activeRole.id ? {
      ...r,
      assignedTenants: updatedTenants,
      assignedUsers: updatedUsers,
      userCount: updatedUsers.length
    } : r));

    setCheckedTargetKeys([]);
  };

  // 快捷移除单个右侧对象
  const handleRemoveSingleTarget = (type: 'tenant' | 'user', value: string) => {
    if (type === 'tenant') {
      const updatedTenants = activeRole.assignedTenants.filter(t => t !== value);
      setRoles(roles.map(r => r.id === activeRole.id ? { ...r, assignedTenants: updatedTenants } : r));
    } else {
      const updatedUsers = activeRole.assignedUsers.filter(u => u !== value);
      setRoles(roles.map(r => r.id === activeRole.id ? { ...r, assignedUsers: updatedUsers, userCount: updatedUsers.length } : r));
    }
  };

  // 过滤左侧租户与用户
  const filteredSourceGroups = ALL_TENANTS_AND_USERS.map(group => {
    const matchTenant = group.tenantName.toLowerCase().includes(sourceSearchTerm.toLowerCase());
    const matchedUsers = group.users.filter(u => 
      u.username.toLowerCase().includes(sourceSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(sourceSearchTerm.toLowerCase())
    );

    if (sourceSearchTerm && !matchTenant && matchedUsers.length === 0) {
      return null;
    }

    return {
      ...group,
      users: sourceSearchTerm && !matchTenant ? matchedUsers : group.users
    };
  }).filter(Boolean) as TenantGroup[];

  // 过滤右侧已选租户与用户
  const filteredTargetTenants = activeRole.assignedTenants.filter(t => 
    t.toLowerCase().includes(targetSearchTerm.toLowerCase())
  );
  const filteredTargetUsers = activeRole.assignedUsers.filter(u =>
    u.toLowerCase().includes(targetSearchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. 第一部分：配置引导图 (高度紧凑，序号与标题同行，可展开/可收起) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all">
        <div className="flex items-center justify-between px-5 py-2.5 bg-gradient-to-r from-blue-50/70 via-slate-50/50 to-indigo-50/40 border-b border-slate-200/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center shadow-2xs">
              <Sparkles className="w-3 h-3" />
            </div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-slate-800">
                配置引导：如何定义角色与关联权限
              </h3>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                · 三步快速搭建租户安全隔离体系
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 cursor-pointer px-2.5 py-1 rounded bg-white/80 border border-slate-200/60 shadow-2xs hover:bg-white transition-colors"
          >
            {showGuide ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>隐藏引导</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>展开引导</span>
              </>
            )}
          </button>
        </div>

        {showGuide && (
          <div className="p-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* 步骤 1 */}
              <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold font-mono flex items-center justify-center shrink-0">
                      1
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">角色定义</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed pl-7">
                    创建或选择对应职务的角色主体，设定角色标识与基础职责描述。
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-blue-100/80 text-[10px] text-slate-400 flex items-center space-x-1 pl-7">
                  <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
                  <span>支持使用预置或自定义角色</span>
                </div>
              </div>

              {/* 步骤 2 */}
              <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold font-mono flex items-center justify-center shrink-0">
                      2
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">权限选择</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed pl-7">
                    在 5 大功能模块（任务、资产、资源、计费、组织）中细粒度勾选可执行动作。
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-indigo-100/80 text-[10px] text-slate-400 flex items-center space-x-1 pl-7">
                  <CheckCircle2 className="w-3 h-3 text-indigo-500 shrink-0" />
                  <span>20 项细粒度策略高亮配置</span>
                </div>
              </div>

              {/* 步骤 3 */}
              <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold font-mono flex items-center justify-center shrink-0">
                      3
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">关联租户/用户</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed pl-7">
                    将配置好的角色权限矩阵绑定至指定租户或具体成员账号，即刻生效。
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-emerald-100/80 text-[10px] text-slate-400 flex items-center space-x-1 pl-7">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>实时生效 · 多租户安全隔离</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. 第二部分：定义角色 / 权限选择 / 关联租户与用户 联动工作台 */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* 工作台顶部 Step TAB 导航 */}
        <div className="flex items-center justify-between px-6 border-b border-slate-200/90 bg-slate-50/60">
          <div className="flex space-x-8 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveStepTab('role')}
              className={`py-3.5 flex items-center space-x-2 border-b-2 cursor-pointer transition-colors ${
                activeStepTab === 'role'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-mono">
                1
              </span>
              <span>定义角色</span>
              <span className="text-[10px] text-slate-400 font-mono">({roles.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStepTab('permission')}
              className={`py-3.5 flex items-center space-x-2 border-b-2 cursor-pointer transition-colors ${
                activeStepTab === 'permission'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-mono">
                2
              </span>
              <span>权限选择</span>
              <span className="text-[10px] text-emerald-600 font-mono bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                {activeRole.permissions.length}/20项已选
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStepTab('binding')}
              className={`py-3.5 flex items-center space-x-2 border-b-2 cursor-pointer transition-colors ${
                activeStepTab === 'binding'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-mono">
                3
              </span>
              <span>关联租户 / 用户</span>
              <span className="text-[10px] text-slate-400 font-mono">({activeRole.userCount}人关联)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">当前操作角色:</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
              {activeRole.name}
            </span>
          </div>
        </div>

        {/* 2.1 子视图 1：定义角色 */}
        {activeStepTab === 'role' && (
          <div className="p-6 space-y-6">
            {/* 保存/关联成功反馈提示横幅 */}
            {saveToast && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between animate-in fade-in duration-200 shadow-2xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs font-medium">{saveToast}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSaveToast(null)}
                  className="text-xs text-emerald-600 hover:text-emerald-800 font-medium cursor-pointer"
                >
                  ✕ 关闭
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <span>平台角色列表</span>
                  <span className="text-xs font-normal text-slate-400 font-mono">({roles.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  支持快速区分「系统预置」与「用户自定义」角色，点击卡片即可切换配置上下文或查看审计日志
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditingCustom(true)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新建自定义角色</span>
                </button>
              </div>
            </div>

            {/* 角色类型快速筛选栏 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/80">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setRoleTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    roleTypeFilter === 'all'
                      ? 'bg-white text-slate-800 shadow-2xs border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                  }`}
                >
                  <span>全部角色</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-medium">
                    {roles.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRoleTypeFilter('system')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    roleTypeFilter === 'system'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-blue-700 hover:bg-blue-50 bg-blue-50/50 border border-blue-200/60'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>系统预置</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    roleTypeFilter === 'system' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {roles.filter(r => r.type === 'system').length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRoleTypeFilter('custom')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    roleTypeFilter === 'custom'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-indigo-700 hover:bg-indigo-50 bg-indigo-50/50 border border-indigo-200/60'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>用户自定义</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    roleTypeFilter === 'custom' ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {roles.filter(r => r.type === 'custom').length}
                  </span>
                </button>
              </div>

              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={roleSearchTerm}
                  onChange={(e) => setRoleSearchTerm(e.target.value)}
                  placeholder="搜索角色名称/代码..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 角色卡片列表 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles
                .filter(role => {
                  const matchType = roleTypeFilter === 'all' || role.type === roleTypeFilter;
                  const matchSearch = !roleSearchTerm || 
                    role.name.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
                    role.code.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
                    role.description.toLowerCase().includes(roleSearchTerm.toLowerCase());
                  return matchType && matchSearch;
                })
                .map((role) => {
                const isSelected = role.id === activeRoleId;
                const roleLogCount = roleLogs.filter(l => l.roleId === role.id).length;

                return (
                  <div
                    key={role.id}
                    onClick={() => setActiveRoleId(role.id)}
                    className={`p-5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/25 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            role.id === 'super_admin'
                              ? 'bg-rose-50 text-rose-600'
                              : role.id === 'tenant_admin'
                              ? 'bg-blue-50 text-blue-600'
                              : role.type === 'custom'
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            <Shield className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                              <span>{role.name}</span>
                              {role.type === 'system' ? (
                                <span className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
                                  <ShieldCheck className="w-3 h-3 text-blue-600 shrink-0" />
                                  <span>系统预置</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
                                  <SlidersHorizontal className="w-3 h-3 text-indigo-600 shrink-0" />
                                  <span>用户自定义</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 mt-0.5">{role.code}</div>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-2xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 hover:text-blue-600">
                            点击选中
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                        {role.description}
                      </p>

                      {/* 统计指标 */}
                      <div className="py-2 px-2.5 rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-between text-[11px] text-slate-500 mb-3">
                        <span>已赋权: <strong className="font-mono text-blue-600 font-semibold">{role.permissions.length}</strong> 项</span>
                        <span>关联租户: <strong className="font-mono text-indigo-600 font-semibold">{role.assignedTenants.length}</strong> 个</span>
                        <span>关联人员: <strong className="font-mono text-emerald-600 font-semibold">{role.assignedUsers.length}</strong> 人</span>
                      </div>
                    </div>

                    {/* 卡片底部操作栏 */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      {/* 查看当前角色变更日志 */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogModalRoleId(role.id);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100/80 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                        title="查看当前角色的变更记录与审计轨迹"
                      >
                        <History className="w-3.5 h-3.5 text-slate-500" />
                        <span>变更日志</span>
                        <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-white text-slate-500 border border-slate-200/80">
                          {roleLogCount}
                        </span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveRoleId(role.id);
                            setActiveStepTab('binding');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100/70 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>关联</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveRoleId(role.id);
                            setActiveStepTab('permission');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center space-x-0.5 transition-colors shadow-2xs cursor-pointer"
                        >
                          <span>配置权限</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 新建角色弹窗模拟 */}
            {isEditingCustom && (
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-blue-900">快速创建自定义角色</h4>
                  <button
                    type="button"
                    onClick={() => setIsEditingCustom(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕ 取消
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="请输入角色名称（如：只读审计员）"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input
                    type="text"
                    placeholder="角色职责说明..."
                    value={newRoleDesc}
                    onChange={(e) => setNewRoleDesc(e.target.value)}
                    className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingCustom(false)}
                    className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded text-xs hover:bg-slate-50"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newRoleName) return;
                      const newRole: RolePermissionConfig = {
                        id: `custom_${Date.now()}`,
                        name: newRoleName,
                        code: `ROLE_${newRoleName.toUpperCase().replace(/\s+/g, '_')}`,
                        type: 'custom',
                        description: newRoleDesc || '自定义业务角色',
                        userCount: 0,
                        permissions: ['task:view', 'asset:model:manage', 'billing:overview:view'],
                        assignedTenants: ['test'],
                        assignedUsers: []
                      };
                      const now = new Date();
                      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
                      const createLog: RoleChangeLog = {
                        id: `log_${Date.now()}`,
                        roleId: newRole.id,
                        timestamp: timeStr,
                        operator: 'admin (当前平台管理员)',
                        actionType: 'create',
                        actionTitle: '创建自定义角色',
                        description: `成功创建自定义角色「${newRoleName}」，初始预分配 3 项常用基础权限及租户 test。`,
                        diffSummary: {
                          type: '初始属性',
                          items: [
                            { label: '角色代码', value: newRole.code, type: 'neutral' },
                            { label: '初始权限', value: '3 项基础权限', type: 'added' },
                            { label: '初始租户', value: 'test', type: 'added' }
                          ]
                        }
                      };
                      setRoles([...roles, newRole]);
                      setRoleLogs(prev => [createLog, ...prev]);
                      setActiveRoleId(newRole.id);
                      setNewRoleName('');
                      setNewRoleDesc('');
                      setIsEditingCustom(false);
                    }}
                    className="px-3.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
                  >
                    保存并前往权限选择
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2.2 子视图 2：权限选择 (包含 5 大类：任务权限、资产权限、资源权限、计费权限、组织权限 - 优化柔和高亮风格) */}
        {activeStepTab === 'permission' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    权限选择矩阵 — 针对「{activeRole.name}」
                  </h3>
                  {activeRole.id === 'super_admin' && (
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 font-medium">
                      默认预选全量 20 项权限，可自由点击调整
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  包含了 5 大部分：任务权限、资产权限、资源权限、计费权限、组织权限，可按模块全选或单选配置
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setRoles(roles.map(r => r.id === activeRole.id ? { ...r, permissions: [...ALL_PERMISSION_KEYS] } : r));
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  全选所有权限
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRoles(roles.map(r => r.id === activeRole.id ? { ...r, permissions: [] } : r));
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  清空选择
                </button>
              </div>
            </div>

            {/* 5 大权限分类展示列表 */}
            <div className="space-y-4">
              {PERMISSION_CATEGORIES.map((category) => {
                const catKeys = category.items.map(i => i.key);
                const selectedCount = catKeys.filter(k => activeRole.permissions.includes(k)).length;
                const isAllSelected = selectedCount === catKeys.length;

                return (
                  <div
                    key={category.key}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs"
                  >
                    {/* 权限类别 Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 border-b border-slate-200/80">
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1 rounded bg-white border border-slate-200 shadow-2xs">
                          {category.icon}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900">{category.label}</span>
                          <span className="text-[11px] text-slate-400 ml-2 hidden sm:inline">
                            {category.description}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-mono text-slate-500">
                          {selectedCount}/{catKeys.length} 已选
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCategoryAll(category)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                        >
                          {isAllSelected ? '取消全选' : '类别全选'}
                        </button>
                      </div>
                    </div>

                    {/* 权限项明细 Grid (低饱和柔和高亮：天蓝浅底 + 柔和深蓝文字与边框) */}
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {category.items.map((item) => {
                        const isChecked = activeRole.permissions.includes(item.key);
                        return (
                          <div
                            key={item.key}
                            onClick={() => togglePermission(item.key)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 select-none relative overflow-hidden ${
                              isChecked
                                ? 'border-blue-300 bg-blue-50/70 text-slate-800 shadow-xs ring-1 ring-blue-400/40 hover:bg-blue-50/90'
                                : 'border-slate-200/80 bg-slate-50/30 hover:bg-white hover:border-slate-300 text-slate-700 hover:shadow-2xs'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isChecked ? (
                                <div className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded border border-slate-300 bg-white" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className={`text-xs font-bold leading-tight ${
                                  isChecked ? 'text-blue-950' : 'text-slate-800'
                                }`}>
                                  {item.label}
                                </div>
                              </div>
                              <div className={`text-[11px] leading-relaxed line-clamp-2 ${
                                isChecked ? 'text-slate-600' : 'text-slate-400'
                              }`}>
                                {item.description}
                              </div>
                              <div className={`text-[10px] font-mono pt-0.5 ${
                                isChecked ? 'text-blue-600 font-medium' : 'text-slate-400'
                              }`}>
                                {item.key}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 底部保存提示 */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                <span>修改权限后，绑定该角色的所有租户账号将在下一次操作或刷新时即刻生效。</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveStepTab('binding')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs cursor-pointer flex items-center space-x-1"
              >
                <span>进入下一步：关联租户/用户</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 2.3 子视图 3：关联租户 / 用户 (经典穿梭框 Transfer Box 样式) */}
        {activeStepTab === 'binding' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  主体授权绑定 — 针对「{activeRole.name}」
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  使用穿梭框在左侧勾选待授权的租户或租户下属用户，点击穿梭按钮即可将其加入右侧生效列表
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500">
                  已生效关联: <strong className="font-mono text-blue-600">{activeRole.assignedTenants.length}</strong> 个租户 / <strong className="font-mono text-indigo-600">{activeRole.assignedUsers.length}</strong> 位用户
                </span>
              </div>
            </div>

            {/* 经典穿梭框 (Transfer Box) */}
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
              {/* 左侧面板：租户与下属用户源列表 (5 列) */}
              <div className="lg:col-span-5 border border-slate-200 rounded-xl bg-white shadow-2xs flex flex-col h-[520px] overflow-hidden">
                {/* 左侧头部 */}
                <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">可授权租户及下属用户</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    已勾选 {checkedSourceKeys.length} 项
                  </span>
                </div>

                {/* 搜索过滤栏 */}
                <div className="p-3 border-b border-slate-100 bg-white">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="搜索租户名、账号或邮箱..."
                      value={sourceSearchTerm}
                      onChange={(e) => setSourceSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
                    />
                    {sourceSearchTerm && (
                      <button
                        type="button"
                        onClick={() => setSourceSearchTerm('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 树形列表内容区 */}
                <div className="p-3 overflow-y-auto flex-1 space-y-3 divide-y divide-slate-100">
                  {filteredSourceGroups.length === 0 ? (
                    <div className="text-center py-16 text-xs text-slate-400">
                      未检索到匹配的租户或用户
                    </div>
                  ) : (
                    filteredSourceGroups.map((group) => {
                      const tenantKey = `tenant:${group.tenantName}`;
                      const isTenantChecked = checkedSourceKeys.includes(tenantKey);
                      const isTenantAlreadyAssigned = activeRole.assignedTenants.includes(group.tenantName);

                      return (
                        <div key={group.tenantName} className="pt-2 first:pt-0 space-y-1.5">
                          {/* 租户行 */}
                          <div
                            onClick={() => {
                              if (isTenantChecked) {
                                setCheckedSourceKeys(checkedSourceKeys.filter(k => k !== tenantKey));
                              } else {
                                setCheckedSourceKeys([...checkedSourceKeys, tenantKey]);
                              }
                            }}
                            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                              isTenantChecked
                                ? 'border-blue-300 bg-blue-50/60'
                                : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <div className="text-blue-600">
                                {isTenantChecked ? (
                                  <CheckSquare className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </div>
                              <Building className="w-3.5 h-3.5 text-slate-500" />
                              <span className="font-semibold text-slate-800">{group.tenantName}</span>
                              <span className="text-[10px] font-mono text-slate-400">({group.users.length}人)</span>
                            </div>

                            {isTenantAlreadyAssigned && (
                              <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 font-medium">
                                已在右侧
                              </span>
                            )}
                          </div>

                          {/* 租户下属用户列表 */}
                          <div className="pl-6 space-y-1">
                            {group.users.map((user) => {
                              const userKey = `user:${group.tenantName}:${user.username}`;
                              const isUserChecked = checkedSourceKeys.includes(userKey);
                              const isUserAlreadyAssigned = activeRole.assignedUsers.includes(user.username);

                              return (
                                <div
                                  key={user.username}
                                  onClick={() => {
                                    if (isUserChecked) {
                                      setCheckedSourceKeys(checkedSourceKeys.filter(k => k !== userKey));
                                    } else {
                                      setCheckedSourceKeys([...checkedSourceKeys, userKey]);
                                    }
                                  }}
                                  className={`p-1.5 rounded-md border transition-all cursor-pointer flex items-center justify-between text-xs ${
                                    isUserChecked
                                      ? 'border-indigo-300 bg-indigo-50/60'
                                      : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="text-indigo-600">
                                      {isUserChecked ? (
                                        <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                                      ) : (
                                        <Square className="w-3.5 h-3.5 text-slate-300" />
                                      )}
                                    </div>
                                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-mono text-[10px]">
                                      {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <span className="text-slate-800 font-mono">{user.username}</span>
                                      <span className="text-[10px] text-slate-400 ml-1.5">{user.email}</span>
                                    </div>
                                  </div>

                                  {isUserAlreadyAssigned && (
                                    <span className="text-[10px] text-emerald-600 font-mono">
                                      已授权
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 中间穿梭操作按钮区 (1 列) */}
              <div className="lg:col-span-1 flex flex-row lg:flex-col items-center justify-center gap-3 py-2">
                <button
                  type="button"
                  disabled={checkedSourceKeys.length === 0}
                  onClick={handleTransferToTarget}
                  className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-xl text-xs font-medium transition-all shadow-2xs flex items-center justify-center space-x-1 cursor-pointer disabled:cursor-not-allowed"
                  title="授权选中的租户/用户到右侧"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span className="lg:hidden text-xs">加入右侧</span>
                </button>

                <button
                  type="button"
                  disabled={checkedTargetKeys.length === 0}
                  onClick={handleTransferToSource}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium transition-all shadow-2xs flex items-center justify-center space-x-1 cursor-pointer disabled:cursor-not-allowed"
                  title="从右侧移除选中的对象"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="lg:hidden text-xs">移出右侧</span>
                </button>
              </div>

              {/* 右侧面板：已选定的授权对象 (5 列) */}
              <div className="lg:col-span-5 border border-slate-200 rounded-xl bg-white shadow-2xs flex flex-col h-[520px] overflow-hidden">
                {/* 右侧头部 */}
                <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">已选定的授权对象</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
                    <span>{filteredTargetTenants.length} 租户</span>
                    <span>·</span>
                    <span>{filteredTargetUsers.length} 用户</span>
                  </div>
                </div>

                {/* 搜索过滤栏 */}
                <div className="p-3 border-b border-slate-100 bg-white">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="在已选对象中过滤..."
                      value={targetSearchTerm}
                      onChange={(e) => setTargetSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
                    />
                    {targetSearchTerm && (
                      <button
                        type="button"
                        onClick={() => setTargetSearchTerm('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 已选对象内容区 */}
                <div className="p-3 overflow-y-auto flex-1 space-y-3">
                  {/* 已授权租户模块 */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                      已关联租户 ({filteredTargetTenants.length})
                    </div>
                    {filteredTargetTenants.length === 0 ? (
                      <div className="text-xs text-slate-400 p-2 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 text-center">
                        暂无关联租户
                      </div>
                    ) : (
                      filteredTargetTenants.map((tenant) => {
                        const targetKey = `target_tenant:${tenant}`;
                        const isChecked = checkedTargetKeys.includes(targetKey);

                        return (
                          <div
                            key={tenant}
                            onClick={() => {
                              if (isChecked) {
                                setCheckedTargetKeys(checkedTargetKeys.filter(k => k !== targetKey));
                              } else {
                                setCheckedTargetKeys([...checkedTargetKeys, targetKey]);
                              }
                            }}
                            className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                              isChecked
                                ? 'border-rose-300 bg-rose-50/50'
                                : 'border-slate-200/80 bg-white hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <div className="text-rose-600">
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 text-rose-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </div>
                              <Building className="w-3.5 h-3.5 text-blue-600" />
                              <span className="font-semibold text-slate-800">{tenant}</span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSingleTarget('tenant', tenant);
                              }}
                              className="text-slate-300 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                              title="移除此租户"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* 已授权用户模块 */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                      已绑定用户账号 ({filteredTargetUsers.length})
                    </div>
                    {filteredTargetUsers.length === 0 ? (
                      <div className="text-xs text-slate-400 p-2 bg-slate-50/50 rounded-lg border border-dashed border-slate-200 text-center">
                        暂无绑定用户
                      </div>
                    ) : (
                      filteredTargetUsers.map((username) => {
                        const targetKey = `target_user:${username}`;
                        const isChecked = checkedTargetKeys.includes(targetKey);

                        return (
                          <div
                            key={username}
                            onClick={() => {
                              if (isChecked) {
                                setCheckedTargetKeys(checkedTargetKeys.filter(k => k !== targetKey));
                              } else {
                                setCheckedTargetKeys([...checkedTargetKeys, targetKey]);
                              }
                            }}
                            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                              isChecked
                                ? 'border-rose-300 bg-rose-50/50'
                                : 'border-slate-200/80 bg-white hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <div className="text-rose-600">
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 text-rose-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300" />
                                )}
                              </div>
                              <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-mono text-[10px] font-semibold">
                                {username.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-slate-800 font-mono">{username}</span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSingleTarget('user', username);
                              }}
                              className="text-slate-300 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                              title="移除此用户"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 成功保存提示条 */}
            {saveToast && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between animate-in fade-in duration-200 shadow-2xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs font-medium">{saveToast}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSaveToast(null)}
                  className="text-xs text-emerald-600 hover:text-emerald-800 font-medium cursor-pointer"
                >
                  ✕ 关闭
                </button>
              </div>
            )}

            {/* 底部操作与确认关联栏 */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>
                  当前关联将对 <strong className="text-blue-600 font-mono">{activeRole.assignedTenants.length}</strong> 个租户、
                  <strong className="text-indigo-600 font-mono">{activeRole.assignedUsers.length}</strong> 位用户即刻生效。
                </span>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStepTab('permission')}
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium transition-colors shadow-2xs flex items-center space-x-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>返回上一步</span>
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleConfirmBinding}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-xs font-bold transition-all shadow-xs hover:shadow flex items-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>正在保存关联...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>确认关联</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. 角色变更审计日志 Modal 弹窗 */}
      {logModalRoleId && (() => {
        const targetRole = roles.find(r => r.id === logModalRoleId) || activeRole;
        const allLogsForRole = roleLogs.filter(l => l.roleId === targetRole.id);
        const filteredLogs = allLogsForRole.filter(l => {
          const matchType = logFilterType === 'all' || l.actionType === logFilterType;
          const matchSearch = !logSearchQuery || 
            l.actionTitle.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
            l.description.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
            l.operator.toLowerCase().includes(logSearchQuery.toLowerCase());
          return matchType && matchSearch;
        });

        const bindingCount = allLogsForRole.filter(l => l.actionType === 'binding_update').length;
        const permCount = allLogsForRole.filter(l => l.actionType === 'permission_update').length;
        const createCount = allLogsForRole.filter(l => l.actionType === 'create').length;

        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => {
              setLogModalRoleId(null);
              setLogSearchQuery('');
              setLogFilterType('all');
            }}
          >
            <div 
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 弹窗头部 */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-2xs shrink-0">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-900">
                        角色变更日志 —「{targetRole.name}」
                      </h3>
                      {targetRole.type === 'system' ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>系统预置</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>用户自定义</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-2">
                      <span className="font-mono text-slate-400">{targetRole.code}</span>
                      <span>·</span>
                      <span>共记录 <strong className="text-blue-600 font-mono">{allLogsForRole.length}</strong> 次审计变更</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setLogModalRoleId(null);
                    setLogSearchQuery('');
                    setLogFilterType('all');
                  }}
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 角色当前生效概览条 */}
              <div className="px-5 py-3 bg-blue-50/40 border-b border-blue-100/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <div className="flex items-center space-x-4">
                  <span>当前生效权限: <strong className="font-mono text-blue-700">{targetRole.permissions.length}</strong> 项</span>
                  <span>关联租户: <strong className="font-mono text-indigo-700">{targetRole.assignedTenants.length}</strong> 个</span>
                  <span>关联用户: <strong className="font-mono text-emerald-700">{targetRole.assignedUsers.length}</strong> 人</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  最近变更: {allLogsForRole[0]?.timestamp || '无'}
                </div>
              </div>

              {/* 筛选与搜索工具条 */}
              <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                {/* 过滤 Tabs */}
                <div className="flex items-center space-x-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
                  <button
                    type="button"
                    onClick={() => setLogFilterType('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                      logFilterType === 'all'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    全部 ({allLogsForRole.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogFilterType('binding_update')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                      logFilterType === 'binding_update'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    关联主体 ({bindingCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogFilterType('permission_update')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                      logFilterType === 'permission_update'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    权限策略 ({permCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogFilterType('create')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                      logFilterType === 'create'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    创建/初始化 ({createCount})
                  </button>
                </div>

                {/* 搜索框 */}
                <div className="relative w-full sm:w-48 shrink-0">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={logSearchQuery}
                    onChange={(e) => setLogSearchQuery(e.target.value)}
                    placeholder="检索日志内容/操作人..."
                    className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* 日志时间轴内容区 */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                {filteredLogs.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-xs">未检索到匹配的变更日志记录</p>
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {filteredLogs.map((log) => {
                      const isCreate = log.actionType === 'create';
                      const isBinding = log.actionType === 'binding_update';
                      const isPerm = log.actionType === 'permission_update';

                      const dotColor = isCreate
                        ? 'bg-emerald-500 ring-4 ring-emerald-100'
                        : isBinding
                        ? 'bg-blue-500 ring-4 ring-blue-100'
                        : isPerm
                        ? 'bg-purple-500 ring-4 ring-purple-100'
                        : 'bg-amber-500 ring-4 ring-amber-100';

                      const typeBadge = isCreate
                        ? { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: '角色初始化' }
                        : isBinding
                        ? { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: '关联主体变更' }
                        : isPerm
                        ? { bg: 'bg-purple-50 text-purple-700 border-purple-200', text: '权限策略调整' }
                        : { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: '基础属性变更' };

                      return (
                        <div key={log.id} className="relative group">
                          {/* 时间轴左侧圆点 */}
                          <div className={`absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full ${dotColor} transition-transform group-hover:scale-125`} />

                          {/* 日志卡片 */}
                          <div className="p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs transition-all space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <div className="flex items-center space-x-2">
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${typeBadge.bg}`}>
                                  {typeBadge.text}
                                </span>
                                <h4 className="text-xs font-bold text-slate-900">{log.actionTitle}</h4>
                              </div>

                              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span className="font-mono">{log.timestamp}</span>
                                </span>
                                <span>·</span>
                                <span className="text-slate-600 font-medium">{log.operator}</span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                              {log.description}
                            </p>

                            {/* 变更明细差异框 */}
                            {log.diffSummary?.items && log.diffSummary.items.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-slate-100/90 bg-slate-50/60 p-2.5 rounded-lg space-y-1 text-xs">
                                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                  {log.diffSummary.type}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {log.diffSummary.items.map((item, idx) => (
                                    <div key={idx} className="flex items-start space-x-1.5 text-[11px]">
                                      <span className="text-slate-400 shrink-0">{item.label}:</span>
                                      <span className={`font-mono break-all font-medium ${
                                        item.type === 'added' ? 'text-emerald-700' : item.type === 'removed' ? 'text-rose-700' : 'text-slate-700'
                                      }`}>
                                        {item.value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 弹窗底部操作 */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>审计日志真实可溯，支持合规追溯与安全审计</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLogModalRoleId(null);
                    setLogSearchQuery('');
                    setLogFilterType('all');
                  }}
                  className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
