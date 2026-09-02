import React, { useState } from 'react';
import { RolesAndPermissionsView } from './RolesAndPermissionsView';
import {
  Search,
  Plus,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Shield,
  Users,
  Building2,
  KeyRound,
  Edit,
  Lock
} from 'lucide-react';

interface UserRecord {
  id: string;
  username: string;
  role: string;
  status: 'normal' | 'disabled';
  tenantName: string;
  tenantId: string;
  email: string;
  remark: string;
  createdAt: string;
}

const INITIAL_USERS_DATA: UserRecord[] = [
  {
    id: '1',
    username: 'fandejun',
    role: '算法用户',
    status: 'normal',
    tenantName: 'test',
    tenantId: 'g-019f7f54-e35f-77c5-8e76-9b43e7df1f0a',
    email: 'fan_de_jun@163.com',
    remark: '-',
    createdAt: '2026-07-31 15:44:54'
  },
  {
    id: '2',
    username: 'bob-0728',
    role: '租户管理员',
    status: 'normal',
    tenantName: 'bob-0728',
    tenantId: 'g-019fa90e-84a3-7873-9495-c775c06309d1',
    email: 'bob-0728@infrawaves.com',
    remark: '-',
    createdAt: '2026-07-28 22:08:48'
  },
  {
    id: '3',
    username: 'alice-0728',
    role: '租户管理员',
    status: 'normal',
    tenantName: 'alice-0728',
    tenantId: 'g-019fa90d-c24a-7287-84cf-b232bcd6df4c',
    email: 'alice-0728@infrawaves.com',
    remark: '-',
    createdAt: '2026-07-28 22:07:59'
  },
  {
    id: '4',
    username: 'test-1',
    role: '租户管理员',
    status: 'normal',
    tenantName: 'test',
    tenantId: 'g-019f7f54-e35f-77c5-8e76-9b43e7df1f0a',
    email: '1@11.com',
    remark: '-',
    createdAt: '2026-07-23 10:47:47'
  },
  {
    id: '5',
    username: 'test',
    role: '租户管理员',
    status: 'normal',
    tenantName: 'test',
    tenantId: 'g-019f7f54-e35f-77c5-8e76-9b43e7df1f0a',
    email: 'test@123.com',
    remark: '-',
    createdAt: '2026-07-20 19:41:37'
  },
  {
    id: '6',
    username: 'liuzhao',
    role: '租户管理员',
    status: 'normal',
    tenantName: 'liuzhao',
    tenantId: 'g-019f7e52-1dfb-7380-827b-54f025a3df1d',
    email: '12@qq.com',
    remark: '-',
    createdAt: '2026-07-20 14:58:58'
  }
];

