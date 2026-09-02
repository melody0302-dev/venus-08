import React, { useState, useMemo } from 'react';
import {
  Terminal,
  Network,
  Hourglass,
  Search,
  ChevronDown,
  X,
  Check,
  HardDrive,
  Cpu,
  RefreshCw,
  Headphones,
  SlidersHorizontal,
  Info,
  Cloud,
  Layers,
  Database
} from 'lucide-react';

// ==========================================
// 数据结构定义
// ==========================================

// 1. PVC 存储类驱动配额 (支持 local-path 与 ceph-rbd 两种)
export interface TenantPvcQuotaItem {
  id: string;
  tenant: string;
  alias: string;
  storageType: 'local-path' | 'ceph-rbd' | string;
  quota: string; // 如 '500Gi' / '2TiB'
  usage: string; // 如 '0Gi' / '32Gi'
}

// 2. 对象存储协议配额 (支持 S3 协议)
export interface TenantObjectStorageQuotaItem {
  id: string;
  tenant: string;
  alias: string;
  protocolType: 'S3' | string;
  quota: string; // 如 '1TiB' / '10TiB'
  usage: string; // 如 '3.8TiB' / '0Gi'
}

// 3. GPU 配额项
export interface TenantGpuQuotaItem {
  id: string;
  tenant: string;
  alias: string;
  gpuCardsQuota: number;
  vgpuQuota: number;
  usedGpu: number;
  status: '正常' | '配额紧张' | '超额';
}

// ==========================================
// 初始模拟数据
// ==========================================

const INITIAL_PVC_QUOTAS: TenantPvcQuotaItem[] = [
  {
    id: 'pvc-q-1',
    tenant: 's-sly',
    alias: '-',
    storageType: 'local-path',
    quota: '500Gi',
    usage: '0Gi'
  },
  {
    id: 'pvc-q-2',
    tenant: 'built-in',
    alias: '-',
    storageType: 'local-path',
    quota: '200Gi',
    usage: '0Gi'
  },
  {
    id: 'pvc-q-3',
    tenant: 'weaver',
    alias: '-',
    storageType: 'local-path',
    quota: '500Gi',
    usage: '0Gi'
  },
  {
    id: 'pvc-q-4',
    tenant: 'mohb-0811-tenant',
    alias: '-',
    storageType: 'local-path',
    quota: '300Gi',
    usage: '0Gi'
  },
  {
    id: 'pvc-q-5',
    tenant: 'venus-prod',
    alias: '金星大模型生产线',
    storageType: 'local-path',
    quota: '1000Gi',
    usage: '420Gi'
  },
  {
    id: 'pvc-q-6',
    tenant: 'venus-prod',
    alias: '金星大模型生产线',
    storageType: 'ceph-rbd',
    quota: '5TiB',
    usage: '1.2TiB'
  },
  {
    id: 'pvc-q-7',
    tenant: 'liuzhao',
    alias: '算法研究个人租户',
    storageType: 'local-path',
    quota: '300Gi',
    usage: '45Gi'
  },
  {
    id: 'pvc-q-8',
    tenant: 'liuzhao',
    alias: '算法研究个人租户',
    storageType: 'ceph-rbd',
    quota: '2TiB',
    usage: '380Gi'
  }
];

const INITIAL_OBJECT_STORAGE_QUOTAS: TenantObjectStorageQuotaItem[] = [
  {
    id: 'obj-q-1',
    tenant: 's-sly',
    alias: '-',
    protocolType: 'S3',
    quota: '1TiB',
    usage: '0Gi'
  },
  {
    id: 'obj-q-2',
    tenant: 'built-in',
    alias: '-',
    protocolType: 'S3',
    quota: '500Gi',
    usage: '0Gi'
  },
  {
    id: 'obj-q-3',
    tenant: 'weaver',
    alias: '-',
    protocolType: 'S3',
    quota: '1TiB',
    usage: '0Gi'
  },
  {
    id: 'obj-q-4',
    tenant: 'mohb-0811-tenant',
    alias: '-',
    protocolType: 'S3',
    quota: '1TiB',
    usage: '0Gi'
  },
  {
    id: 'obj-q-5',
    tenant: 'venus-prod',
    alias: '金星大模型生产线',
    protocolType: 'S3',
    quota: '10TiB',
    usage: '3.8TiB'
  },
  {
    id: 'obj-q-6',
    tenant: 'liuzhao',
    alias: '算法研究个人租户',
    protocolType: 'S3',
    quota: '2TiB',
    usage: '520Gi'
  }
];

