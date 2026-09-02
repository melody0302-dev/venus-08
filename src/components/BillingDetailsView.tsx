import React, { useState } from 'react';
import {
  Users,
  AlertCircle,
  Clock,
  Search,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Wallet
} from 'lucide-react';

interface TenantBillingRecord {
  id: string;
  name: string;
  totalTasks: number;
  totalOccupied: number;
  totalSpent: number;
  rechargedAmount: number;
  currentBalance: number;
  activeRule: string;
}

const INITIAL_BILLING_DATA: TenantBillingRecord[] = [
  {
    id: '1',
    name: 'bob-0728',
    totalTasks: 0,
    totalOccupied: 0,
    totalSpent: 92290.47,
    rechargedAmount: 6000.00,
    currentBalance: -86290.47,
    activeRule: '—'
  },
  {
    id: '2',
    name: 'alice-0728',
    totalTasks: 0,
    totalOccupied: 0,
    totalSpent: 70984.72,
    rechargedAmount: 6000.00,
    currentBalance: -64984.72,
    activeRule: '—'
  },
  {
    id: '3',
    name: 'test',
    totalTasks: 0,
    totalOccupied: 0,
    totalSpent: 0.00,
    rechargedAmount: 0.00,
    currentBalance: 0.00,
    activeRule: '—'
  },
  {
    id: '4',
    name: 'liuzhao',
    totalTasks: 0,
    totalOccupied: 0,
    totalSpent: 0.00,
    rechargedAmount: 0.00,
    currentBalance: 0.00,
    activeRule: '—'
  }
];

export const BillingDetailsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilterTab, setActiveFilterTab] = useState<'total' | 'lowBalance' | 'pendingRenew'>('total');

  // Metrics calculation
  const totalRevenue = 164360.86; // 总收入
  const totalRecharge = 12000.00;  // 总充值金额 / 总金额
  const totalBalance = -152360.86; // 总余额 / 未使用
  const tenantCount = 4;           // 租户数量
  const lowBalanceCount = 4;       // 余额不足租户量
  const pendingRenewCount = 4;     // 待续费租户量

  const filteredData = INITIAL_BILLING_DATA.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatCurrency = (val: number, withColor = false) => {
    const formatted = val.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    if (val < 0) {
      return withColor ? <span className="text-rose-600 font-semibold font-mono">¥{formatted}</span> : `¥${formatted}`;
    }
    if (val > 0) {
      return withColor ? <span className="text-emerald-600 font-semibold font-mono">¥{formatted}</span> : `¥${formatted}`;
    }
    return withColor ? <span className="text-slate-600 font-mono">¥{formatted}</span> : `¥${formatted}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 顶部总指标卡片区：6 个紧凑卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. 总收入 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-slate-500 font-medium">总收入</span>
          </div>
          <div className="text-lg font-bold font-mono text-blue-600 truncate">
            ¥{totalRevenue.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* 2. 总充值金额 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-slate-500 font-medium">总充值金额</span>
          </div>
          <div className="text-lg font-bold font-mono text-slate-900 truncate">
            ¥{totalRecharge.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* 3. 总余额 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-slate-500 font-medium">总余额</span>
          </div>
          <div className="text-lg font-bold font-mono text-rose-600 truncate">
            ¥{totalBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* 4. 租户数量 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-slate-500 font-medium">租户数量</span>
          </div>
          <div className="text-lg font-bold font-mono text-slate-900">
            {tenantCount}
          </div>
        </div>

        {/* 5. 余额不足租户量 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-slate-500 font-medium">余额不足租户量</span>
          </div>
          <div className="text-lg font-bold font-mono text-rose-600">
            {lowBalanceCount}
          </div>
        </div>

        {/* 6. 待续费租户量 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-slate-500 font-medium">待续费租户量</span>
          </div>
          <div className="text-lg font-bold font-mono text-amber-600">
            {pendingRenewCount}
          </div>
        </div>
      </div>

      {/* 账单概览表格区域 */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">账单概览</h3>
          <span className="text-xs text-slate-400">共 {filteredData.length} 条租户账单记录</span>
        </div>

        {/* 筛选与搜索工具条 */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 租户名称输入 */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="租户名称"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder-slate-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* 时间范围选择 */}
          <div className="flex items-center space-x-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="开始时间"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-24 text-xs bg-transparent focus:outline-none placeholder-slate-400"
            />
            <span className="text-slate-400 px-1">至</span>
            <input
              type="text"
              placeholder="结束时间"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-24 text-xs bg-transparent focus:outline-none placeholder-slate-400"
            />
          </div>

          {/* 查询按钮 */}
          <button
            type="button"
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs flex items-center space-x-1 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>查询</span>
          </button>

          {/* 导出按钮 */}
          <button
            type="button"
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors shadow-2xs flex items-center space-x-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>导出</span>
          </button>
        </div>

        {/* 账单表格 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-y border-slate-200/80 text-slate-600 font-medium">
                <th className="py-3 px-4 font-semibold">租户名称</th>
                <th className="py-3 px-4 font-semibold">总任务数</th>
                <th className="py-3 px-4 font-semibold">总独占数</th>
                <th className="py-3 px-4 font-semibold">累计消费金额</th>
                <th className="py-3 px-4 font-semibold">实时充值金额</th>
                <th className="py-3 px-4 font-semibold">实时余额</th>
                <th className="py-3 px-4 font-semibold">生效规则</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    暂无匹配的租户账单数据
                  </td>
                </tr>
              ) : (
                filteredData.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900 font-mono">{record.name}</td>
                    <td className="py-3 px-4 font-mono">{record.totalTasks} 个</td>
                    <td className="py-3 px-4 font-mono">{record.totalOccupied} 个</td>
                    <td className="py-3 px-4 font-mono font-medium text-emerald-600">
                      ¥{record.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-emerald-600">
                      ¥{record.rechargedAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {record.currentBalance < 0 ? (
                        <span className="font-mono font-semibold text-rose-600">
                          ¥{record.currentBalance.toFixed(2)}
                        </span>
                      ) : (
                        <span className="font-mono font-semibold text-slate-700">
                          ¥{record.currentBalance.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{record.activeRule}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 底部分页栏 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="text-[11px] text-slate-400">
            显示第 1 至 {filteredData.length} 项，共 {filteredData.length} 项
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
    </div>
  );
};