export const OrganizationManagementView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tenant' | 'user' | 'permission'>('user');
  const [selectedTenant, setSelectedTenant] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = INITIAL_USERS_DATA.filter((user) => {
    const matchTenant = selectedTenant ? user.tenantName === selectedTenant : true;
    const matchSearch = userSearchTerm
      ? user.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.tenantName.toLowerCase().includes(userSearchTerm.toLowerCase())
      : true;
    return matchTenant && matchSearch;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter((item) => item !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 顶部 Tab 栏 */}
      <div className="border-b border-slate-200 bg-white px-6 pt-3 rounded-t-xl">
        <div className="flex space-x-8 text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('tenant')}
            className={`pb-3 font-medium transition-colors border-b-2 cursor-pointer ${
              activeTab === 'tenant'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            租户管理
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('user')}
            className={`pb-3 font-medium transition-colors border-b-2 cursor-pointer ${
              activeTab === 'user'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            用户管理
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('permission')}
            className={`pb-3 font-medium transition-colors border-b-2 cursor-pointer ${
              activeTab === 'permission'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            角色与权限
          </button>
        </div>
      </div>

      {/* Tab 1: 租户管理 */}
      {activeTab === 'tenant' && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">租户管理</h3>
              <p className="text-xs text-slate-400 mt-1">管理组织下属各研发部门、项目组的租户配置与资源隔离配额</p>
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新建租户</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'LLM 大模型算法组', id: 'g-019f7f54-e35f-77c5-8e76-9b43e7df1f0a', users: 5, gpus: 16 },
              { name: '搜索推荐算法团队', id: 'g-019fa90e-84a3-7873-9495-c775c06309d1', users: 3, gpus: 8 },
              { name: '计算机视觉研发部', id: 'g-019fa90d-c24a-7287-84cf-b232bcd6df4c', users: 2, gpus: 4 },
              { name: '自动驾驶感知组', id: 'g-019f7e52-1dfb-7380-827b-54f025a3df1d', users: 2, gpus: 4 },
            ].map((t) => (
              <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                </div>
                <div className="text-[11px] font-mono text-slate-400 truncate">ID: {t.id}</div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 text-slate-600">
                  <span>成员: {t.users} 人</span>
                  <span className="font-mono font-medium text-blue-600">配额: {t.gpus} 卡</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: 用户管理 (完美还原截图) */}
      {activeTab === 'user' && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">用户管理</h3>

            {/* 右侧筛选与操作栏 */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* 请选择租户下拉框 */}
              <div className="relative">
                <select
                  value={selectedTenant}
                  onChange={(e) => setSelectedTenant(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs rounded-md pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[140px] cursor-pointer"
                >
                  <option value="">请选择租户</option>
                  <option value="test">test</option>
                  <option value="bob-0728">bob-0728</option>
                  <option value="alice-0728">alice-0728</option>
                  <option value="liuzhao">liuzhao</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 请输入用户搜索框 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="请输入用户"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-800 text-xs rounded-md pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-44 placeholder-slate-400"
                />
                {userSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setUserSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* 添加用户按钮 */}
              <button
                type="button"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors shadow-2xs cursor-pointer flex items-center space-x-1"
              >
                <span>添加用户</span>
              </button>

              {/* 批量删除按钮 */}
              <button
                type="button"
                disabled={selectedUserIds.length === 0}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1 ${
                  selectedUserIds.length > 0
                    ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 border border-slate-200/60 cursor-not-allowed'
                }`}
              >
                <span>批量删除</span>
              </button>
            </div>
          </div>

          {/* 表格区 */}
          <div className="overflow-x-auto border-t border-slate-100 mt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-medium">
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3 font-medium">用户</th>
                  <th className="py-3 px-3 font-medium">
                    <div className="flex items-center space-x-1">
                      <span>角色</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-medium">
                    <div className="flex items-center space-x-1">
                      <span>状态</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-medium">租户/ID</th>
                  <th className="py-3 px-3 font-medium">邮箱</th>
                  <th className="py-3 px-3 font-medium">备注</th>
                  <th className="py-3 px-3 font-medium">
                    <div className="flex items-center space-x-1">
                      <span>创建时间</span>
                      <div className="flex flex-col">
                        <ChevronUp className="w-2.5 h-2.5 -mb-1 text-slate-400" />
                        <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                      </div>
                    </div>
                  </th>
                  <th className="py-3 px-3 font-medium text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-400">
                      未查询到符合条件的用户数据
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() => handleSelectOne(user.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900 font-mono">{user.username}</td>
                      <td className="py-3 px-3 text-slate-700">{user.role}</td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          正常
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-mono text-slate-800">{user.tenantName}</div>
                        <div className="font-mono text-[10px] text-slate-400 truncate max-w-[200px]">
                          {user.tenantId}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">{user.email}</td>
                      <td className="py-3 px-3 text-slate-400">{user.remark}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{user.createdAt}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center space-x-2.5">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                          >
                            编辑
                          </button>
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                          >
                            修改密码
                          </button>
                          <button
                            type="button"
                            className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 底部分页栏 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div className="text-[11px] text-slate-400">
              共 {filteredUsers.length} 条记录
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                className="w-6 h-6 rounded bg-blue-600 text-white font-medium flex items-center justify-center text-xs"
              >
                1
              </button>

              <button
                type="button"
                disabled
                className="p-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* 每页条数选择 */}
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700 focus:outline-none"
              >
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
                <option value={50}>50条/页</option>
              </select>

              {/* 前往页码 */}
              <div className="flex items-center space-x-1 text-xs text-slate-600">
                <span>前往</span>
                <input
                  type="text"
                  defaultValue="1"
                  className="w-8 h-6 text-center border border-slate-200 rounded text-xs focus:outline-none"
                />
                <span>页</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 权限与角色 */}
      {activeTab === 'permission' && (
        <RolesAndPermissionsView />
      )}
    </div>
  );
};