const INITIAL_GPU_QUOTAS: TenantGpuQuotaItem[] = [
  {
    id: 'gpu-q-1',
    tenant: 's-sly',
    alias: '-',
    gpuCardsQuota: 20,
    vgpuQuota: 20,
    usedGpu: 4,
    status: '正常'
  },
  {
    id: 'gpu-q-2',
    tenant: 'built-in',
    alias: '-',
    gpuCardsQuota: 10,
    vgpuQuota: 10,
    usedGpu: 2,
    status: '正常'
  },
  {
    id: 'gpu-q-3',
    tenant: 'weaver',
    alias: '-',
    gpuCardsQuota: 12,
    vgpuQuota: 12,
    usedGpu: 1,
    status: '正常'
  },
  {
    id: 'gpu-q-4',
    tenant: 'mohb-0811-tenant',
    alias: '-',
    gpuCardsQuota: 8,
    vgpuQuota: 8,
    usedGpu: 1,
    status: '正常'
  },
  {
    id: 'gpu-q-5',
    tenant: 'venus-prod',
    alias: '金星大模型生产线',
    gpuCardsQuota: 32,
    vgpuQuota: 64,
    usedGpu: 24,
    status: '正常'
  },
  {
    id: 'gpu-q-6',
    tenant: 'liuzhao',
    alias: '算法研究个人租户',
    gpuCardsQuota: 8,
    vgpuQuota: 16,
    usedGpu: 2,
    status: '正常'
  }
];

export const TenantResourcesView: React.FC = () => {
  // 一级 Tab 切换：GPU资源 | 存储配额 (默认「存储配额」)
  const [activeMainTab, setActiveMainTab] = useState<'gpu' | 'storage'>('storage');

  // 二级 Tab 切换（存储配额下的分类）：PVC 存储 | 对象存储
  const [activeStorageCategory, setActiveStorageCategory] = useState<'pvc' | 'object-storage'>('pvc');

  // PVC 存储类型筛选器 (全部 / local-path / nfs-client / ceph-rbd / juicefs 等)
  const [selectedPvcTypeFilter, setSelectedPvcTypeFilter] = useState<string>('all');

  // 对象存储协议类型筛选器 (全部 / S3 / MinIO / Ceph-RGW / OSS 等)
  const [selectedObjectProtocolFilter, setSelectedObjectProtocolFilter] = useState<string>('all');

  // 租户筛选搜索词
  const [tenantSearchTerm, setTenantSearchTerm] = useState<string>('');

  // 状态数据：PVC 存储配额
  const [pvcQuotas, setPvcQuotas] = useState<TenantPvcQuotaItem[]>(INITIAL_PVC_QUOTAS);
  // 状态数据：对象存储配额
  const [objectQuotas, setObjectQuotas] = useState<TenantObjectStorageQuotaItem[]>(INITIAL_OBJECT_STORAGE_QUOTAS);
  // 状态数据：GPU 配额
  const [gpuQuotas, setGpuQuotas] = useState<TenantGpuQuotaItem[]>(INITIAL_GPU_QUOTAS);

  // 弹窗状态：更新 PVC 配额
  const [editingPvcItem, setEditingPvcItem] = useState<TenantPvcQuotaItem | null>(null);
  const [pvcQuotaInput, setPvcQuotaInput] = useState<string>('500');
  const [pvcQuotaUnit, setPvcQuotaUnit] = useState<string>('Gi');

  // 弹窗状态：更新 对象存储 配额
  const [editingObjectItem, setEditingObjectItem] = useState<TenantObjectStorageQuotaItem | null>(null);
  const [objectQuotaInput, setObjectQuotaInput] = useState<string>('1');
  const [objectQuotaUnit, setObjectQuotaUnit] = useState<string>('TiB');

  // 弹窗状态：更新 GPU 配额
  const [editingGpuItem, setEditingGpuItem] = useState<TenantGpuQuotaItem | null>(null);
  const [gpuCardsInput, setGpuCardsInput] = useState<number>(0);
  const [vgpuInput, setVgpuInput] = useState<number>(0);

  // 联系运维侧边弹窗状态
  const [isContactOpsOpen, setIsContactOpsOpen] = useState<boolean>(false);

  // Toast 提示
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 过滤后的 PVC 配额列表
  const filteredPvcList = useMemo(() => {
    return pvcQuotas.filter(item => {
      const matchSearch =
        !tenantSearchTerm.trim() ||
        item.tenant.toLowerCase().includes(tenantSearchTerm.toLowerCase()) ||
        item.alias.toLowerCase().includes(tenantSearchTerm.toLowerCase());
      const matchType = selectedPvcTypeFilter === 'all' || item.storageType === selectedPvcTypeFilter;
      return matchSearch && matchType;
    });
  }, [pvcQuotas, tenantSearchTerm, selectedPvcTypeFilter]);

  // 过滤后的 对象存储 配额列表 (仅保留 S3)
  const filteredObjectList = useMemo(() => {
    return objectQuotas.filter(item => {
      const matchSearch =
        !tenantSearchTerm.trim() ||
        item.tenant.toLowerCase().includes(tenantSearchTerm.toLowerCase()) ||
        item.alias.toLowerCase().includes(tenantSearchTerm.toLowerCase());
      const matchProtocol =
        selectedObjectProtocolFilter === 'all' || item.protocolType === selectedObjectProtocolFilter;
      return matchSearch && matchProtocol;
    });
  }, [objectQuotas, tenantSearchTerm, selectedObjectProtocolFilter]);

  // 过滤后的 GPU 配额数据
  const filteredGpuList = useMemo(() => {
    if (!tenantSearchTerm.trim()) return gpuQuotas;
    const term = tenantSearchTerm.toLowerCase();
    return gpuQuotas.filter(
      item => item.tenant.toLowerCase().includes(term) || item.alias.toLowerCase().includes(term)
    );
  }, [gpuQuotas, tenantSearchTerm]);

  // 1. GPU 资源汇总 (总量、已分配、剩余可分配)
  const totalGpuCards = 8;
  const allocatedWhiteListGpu = 50;
  const remainingGpuQuota = 0;

  // 2. PVC 存储资源汇总 (总量、已分配、剩余可分配)
  // local-path: 2.8TiB + ceph-rbd: 7.0TiB = 9.8TiB 已分配，集群总池约 20TiB
  const totalPvcStorage = '20TiB';
  const allocatedPvcStorage = '9.8TiB';
  const remainingPvcStorage = '10.2TiB';

  // 3. 对象存储 (S3) 资源汇总 (总量、已分配、剩余可分配)
  // S3 配额已分配: 1+0.5+1+1+10+2 = 15.5TiB，对象存储总池 50TiB
  const totalObjectStorage = '50TiB';
  const allocatedObjectStorage = '15.5TiB';
  const remainingObjectStorage = '34.5TiB';

  // 处理保存 PVC 配额
  const handleSavePvcQuota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPvcItem) return;

    const formattedQuota = `${pvcQuotaInput.trim() || '500'}${pvcQuotaUnit}`;

    setPvcQuotas(prev =>
      prev.map(item =>
        item.id === editingPvcItem.id
          ? {
              ...item,
              quota: formattedQuota
            }
          : item
      )
    );

    showToast(
      `租户「${editingPvcItem.tenant}」的 [${editingPvcItem.storageType}] 配额已更新为 ${formattedQuota}。`
    );
    setEditingPvcItem(null);
  };

  // 处理保存 对象存储 配额
  const handleSaveObjectQuota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingObjectItem) return;

    const formattedQuota = `${objectQuotaInput.trim() || '1'}${objectQuotaUnit}`;

    setObjectQuotas(prev =>
      prev.map(item =>
        item.id === editingObjectItem.id
          ? {
              ...item,
              quota: formattedQuota
            }
          : item
      )
    );

    showToast(
      `租户「${editingObjectItem.tenant}」的 [${editingObjectItem.protocolType}] 对象存储配额已更新为 ${formattedQuota}。`
    );
    setEditingObjectItem(null);
  };

  // 处理保存 GPU 配额
  const handleSaveGpuQuota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGpuItem) return;

    setGpuQuotas(prev =>
      prev.map(item =>
        item.id === editingGpuItem.id
          ? {
              ...item,
              gpuCardsQuota: gpuCardsInput,
              vgpuQuota: vgpuInput
            }
          : item
      )
    );

    showToast(`租户「${editingGpuItem.tenant}」的 GPU 配额已成功更新为 ${gpuCardsInput} 卡 (vGPU: ${vgpuInput})。`);
    setEditingGpuItem(null);
  };

  return (
    <div className="space-y-5 relative">
      {/* Toast 提示条 */}
      {toastMessage && (
        <div className="fixed top-14 right-8 z-50 flex items-center space-x-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. 顶部页面标题 */}
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">租户资源</h2>
      </div>

      {/* 2. 顶部三大核心资源指标卡片：GPU资源 / PVC存储资源 / 对象存储(S3)资源 (均含总量、已分配、剩余可分配) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 卡片 1: GPU 资源 */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-blue-600 bg-blue-50 border border-blue-100">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold text-slate-900">GPU 资源</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 mr-1">集群总量</span>
                <span className="text-base font-bold font-mono text-slate-900">{totalGpuCards}</span>
                <span className="text-[11px] text-slate-500 ml-0.5">卡</span>
              </div>
            </div>

            {/* 总量 / 已分配 / 剩余可分配 核心指标网格 */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-1">
              <div className="bg-slate-50/90 rounded-lg p-2.5 border border-slate-100 text-center">
                <div className="text-[11px] text-slate-500">总量</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  {totalGpuCards}
                  <span className="text-[10px] font-normal text-slate-500 ml-0.5">卡</span>
                </div>
              </div>

              <div className="bg-blue-50/60 rounded-lg p-2.5 border border-blue-100/80 text-center">
                <div className="text-[11px] text-blue-600 font-medium">已分配</div>
                <div className="text-lg font-bold font-mono text-blue-700 mt-0.5">
                  {allocatedWhiteListGpu}
                  <span className="text-[10px] font-normal text-blue-600 ml-0.5">卡</span>
                </div>
              </div>

              <div className="bg-amber-50/60 rounded-lg p-2.5 border border-amber-100/80 text-center">
                <div className="text-[11px] text-amber-600 font-medium">剩余可分配</div>
                <div className="text-lg font-bold font-mono text-amber-700 mt-0.5">
                  {remainingGpuQuota}
                  <span className="text-[10px] font-normal text-amber-600 ml-0.5">卡</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">已分配含白名单与等效分配</span>
            <span className="font-mono text-slate-600 font-medium">整卡基准</span>
          </div>
        </div>

        {/* 卡片 2: PVC 存储资源 (local-path / ceph-rbd) */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-indigo-600 bg-indigo-50 border border-indigo-100">
                  <HardDrive className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold text-slate-900">PVC 存储资源</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 mr-1">存储池总量</span>
                <span className="text-base font-bold font-mono text-slate-900">{totalPvcStorage}</span>
              </div>
            </div>

            {/* 总量 / 已分配 / 剩余可分配 核心指标网格 */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-1">
              <div className="bg-slate-50/90 rounded-lg p-2.5 border border-slate-100 text-center">
                <div className="text-[11px] text-slate-500">总量</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5">{totalPvcStorage}</div>
              </div>

              <div className="bg-indigo-50/60 rounded-lg p-2.5 border border-indigo-100/80 text-center">
                <div className="text-[11px] text-indigo-600 font-medium">已分配</div>
                <div className="text-base font-bold font-mono text-indigo-700 mt-0.5">{allocatedPvcStorage}</div>
              </div>

              <div className="bg-emerald-50/60 rounded-lg p-2.5 border border-emerald-100/80 text-center">
                <div className="text-[11px] text-emerald-600 font-medium">剩余可分配</div>
                <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">{remainingPvcStorage}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">支持 local-path 与 ceph-rbd 驱动</span>
            <span className="font-mono text-slate-600 font-medium">持久卷池</span>
          </div>
        </div>

        {/* 卡片 3: 对象存储资源 (S3) */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-5 flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-emerald-600 bg-emerald-50 border border-emerald-100">
                  <Cloud className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold text-slate-900">对象存储资源</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 mr-1">存储桶总量</span>
                <span className="text-base font-bold font-mono text-slate-900">{totalObjectStorage}</span>
              </div>
            </div>

            {/* 总量 / 已分配 / 剩余可分配 核心指标网格 */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-1">
              <div className="bg-slate-50/90 rounded-lg p-2.5 border border-slate-100 text-center">
                <div className="text-[11px] text-slate-500">总量</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5">{totalObjectStorage}</div>
              </div>

              <div className="bg-emerald-50/60 rounded-lg p-2.5 border border-emerald-100/80 text-center">
                <div className="text-[11px] text-emerald-600 font-medium">已分配</div>
                <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">{allocatedObjectStorage}</div>
              </div>

              <div className="bg-blue-50/60 rounded-lg p-2.5 border border-blue-100/80 text-center">
                <div className="text-[11px] text-blue-600 font-medium">剩余可分配</div>
                <div className="text-base font-bold font-mono text-blue-700 mt-0.5">{remainingObjectStorage}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">S3 协议存储桶配额</span>
            <span className="font-mono text-slate-600 font-medium">海量对象池</span>
          </div>
        </div>
      </div>

      {/* 3. 下方主内容卡片：GPU资源 / 存储配额 主 Tabs 与多类存储驱动配额 */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* 一级 Tab 栏：GPU资源 | 存储配额 */}
        <div className="px-6 pt-3 flex items-center space-x-8 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveMainTab('gpu')}
            className={`pb-3 text-xs font-medium transition-all relative cursor-pointer ${
              activeMainTab === 'gpu'
                ? 'text-blue-600 font-bold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            GPU资源
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('storage')}
            className={`pb-3 text-xs font-medium transition-all relative cursor-pointer ${
              activeMainTab === 'storage'
                ? 'text-blue-600 font-bold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            存储配额
          </button>
        </div>

        {/* Tab 内部内容区 */}
        <div className="p-6 space-y-4">
          {activeMainTab === 'storage' ? (
            <div className="space-y-4">
              {/* 存储配额分类切换：PVC 与 对象存储 */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                {/* 分类胶囊标签按钮 */}
                <div className="flex items-center space-x-2 bg-slate-100/90 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveStorageCategory('pvc');
                      setSelectedPvcTypeFilter('all');
                    }}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      activeStorageCategory === 'pvc'
                        ? 'bg-white text-blue-600 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                    <span>PVC 存储配额</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveStorageCategory('object-storage');
                      setSelectedObjectProtocolFilter('all');
                    }}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      activeStorageCategory === 'object-storage'
                        ? 'bg-white text-blue-600 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Cloud className="w-3.5 h-3.5 text-emerald-500" />
                    <span>对象存储配额</span>
                  </button>
                </div>

                {/* 筛选与搜索 */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* 当在 PVC 分类下时：仅保留 local-path 与 ceph-rbd */}
                  {activeStorageCategory === 'pvc' ? (
                    <div className="flex items-center space-x-1.5 text-xs">
                      <span className="text-slate-500 text-[11px]">驱动类型:</span>
                      <select
                        value={selectedPvcTypeFilter}
                        onChange={(e) => setSelectedPvcTypeFilter(e.target.value)}
                        className="h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer font-sans"
                      >
                        <option value="all">全部驱动类型</option>
                        <option value="local-path">local-path</option>
                        <option value="ceph-rbd">ceph-rbd</option>
                      </select>
                    </div>
                  ) : (
                    /* 当在 对象存储 分类下时：保留 S3 协议 */
                    <div className="flex items-center space-x-1.5 text-xs">
                      <span className="text-slate-500 text-[11px]">存储协议:</span>
                      <select
                        value={selectedObjectProtocolFilter}
                        onChange={(e) => setSelectedObjectProtocolFilter(e.target.value)}
                        className="h-8 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer font-sans"
                      >
                        <option value="all">全部对象协议</option>
                        <option value="S3">S3</option>
                      </select>
                    </div>
                  )}

                  {/* 租户搜索框 */}
                  <div className="relative w-48 sm:w-56">
                    <input
                      type="text"
                      value={tenantSearchTerm}
                      onChange={(e) => setTenantSearchTerm(e.target.value)}
                      placeholder="请选择租户"
                      className="w-full h-8 pl-3 pr-8 bg-white border border-slate-300 rounded text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    {tenantSearchTerm ? (
                      <button
                        type="button"
                        onClick={() => setTenantSearchTerm('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    ) : (
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    )}
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* 子分类 1: PVC 存储配额表格 */}
              {/* -------------------------------------------------------- */}
              {activeStorageCategory === 'pvc' && (
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                        <th className="py-3 px-4 w-[26%]">租户/别名</th>
                        <th className="py-3 px-4 w-[30%]">存储驱动 (StorageClass)</th>
                        <th className="py-3 px-4 w-[22%]">存储配额</th>
                        <th className="py-3 px-4 w-[12%]">存储用量</th>
                        <th className="py-3 px-4 w-[10%]">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredPvcList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400">
                            <HardDrive className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                            <p>未找到匹配的租户 PVC 存储配额记录</p>
                          </td>
                        </tr>
                      ) : (
                        filteredPvcList.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* 1. 租户/别名 */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5">
                                <div className="font-mono text-slate-800 font-medium">{item.tenant}</div>
                                <div className="text-slate-400 text-[11px]">{item.alias}</div>
                              </div>
                            </td>

                            {/* 2. 存储驱动类型 (local-path 与 ceph-rbd) */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                                  item.storageType === 'local-path'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200/80'
                                    : 'bg-purple-50 text-purple-700 border border-purple-200/80'
                                }`}
                              >
                                {item.storageType}
                              </span>
                            </td>

                            {/* 3. 存储配额 */}
                            <td className="py-3.5 px-4 font-mono text-slate-700">
                              <span className="font-medium text-slate-900">{item.quota}</span>
                            </td>

                            {/* 4. 存储用量 */}
                            <td className="py-3.5 px-4 font-mono text-slate-700">
                              {item.usage}
                            </td>

                            {/* 5. 操作：更新配额 */}
                            <td className="py-3.5 px-4">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPvcItem(item);
                                  const num = item.quota.replace(/[^0-9.]/g, '') || '500';
                                  const unit = item.quota.replace(/[0-9.]/g, '') || 'Gi';
                                  setPvcQuotaInput(num);
                                  setPvcQuotaUnit(unit);
                                }}
                                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-normal"
                              >
                                更新配额
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* 子分类 2: 对象存储配额表格 (S3) */}
              {/* -------------------------------------------------------- */}
              {activeStorageCategory === 'object-storage' && (
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                        <th className="py-3 px-4 w-[26%]">租户/别名</th>
                        <th className="py-3 px-4 w-[30%]">对象存储服务协议</th>
                        <th className="py-3 px-4 w-[22%]">存储总配额</th>
                        <th className="py-3 px-4 w-[12%]">存储用量</th>
                        <th className="py-3 px-4 w-[10%]">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredObjectList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400">
                            <Cloud className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                            <p>未找到匹配的租户对象存储配额记录</p>
                          </td>
                        </tr>
                      ) : (
                        filteredObjectList.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* 1. 租户/别名 */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5">
                                <div className="font-mono text-slate-800 font-medium">{item.tenant}</div>
                                <div className="text-slate-400 text-[11px]">{item.alias}</div>
                              </div>
                            </td>

                            {/* 2. 对象存储协议类型 (S3) */}
                            <td className="py-3.5 px-4">
                              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200/80">
                                {item.protocolType}
                              </span>
                            </td>

                            {/* 3. 存储总配额 */}
                            <td className="py-3.5 px-4 font-mono text-slate-700">
                              <span className="font-medium text-slate-900">{item.quota}</span>
                            </td>

                            {/* 4. 存储用量 (原已用容量) */}
                            <td className="py-3.5 px-4 font-mono text-slate-700">
                              {item.usage}
                            </td>

                            {/* 5. 操作：更新配额 */}
                            <td className="py-3.5 px-4">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingObjectItem(item);
                                  const num = item.quota.replace(/[^0-9.]/g, '') || '1';
                                  const unit = item.quota.replace(/[0-9.]/g, '') || 'TiB';
                                  setObjectQuotaInput(num);
                                  setObjectQuotaUnit(unit);
                                }}
                                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-normal"
                              >
                                更新配额
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* ======================================================== */
            /* GPU 资源配额表格 */
            /* ======================================================== */
            <div className="border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                    <th className="py-3 px-4 w-[25%]">租户/别名</th>
                    <th className="py-3 px-4 w-[20%]">整卡配额 (物理卡)</th>
                    <th className="py-3 px-4 w-[20%]">逻辑算力配额 (vGPU)</th>
                    <th className="py-3 px-4 w-[15%]">已占用卡数</th>
                    <th className="py-3 px-4 w-[10%]">状态</th>
                    <th className="py-3 px-4 w-[10%]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredGpuList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Cpu className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <p>未找到匹配的租户 GPU 配额记录</p>
                      </td>
                    </tr>
                  ) : (
                    filteredGpuList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4">
                          <div className="space-y-0.5">
                            <div className="font-mono text-slate-800 font-medium">{item.tenant}</div>
                            <div className="text-slate-400 text-[11px]">{item.alias}</div>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono font-medium text-slate-800">
                          {item.gpuCardsQuota} <span className="text-slate-500 text-[11px] font-sans">卡</span>
                        </td>

                        <td className="py-4 px-4 font-mono text-slate-700">
                          {item.vgpuQuota} <span className="text-slate-500 text-[11px] font-sans">vGPU</span>
                        </td>

                        <td className="py-4 px-4 font-mono text-slate-700">
                          {item.usedGpu} <span className="text-slate-500 text-[11px] font-sans">卡</span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {item.status}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingGpuItem(item);
                              setGpuCardsInput(item.gpuCardsQuota);
                              setVgpuInput(item.vgpuQuota);
                            }}
                            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-normal"
                          >
                            更新配额
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 弹窗 1: 更新租户 PVC 存储驱动配额 */}
      {/* ======================================================== */}
      {editingPvcItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setEditingPvcItem(null)}
        >
          <div
            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  更新 PVC 配额: {editingPvcItem.tenant}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPvcItem(null)}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePvcQuota} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">存储驱动 (StorageClass):</span>
                  <span className="font-mono text-blue-600 font-bold">{editingPvcItem.storageType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">当前已占用空间:</span>
                  <span className="font-mono text-slate-800 font-medium">{editingPvcItem.usage}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  PVC 存储容量上限配额
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="例如: 500, 1000"
                    value={pvcQuotaInput}
                    onChange={(e) => setPvcQuotaInput(e.target.value)}
                    className="flex-1 h-8 px-3 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                  <select
                    value={pvcQuotaUnit}
                    onChange={(e) => setPvcQuotaUnit(e.target.value)}
                    className="h-8 px-2 border border-slate-300 rounded text-slate-800 bg-slate-50 font-mono cursor-pointer"
                  >
                    <option value="Gi">Gi</option>
                    <option value="TiB">TiB</option>
                    <option value="Mi">Mi</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  限制该租户使用 {editingPvcItem.storageType} 驱动创建的 PVC 持久卷总容量上限。
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingPvcItem(null)}
                  className="h-8 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="h-8 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer"
                >
                  确定更新
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 弹窗 2: 更新租户 对象存储 配额 */}
      {/* ======================================================== */}
      {editingObjectItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setEditingObjectItem(null)}
        >
          <div
            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center space-x-2">
                <Cloud className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  更新对象存储配额: {editingObjectItem.tenant}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingObjectItem(null)}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveObjectQuota} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">对象存储协议:</span>
                  <span className="font-mono text-emerald-600 font-bold">{editingObjectItem.protocolType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">当前存储用量:</span>
                  <span className="font-mono text-slate-800 font-medium">{editingObjectItem.usage}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  对象存储总容量上限配额
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="例如: 2, 10, 50"
                    value={objectQuotaInput}
                    onChange={(e) => setObjectQuotaInput(e.target.value)}
                    className="flex-1 h-8 px-3 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                  <select
                    value={objectQuotaUnit}
                    onChange={(e) => setObjectQuotaUnit(e.target.value)}
                    className="h-8 px-2 border border-slate-300 rounded text-slate-800 bg-slate-50 font-mono cursor-pointer"
                  >
                    <option value="TiB">TiB</option>
                    <option value="Gi">Gi</option>
                    <option value="PiB">PiB</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  限制该租户在 {editingObjectItem.protocolType} 协议下全部 Bucket 存储桶允许存放的对象总容量上限。
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingObjectItem(null)}
                  className="h-8 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="h-8 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer"
                >
                  确定更新
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 弹窗 3: 更新租户 GPU 配额 */}
      {/* ======================================================== */}
      {editingGpuItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setEditingGpuItem(null)}
        >
          <div
            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">更新 GPU 配额: {editingGpuItem.tenant}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingGpuItem(null)}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGpuQuota} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  物理整卡配额 (卡)
                </label>
                <input
                  type="number"
                  min="0"
                  max="128"
                  value={gpuCardsInput}
                  onChange={(e) => setGpuCardsInput(Number(e.target.value))}
                  className="w-full h-8 px-3 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  逻辑 GPU (vGPU) 配额
                </label>
                <input
                  type="number"
                  min="0"
                  max="256"
                  value={vgpuInput}
                  onChange={(e) => setVgpuInput(Number(e.target.value))}
                  className="w-full h-8 px-3 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingGpuItem(null)}
                  className="h-8 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="h-8 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer"
                >
                  确定更新
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. 浮动在屏幕右侧的「联系运维」按钮（1:1 还原截图右侧） */}
      {/* ======================================================== */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <button
          type="button"
          onClick={() => setIsContactOpsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-1.5 rounded-l-lg shadow-xl flex flex-col items-center space-y-1 transition-transform hover:-translate-x-1 cursor-pointer"
          title="点击联系运维与技术支持"
        >
          <Headphones className="w-4 h-4 text-white" />
          <div className="writing-vertical text-xs font-medium tracking-wider select-none py-1" style={{ writingMode: 'vertical-rl' }}>
            联系运维
          </div>
        </button>
      </div>

      {/* 联系运维弹窗 */}
      {isContactOpsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsContactOpsOpen(false)}
        >
          <div
            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white">
              <div className="flex items-center space-x-2">
                <Headphones className="w-4 h-4" />
                <h3 className="text-sm font-bold">算力平台运维支持中心</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsContactOpsOpen(false)}
                className="w-6 h-6 rounded flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center space-x-2">
                  <span className="w-20 text-slate-400">7x24热线:</span>
                  <span className="font-mono font-bold text-blue-600">400-880-9966</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-20 text-slate-400">值班群钉钉:</span>
                  <span className="font-mono text-slate-800">ai-ops-cluster-oncall</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-20 text-slate-400">当前值班员:</span>
                  <span className="text-slate-800">刘工 (工号 90812)</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-slate-600 leading-relaxed">
                如遇 GPU 驱动掉卡、RoCE 网络丢包、Ceph/NFS/S3 存储挂载卡死或需要临时提高租户白名单配额，请随时联系值班工程师。
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsContactOpsOpen(false);
                  showToast('已发起紧急工单通知，值班运维工程师将在 5 分钟内响应。');
                }}
                className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer"
              >
                一键呼叫值班运维
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
