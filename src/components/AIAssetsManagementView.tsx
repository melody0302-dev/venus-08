import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  Clock,
  HardDrive,
  Database,
  Cloud,
  Layers,
  Box,
  Server,
  FolderPlus,
  RefreshCw,
  X,
  Check,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowUpDown,
  UploadCloud,
  FileCode,
  Tag,
  Shield,
  Eye,
  KeyRound
} from 'lucide-react';

// PVC 实体定义
export interface PvcItem {
  id: string;
  name: string;
  type: string; // 如 'nfs-client' | 'rook-ceph-block' | 'local-path'
  capacity: string; // 如 '50 Gi' | '100 Gi' | '204800 Gi'
  capacityValue: number; // 单位 GiB 数值
  status: 'Bound' | 'Pending' | 'Lost' | 'Released';
  createdAt: string;
  tenant: string;
  accessMode?: 'ReadWriteMany' | 'ReadWriteOnce' | 'ReadOnlyMany';
  volumeName?: string;
  storageClass?: string;
  boundPodsCount?: number;
  description?: string;
}

// S3 存储桶实体定义
export interface S3BucketItem {
  id: string;
  name: string;
  endpoint: string;
  region: string;
  acl: 'private' | 'public-read' | 'public-read-write';
  usedCapacity: string;
  objectCount: number;
  status: 'Active' | 'Warning' | 'Syncing';
  createdAt: string;
  tenant: string;
  description?: string;
}

// 模拟预置的 PVC 数据（100% 还原截图）
const INITIAL_PVC_LIST: PvcItem[] = [
  {
    id: 'pvc-1',
    name: 'aicloud-backend-logs',
    type: 'nfs-client',
    capacity: '50 Gi',
    capacityValue: 50,
    status: 'Bound',
    createdAt: '2026-07-20 13:01:42',
    tenant: 'venus-prod',
    accessMode: 'ReadWriteMany',
    volumeName: 'pv-nfs-aicloud-logs-01',
    storageClass: 'nfs-client',
    boundPodsCount: 4,
    description: 'AI 云平台后端核心日志与分布式追踪持久化存储'
  },
  {
    id: 'pvc-2',
    name: 'new-api-master-data',
    type: 'nfs-client',
    capacity: '100 Gi',
    capacityValue: 100,
    status: 'Bound',
    createdAt: '2026-07-20 13:01:06',
    tenant: 'new-api',
    accessMode: 'ReadWriteMany',
    volumeName: 'pv-nfs-new-api-data-01',
    storageClass: 'nfs-client',
    boundPodsCount: 2,
    description: 'API 网关服务主数据卷与令牌索引'
  },
  {
    id: 'pvc-3',
    name: 'new-api-master-logs',
    type: 'nfs-client',
    capacity: '50 Gi',
    capacityValue: 50,
    status: 'Bound',
    createdAt: '2026-07-20 13:01:06',
    tenant: 'new-api',
    accessMode: 'ReadWriteMany',
    volumeName: 'pv-nfs-new-api-logs-01',
    storageClass: 'nfs-client',
    boundPodsCount: 2,
    description: '网关访问与调用链路日志持久化'
  },
  {
    id: 'pvc-4',
    name: 'redis-data',
    type: 'nfs-client',
    capacity: '200 Gi',
    capacityValue: 200,
    status: 'Bound',
    createdAt: '2026-07-20 13:01:06',
    tenant: 'new-api',
    accessMode: 'ReadWriteOnce',
    volumeName: 'pv-nfs-redis-cluster-01',
    storageClass: 'nfs-client',
    boundPodsCount: 3,
    description: 'Redis 分布式缓存集群 AOF/RDB 持久化'
  },
  {
    id: 'pvc-5',
    name: 'test',
    type: 'nfs-client',
    capacity: '1 Gi',
    capacityValue: 1,
    status: 'Bound',
    createdAt: '2026-06-24 10:36:57',
    tenant: 'test-suite',
    accessMode: 'ReadWriteMany',
    volumeName: 'pv-nfs-test-suite-01',
    storageClass: 'nfs-client',
    boundPodsCount: 1,
    description: 'CI/CD 自动化集成测试临时产物存储'
  },
  {
    id: 'pvc-6',
    name: 'nfs',
    type: 'nfs-client',
    capacity: '1 Gi',
    capacityValue: 1,
    status: 'Bound',
    createdAt: '2026-05-31 04:35:59',
    tenant: 'test',
    accessMode: 'ReadWriteMany',
    volumeName: 'pv-nfs-general-01',
    storageClass: 'nfs-client',
    boundPodsCount: 1,
    description: '测试租户通用共享挂载目录'
  },
  {
    id: 'pvc-7',
    name: 'mysql-data-venus-mysql-0',
    type: 'rook-ceph-block',
    capacity: '204800 Gi',
    capacityValue: 204800,
    status: 'Pending',
    createdAt: '2026-05-21 19:54:30',
    tenant: 'venus-prod',
    accessMode: 'ReadWriteOnce',
    volumeName: 'pv-ceph-mysql-venus-0',
    storageClass: 'rook-ceph-block',
    boundPodsCount: 0,
    description: '分布式 MySQL 数据库高 IOPS Ceph 块存储（等待 Ceph OSD 卷扩容）'
  },
  {
    id: 'pvc-8',
    name: 'model-checkpoints-llama3',
    type: 'rook-ceph-block',
    capacity: '1024 Gi',
    capacityValue: 1024,
    status: 'Bound',
    createdAt: '2026-05-15 08:22:19',
    tenant: 'liuzhao',
    accessMode: 'ReadWriteMany',
    volumeName: 'pv-ceph-llama3-weights',
    storageClass: 'rook-ceph-block',
    boundPodsCount: 2,
    description: '大语言模型分布式微调 Checkpoint 权重高速存储'
  },
  {
    id: 'pvc-9',
    name: 'dataset-cache-imagenet',
    type: 'nfs-client',
    capacity: '500 Gi',
    capacityValue: 500,
    status: 'Bound',
    createdAt: '2026-05-10 14:10:05',
    tenant: 'bob-0728',
    accessMode: 'ReadOnlyMany',
    volumeName: 'pv-nfs-imagenet-cache',
    storageClass: 'nfs-client',
    boundPodsCount: 6,
    description: '多机并行训练数据集共享只读缓存'
  }
];

// 模拟预置的 S3 存储桶数据
const INITIAL_S3_LIST: S3BucketItem[] = [
  {
    id: 's3-1',
    name: 'ai-model-weights-hub',
    endpoint: 's3.ai-cloud.internal:9000',
    region: 'dc-aliyun',
    acl: 'private',
    usedCapacity: '2.4 TiB',
    objectCount: 1420,
    status: 'Active',
    createdAt: '2026-07-15 09:12:00',
    tenant: 'venus-prod',
    description: '大模型预训练基座与 LoRA 适配器权重对象存储'
  },
  {
    id: 's3-2',
    name: 'raw-corpus-multimodal-v2',
    endpoint: 's3.ai-cloud.internal:9000',
    region: 'dc-aliyun',
    acl: 'private',
    usedCapacity: '18.6 TiB',
    objectCount: 285400,
    status: 'Active',
    createdAt: '2026-07-02 11:30:45',
    tenant: 'new-api',
    description: '多模态原始图文音视频清洗前数据集存储桶'
  },
  {
    id: 's3-3',
    name: 'tensorboard-event-logs',
    endpoint: 'minio.cluster.venus.local:9000',
    region: 'dc-tencent',
    acl: 'public-read',
    usedCapacity: '120 GiB',
    objectCount: 8930,
    status: 'Active',
    createdAt: '2026-06-18 16:44:12',
    tenant: 'test-suite',
    description: '分布式训练过程指标与可视化 Event 日志存储'
  },
  {
    id: 's3-4',
    name: 'huggingface-mirror-cache',
    endpoint: 's3.ai-cloud.internal:9000',
    region: 'dc-aliyun',
    acl: 'public-read-write',
    usedCapacity: '5.1 TiB',
    objectCount: 65000,
    status: 'Active',
    createdAt: '2026-05-20 14:05:30',
    tenant: 'liuzhao',
    description: 'HuggingFace 社区开源模型与 Tokenizer 共享镜像缓存'
  }
];

// 可选租户列表
const TENANT_OPTIONS = [
  { value: 'all', label: '全部租户' },
  { value: 'venus-prod', label: 'venus-prod' },
  { value: 'new-api', label: 'new-api' },
  { value: 'test-suite', label: 'test-suite' },
  { value: 'test', label: 'test' },
  { value: 'liuzhao', label: 'liuzhao' },
  { value: 'bob-0728', label: 'bob-0728' },
  { value: 'alice-0728', label: 'alice-0728' },
];

export const AIAssetsManagementView: React.FC = () => {
  // 顶部 Tab 导航：模型仓库 | 数据集 | 镜像仓库 | 存储管理（保持原样）
  const [activeTab, setActiveTab] = useState<'models' | 'datasets' | 'images' | 'storage'>('storage');

  // 存储管理下的二级 Tab / 切换按钮：PVC | S3
  const [storageSubTab, setStorageSubTab] = useState<'pvc' | 's3'>('pvc');

  // PVC 列表状态
  const [pvcList, setPvcList] = useState<PvcItem[]>(INITIAL_PVC_LIST);
  const [pvcTenantFilter, setPvcTenantFilter] = useState<string>('all');
  const [pvcSearchTerm, setPvcSearchTerm] = useState<string>('');
  const [pvcPageSize, setPvcPageSize] = useState<number>(10);
  const [pvcCurrentPage, setPvcCurrentPage] = useState<number>(1);

  // S3 列表状态
  const [s3List, setS3List] = useState<S3BucketItem[]>(INITIAL_S3_LIST);
  const [s3TenantFilter, setS3TenantFilter] = useState<string>('all');
  const [s3SearchTerm, setS3SearchTerm] = useState<string>('');

  // 弹窗状态：添加 PVC
  const [isAddPvcModalOpen, setIsAddPvcModalOpen] = useState(false);
  const [newPvcForm, setNewPvcForm] = useState({
    name: '',
    tenant: 'venus-prod',
    type: 'nfs-client',
    capacityNumber: '50',
    capacityUnit: 'Gi',
    accessMode: 'ReadWriteMany' as 'ReadWriteMany' | 'ReadWriteOnce' | 'ReadOnlyMany',
    description: ''
  });

  // 弹窗状态：更新 PVC 容量
  const [editingPvc, setEditingPvc] = useState<PvcItem | null>(null);
  const [editCapacityNumber, setEditCapacityNumber] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');

  // 弹窗状态：删除 PVC 确认
  const [deletingPvc, setDeletingPvc] = useState<PvcItem | null>(null);

  // 弹窗状态：查看 PVC 详情
  const [viewingPvc, setViewingPvc] = useState<PvcItem | null>(null);

  // 弹窗状态：添加 S3 存储桶
  const [isAddS3ModalOpen, setIsAddS3ModalOpen] = useState(false);
  const [newS3Form, setNewS3Form] = useState({
    name: '',
    tenant: 'venus-prod',
    region: 'dc-aliyun',
    acl: 'private' as 'private' | 'public-read' | 'public-read-write',
    description: ''
  });

  // 弹窗状态：配置 S3 存储桶与权限修改
  const [editingS3, setEditingS3] = useState<S3BucketItem | null>(null);
  const [editS3Acl, setEditS3Acl] = useState<'private' | 'public-read' | 'public-read-write'>('private');
  const [editS3Description, setEditS3Description] = useState<string>('');

  // 操作成功提示条
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // S3 权限徽章渲染
  const renderS3AclBadge = (acl: S3BucketItem['acl']) => {
    switch (acl) {
      case 'private':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80">
            私有
          </span>
        );
      case 'public-read':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/80">
            公共读
          </span>
        );
      case 'public-read-write':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
            公共读写
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
            {acl}
          </span>
        );
    }
  };

  // 过滤后的 PVC 数据
  const filteredPvcList = useMemo(() => {
    return pvcList.filter(item => {
      const matchTenant = pvcTenantFilter === 'all' || item.tenant === pvcTenantFilter;
      const matchSearch = !pvcSearchTerm.trim() || 
        item.name.toLowerCase().includes(pvcSearchTerm.trim().toLowerCase()) ||
        item.type.toLowerCase().includes(pvcSearchTerm.trim().toLowerCase());
      return matchTenant && matchSearch;
    });
  }, [pvcList, pvcTenantFilter, pvcSearchTerm]);

  // 过滤后的 S3 数据
  const filteredS3List = useMemo(() => {
    return s3List.filter(item => {
      const matchTenant = s3TenantFilter === 'all' || item.tenant === s3TenantFilter;
      const matchSearch = !s3SearchTerm.trim() ||
        item.name.toLowerCase().includes(s3SearchTerm.trim().toLowerCase()) ||
        item.endpoint.toLowerCase().includes(s3SearchTerm.trim().toLowerCase());
      return matchTenant && matchSearch;
    });
  }, [s3List, s3TenantFilter, s3SearchTerm]);

  // 处理添加 PVC
  const handleAddPvcSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPvcForm.name.trim()) return;

    const capacityStr = `${newPvcForm.capacityNumber} ${newPvcForm.capacityUnit}`;
    const capNum = parseFloat(newPvcForm.capacityNumber) || 10;
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newPvc: PvcItem = {
      id: `pvc-${Date.now()}`,
      name: newPvcForm.name.trim(),
      type: newPvcForm.type,
      capacity: capacityStr,
      capacityValue: newPvcForm.capacityUnit === 'Ti' ? capNum * 1024 : capNum,
      status: 'Bound',
      createdAt: timeStr,
      tenant: newPvcForm.tenant,
      accessMode: newPvcForm.accessMode,
      volumeName: `pv-${newPvcForm.type}-${newPvcForm.name.trim()}`,
      storageClass: newPvcForm.type,
      boundPodsCount: 0,
      description: newPvcForm.description || '新建持久化存储卷声明 (PersistentVolumeClaim)'
    };

    setPvcList([newPvc, ...pvcList]);
    setIsAddPvcModalOpen(false);
    setNewPvcForm({
      name: '',
      tenant: 'venus-prod',
      type: 'nfs-client',
      capacityNumber: '50',
      capacityUnit: 'Gi',
      accessMode: 'ReadWriteMany',
      description: ''
    });
    showToast(`成功创建 PVC「${newPvc.name}」(${capacityStr})，状态为 Bound。`);
  };

  // 处理更新 PVC
  const handleUpdatePvcSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPvc) return;

    const newCapStr = `${editCapacityNumber} Gi`;
    const newCapNum = parseFloat(editCapacityNumber) || editingPvc.capacityValue;

    setPvcList(pvcList.map(p => {
      if (p.id === editingPvc.id) {
        return {
          ...p,
          capacity: newCapStr,
          capacityValue: newCapNum,
          description: editDescription || p.description
        };
      }
      return p;
    }));

    showToast(`已成功更新 PVC「${editingPvc.name}」容量为 ${newCapStr}。`);
    setEditingPvc(null);
  };

  // 处理删除 PVC
  const handleConfirmDeletePvc = () => {
    if (!deletingPvc) return;
    setPvcList(pvcList.filter(p => p.id !== deletingPvc.id));
    showToast(`已成功删除 PVC「${deletingPvc.name}」。`);
    setDeletingPvc(null);
  };

  // 处理添加 S3 存储桶
  const handleAddS3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newS3Form.name.trim()) return;

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newBucket: S3BucketItem = {
      id: `s3-${Date.now()}`,
      name: newS3Form.name.trim().toLowerCase(),
      endpoint: 's3.ai-cloud.internal:9000',
      region: newS3Form.region,
      acl: newS3Form.acl,
      usedCapacity: '0 B',
      objectCount: 0,
      status: 'Active',
      createdAt: timeStr,
      tenant: newS3Form.tenant,
      description: newS3Form.description || '新建 S3 兼容对象存储桶'
    };

    setS3List([newBucket, ...s3List]);
    setIsAddS3ModalOpen(false);
    setNewS3Form({
      name: '',
      tenant: 'venus-prod',
      region: 'dc-aliyun',
      acl: 'private',
      description: ''
    });
    showToast(`成功创建 S3 存储桶「${newBucket.name}」。`);
  };

  // 处理更新 S3 存储桶权限与配置
  const handleUpdateS3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingS3) return;

    setS3List(s3List.map(s => {
      if (s.id === editingS3.id) {
        return {
          ...s,
          acl: editS3Acl,
          description: editS3Description || s.description
        };
      }
      return s;
    }));

    const aclLabelMap: Record<S3BucketItem['acl'], string> = {
      'private': '私有',
      'public-read': '公共读',
      'public-read-write': '公共读写'
    };

    showToast(`已成功将 S3 存储桶「${editingS3.name}」权限更新为【${aclLabelMap[editS3Acl]}】。`);
    setEditingS3(null);
  };

  return (
    <div className="space-y-4">
      {/* Toast 提示 */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-medium">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-xs text-emerald-600 hover:text-emerald-800 font-medium cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 顶部主卡片：包含标题与一级 Tab 导航（还原截图结构） */}
      <div className="bg-white rounded-lg border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* 顶部大标题 */}
        <div className="px-6 pt-5 pb-3">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">AI资产管理</h2>
        </div>

        {/* 导航 Tab 栏（保持原样：模型仓库 | 数据集 | 镜像仓库 | 存储管理） */}
        <div className="px-6 flex items-center space-x-8 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('models')}
            className={`pb-3 text-xs font-medium transition-all relative cursor-pointer ${
              activeTab === 'models'
                ? 'text-blue-600 font-bold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            模型仓库
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('datasets')}
            className={`pb-3 text-xs font-medium transition-all relative cursor-pointer ${
              activeTab === 'datasets'
                ? 'text-blue-600 font-bold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            数据集
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`pb-3 text-xs font-medium transition-all relative cursor-pointer ${
              activeTab === 'images'
                ? 'text-blue-600 font-bold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            镜像仓库
          </button>

          {/* 存储管理（保持原样） */}
          <button
            type="button"
            onClick={() => setActiveTab('storage')}
            className={`pb-3 text-xs font-medium transition-all relative cursor-pointer ${
              activeTab === 'storage'
                ? 'text-blue-600 font-bold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            存储管理
          </button>
        </div>

        {/* ======================================================== */}
        {/* 存储管理视图（内含二层 PVC 与 S3 切换 Tab） */}
        {/* ======================================================== */}
        {activeTab === 'storage' && (
          <div className="p-6 space-y-4">
            {/* 二级头部与筛选区：左侧标题与 PVC / S3 切换按钮，右侧为筛选操作 */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-base font-bold text-slate-900">存储管理</h3>

                {/* 二层 Tab 切换按钮：PVC 和 S3 */}
                <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setStorageSubTab('pvc')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center space-x-1.5 ${
                      storageSubTab === 'pvc'
                        ? 'bg-white text-blue-600 font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>PVC</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-medium ${
                      storageSubTab === 'pvc' ? 'bg-blue-50 text-blue-600' : 'bg-slate-200/80 text-slate-600'
                    }`}>
                      {pvcList.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStorageSubTab('s3')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center space-x-1.5 ${
                      storageSubTab === 's3'
                        ? 'bg-white text-blue-600 font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    <span>S3</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-medium ${
                      storageSubTab === 's3' ? 'bg-blue-50 text-blue-600' : 'bg-slate-200/80 text-slate-600'
                    }`}>
                      {s3List.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* 右侧根据当前选中的 PVC 或 S3 显示对应的筛选与操作 */}
              {storageSubTab === 'pvc' ? (
                <div className="flex flex-wrap items-center gap-3">
                  {/* 租户下拉选择 */}
                  <div className="relative min-w-[160px]">
                    <select
                      value={pvcTenantFilter}
                      onChange={(e) => setPvcTenantFilter(e.target.value)}
                      className="w-full h-8 pl-3 pr-8 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                    >
                      <option value="all">请选择租户</option>
                      {TENANT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* PVC 名称搜索输入框 */}
                  <div className="relative w-48 sm:w-60">
                    <input
                      type="text"
                      value={pvcSearchTerm}
                      onChange={(e) => setPvcSearchTerm(e.target.value)}
                      placeholder="请输入PVC名称"
                      className="w-full h-8 px-3 bg-white border border-slate-300 rounded text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    {pvcSearchTerm && (
                      <button
                        type="button"
                        onClick={() => setPvcSearchTerm('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* 添加 PVC 按钮 */}
                  <button
                    type="button"
                    onClick={() => setIsAddPvcModalOpen(true)}
                    className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-2xs flex items-center justify-center cursor-pointer"
                  >
                    添加PVC
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[160px]">
                    <select
                      value={s3TenantFilter}
                      onChange={(e) => setS3TenantFilter(e.target.value)}
                      className="w-full h-8 pl-3 pr-8 bg-white border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                    >
                      <option value="all">请选择租户</option>
                      {TENANT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="relative w-48 sm:w-60">
                    <input
                      type="text"
                      value={s3SearchTerm}
                      onChange={(e) => setS3SearchTerm(e.target.value)}
                      placeholder="请输入Bucket/存储桶名称"
                      className="w-full h-8 px-3 bg-white border border-slate-300 rounded text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    {s3SearchTerm && (
                      <button
                        type="button"
                        onClick={() => setS3SearchTerm('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddS3ModalOpen(true)}
                    className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-2xs flex items-center justify-center cursor-pointer"
                  >
                    添加S3存储桶
                  </button>
                </div>
              )}
            </div>

            {/* 存储管理下的子表格内容展示 */}
            {storageSubTab === 'pvc' ? (
              <>
                {/* PVC 数据表格（1:1 复刻截图中的 7 列与条目） */}
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                        <th className="py-3 px-4 w-[24%]">名称</th>
                        <th className="py-3 px-4 w-[16%]">类型</th>
                        <th className="py-3 px-4 w-[12%]">容量</th>
                        <th className="py-3 px-4 w-[10%]">状态</th>
                        <th className="py-3 px-4 w-[18%]">创建时间</th>
                        <th className="py-3 px-4 w-[10%]">租户</th>
                        <th className="py-3 px-4 w-[10%]">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredPvcList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            <HardDrive className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                            <p>未找到匹配的 PVC 记录</p>
                          </td>
                        </tr>
                      ) : (
                        filteredPvcList.slice(0, pvcPageSize).map((item) => {
                          const isBound = item.status === 'Bound';
                          const isPending = item.status === 'Pending';

                          return (
                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                              {/* 1. 名称（蓝色超链接样式） */}
                              <td className="py-3.5 px-4 font-normal">
                                <button
                                  type="button"
                                  onClick={() => setViewingPvc(item)}
                                  className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left font-mono"
                                  title="点击查看 PVC 详情与挂载状态"
                                >
                                  {item.name}
                                </button>
                              </td>

                              {/* 2. 类型 */}
                              <td className="py-3.5 px-4 text-slate-600 font-mono">
                                {item.type}
                              </td>

                              {/* 3. 容量 */}
                              <td className="py-3.5 px-4 text-slate-700 font-mono font-medium">
                                {item.capacity}
                              </td>

                              {/* 4. 状态（Bound 绿色圆角标签 / Pending 粉红圆角标签） */}
                              <td className="py-3.5 px-4">
                                {isBound ? (
                                  <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-[#eaf8f0] text-[#10b981]">
                                    Bound
                                  </span>
                                ) : isPending ? (
                                  <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-[#fef0f0] text-[#f56c6c]">
                                    Pending
                                  </span>
                                ) : (
                                  <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                    {item.status}
                                  </span>
                                )}
                              </td>

                              {/* 5. 创建时间 */}
                              <td className="py-3.5 px-4 text-slate-600 font-mono">
                                {item.createdAt}
                              </td>

                              {/* 6. 租户 */}
                              <td className="py-3.5 px-4 text-slate-600">
                                {item.tenant}
                              </td>

                              {/* 7. 操作（更新 蓝色 / 删除 红色） */}
                              <td className="py-3.5 px-4 space-x-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPvc(item);
                                    setEditCapacityNumber(item.capacity.split(' ')[0] || '50');
                                    setEditDescription(item.description || '');
                                  }}
                                  className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                >
                                  更新
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingPvc(item)}
                                  className="text-[#f56c6c] hover:text-red-700 hover:underline cursor-pointer"
                                >
                                  删除
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 分页组件（1:1 复刻截图右下角） */}
                <div className="flex items-center justify-end space-x-3 pt-2 text-xs text-slate-500">
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      disabled={pvcCurrentPage <= 1}
                      onClick={() => setPvcCurrentPage(p => Math.max(1, p - 1))}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      className="w-6 h-6 rounded flex items-center justify-center font-bold text-blue-600 bg-blue-50 border border-blue-200 cursor-pointer"
                    >
                      1
                    </button>

                    <button
                      type="button"
                      disabled={true}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 10条/页 下拉 */}
                  <div className="relative">
                    <select
                      value={pvcPageSize}
                      onChange={(e) => setPvcPageSize(Number(e.target.value))}
                      className="h-6 pl-2 pr-6 bg-white border border-slate-200 rounded text-xs text-slate-600 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                    >
                      <option value={10}>10条/页</option>
                      <option value={20}>20条/页</option>
                      <option value={50}>50条/页</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </>
            ) : (
              /* S3 数据表格 */
              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                      <th className="py-3 px-4 w-[22%]">Bucket名称</th>
                      <th className="py-3 px-4 w-[20%]">服务端点 (Endpoint)</th>
                      <th className="py-3 px-4 w-[12%]">访问权限 (ACL)</th>
                      <th className="py-3 px-4 w-[14%]">已用容量 / 对象数</th>
                      <th className="py-3 px-4 w-[10%]">状态</th>
                      <th className="py-3 px-4 w-[12%]">所属租户</th>
                      <th className="py-3 px-4 w-[10%]">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredS3List.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <Cloud className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          <p>未找到匹配的 S3 存储桶记录</p>
                        </td>
                      </tr>
                    ) : (
                      filteredS3List.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-medium text-slate-900 flex items-center space-x-1.5">
                            <Cloud className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{item.name}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-mono">
                            {item.endpoint}
                          </td>
                          <td className="py-3.5 px-4">
                            {renderS3AclBadge(item.acl)}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-mono">
                            <span>{item.usedCapacity}</span>
                            <span className="text-slate-400 text-[11px] ml-1.5">({item.objectCount.toLocaleString()} 对象)</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-[#eaf8f0] text-[#10b981]">
                              Active
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {item.tenant}
                          </td>
                          <td className="py-3.5 px-4 space-x-3">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingS3(item);
                                setEditS3Acl(item.acl);
                                setEditS3Description(item.description || '');
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            >
                              配置
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setS3List(s3List.filter(s => s.id !== item.id));
                                showToast(`已删除 S3 存储桶「${item.name}」。`);
                              }}
                              className="text-[#f56c6c] hover:text-red-700 hover:underline cursor-pointer"
                            >
                              删除
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
        )}

        {/* ======================================================== */}
        {/* Tab 3: 模型仓库视图 */}
        {/* ======================================================== */}
        {activeTab === 'models' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">模型仓库</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  集中管理大语言模型（LLM）、视觉多模态大模型基座与微调 Checkpoints 权重
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast('导入模型功能已就绪，支持从 HuggingFace / ModelScope / 本地 PVC 导入。')}
                className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-2xs flex items-center space-x-1.5 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>导入模型权重</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {[
                { name: 'DeepSeek-V3-Base', framework: 'PyTorch / Safetensors', size: '671B (MoE)', tenant: 'venus-prod', status: 'Ready', format: 'FP8' },
                { name: 'Qwen2.5-72B-Instruct', framework: 'vLLM / PyTorch', size: '72B', tenant: 'new-api', status: 'Ready', format: 'BF16' },
                { name: 'Llama-3.3-70B-Instruct', framework: 'PyTorch', size: '70B', tenant: 'liuzhao', status: 'Ready', format: 'BF16' },
              ].map((model, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Box className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-slate-900 text-xs font-mono">{model.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                      {model.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex justify-between"><span>参数规模:</span><span className="font-mono text-slate-700">{model.size}</span></div>
                    <div className="flex justify-between"><span>格式架构:</span><span className="font-mono text-slate-700">{model.format}</span></div>
                    <div className="flex justify-between"><span>所属租户:</span><span className="text-slate-700">{model.tenant}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* Tab 4: 数据集视图 */}
        {/* ======================================================== */}
        {activeTab === 'datasets' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">数据集</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  用于预训练、SFT 指令微调与 RLHF 偏好对齐的数据集资产管理
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast('数据集上传已打开。')}
                className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-2xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新建数据集</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {[
                { name: 'financial-sft-corpus-v3', records: '2,450,000 条', size: '14.2 GB', format: 'JSONL', tenant: 'venus-prod' },
                { name: 'math-reasoning-gsm8k-zh', records: '480,000 条', size: '3.1 GB', format: 'Parquet', tenant: 'new-api' },
                { name: 'code-instruct-python-v1', records: '1,120,000 条', size: '8.6 GB', format: 'JSONL', tenant: 'test-suite' },
              ].map((ds, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-3 shadow-2xs">
                  <div className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold text-slate-900 text-xs font-mono">{ds.name}</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex justify-between"><span>样本记录数:</span><span className="font-mono text-slate-700">{ds.records}</span></div>
                    <div className="flex justify-between"><span>存储大小:</span><span className="font-mono text-slate-700">{ds.size}</span></div>
                    <div className="flex justify-between"><span>文件格式:</span><span className="font-mono text-slate-700">{ds.format}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* Tab 5: 镜像仓库视图 */}
        {/* ======================================================== */}
        {activeTab === 'images' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">镜像仓库</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  算法训练开发机基础环境、vLLM 推理引擎与 Triton 容器镜像托管
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast('镜像推送凭证生成完毕：docker login registry.ai-cloud.internal')}
                className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-2xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>构建/推送镜像</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {[
                { image: 'pytorch-2.5-cuda12.4-cudnn9', tag: 'v2.5.1-devel', arch: 'x86_64 / NVIDIA', size: '12.4 GB', downloads: 1420 },
                { image: 'vllm-openai-engine-v0.6.3', tag: 'latest-cuda12', arch: 'x86_64 / NVIDIA', size: '9.8 GB', downloads: 3500 },
                { image: 'deepspeed-megatron-lm-train', tag: 'v0.14.0-cu121', arch: 'x86_64 / NVIDIA', size: '15.1 GB', downloads: 890 },
              ].map((img, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-3 shadow-2xs">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-slate-900 text-xs font-mono">{img.image}</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex justify-between"><span>版本标签:</span><span className="font-mono text-blue-600">{img.tag}</span></div>
                    <div className="flex justify-between"><span>镜像大小:</span><span className="font-mono text-slate-700">{img.size}</span></div>
                    <div className="flex justify-between"><span>架构支持:</span><span className="text-slate-700">{img.arch}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 弹窗 1: 添加 PVC 对话框 */}
      {/* ======================================================== */}
      {isAddPvcModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsAddPvcModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">添加持久化存储卷声明 (PVC)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPvcModalOpen(false)}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPvcSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  PVC 名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如: model-cache-storage-01"
                  value={newPvcForm.name}
                  onChange={(e) => setNewPvcForm({ ...newPvcForm, name: e.target.value })}
                  className="w-full h-8 px-3 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">仅支持小写字母、数字和连字符(-)</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    所属租户 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newPvcForm.tenant}
                    onChange={(e) => setNewPvcForm({ ...newPvcForm, tenant: e.target.value })}
                    className="w-full h-8 px-3 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    {TENANT_OPTIONS.filter(t => t.value !== 'all').map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    存储类型 (StorageClass) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newPvcForm.type}
                    onChange={(e) => setNewPvcForm({ ...newPvcForm, type: e.target.value })}
                    className="w-full h-8 px-3 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                  >
                    <option value="nfs-client">nfs-client (共享文件存储)</option>
                    <option value="rook-ceph-block">rook-ceph-block (Ceph高IOPS块存储)</option>
                    <option value="local-path">local-path (本地高速SSD)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    申请容量大小 <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      required
                      min="1"
                      value={newPvcForm.capacityNumber}
                      onChange={(e) => setNewPvcForm({ ...newPvcForm, capacityNumber: e.target.value })}
                      className="w-full h-8 px-3 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <select
                      value={newPvcForm.capacityUnit}
                      onChange={(e) => setNewPvcForm({ ...newPvcForm, capacityUnit: e.target.value })}
                      className="w-20 h-8 px-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                    >
                      <option value="Gi">Gi</option>
                      <option value="Ti">Ti</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    访问模式 (AccessMode)
                  </label>
                  <select
                    value={newPvcForm.accessMode}
                    onChange={(e) => setNewPvcForm({ ...newPvcForm, accessMode: e.target.value as any })}
                    className="w-full h-8 px-3 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                  >
                    <option value="ReadWriteMany">ReadWriteMany (多节点读写)</option>
                    <option value="ReadWriteOnce">ReadWriteOnce (单节点读写)</option>
                    <option value="ReadOnlyMany">ReadOnlyMany (多节点只读)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">存储描述 / 备注</label>
                <textarea
                  rows={2}
                  placeholder="用于描述该存储卷的使用业务场景..."
                  value={newPvcForm.description}
                  onChange={(e) => setNewPvcForm({ ...newPvcForm, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddPvcModalOpen(false)}
                  className="h-8 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="h-8 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer"
                >
                  确认添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 弹窗 2: 更新 PVC 容量 */}
      {/* ======================================================== */}
      {editingPvc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setEditingPvc(null)}
        >
          <div
            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900">更新 PVC 容量与配置</h3>
              <button
                type="button"
                onClick={() => setEditingPvc(null)}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdatePvcSubmit} className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1 text-[11px]">
                <div className="flex justify-between"><span className="text-slate-400">PVC 名称:</span><span className="font-mono font-bold text-slate-800">{editingPvc.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">当前存储类型:</span><span className="font-mono text-slate-700">{editingPvc.type}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">所属租户:</span><span className="text-slate-700">{editingPvc.tenant}</span></div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  扩容后容量 (Gi) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editCapacityNumber}
                  onChange={(e) => setEditCapacityNumber(e.target.value)}
                  className="w-full h-8 px-3 border border-slate-300 rounded text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">云原生存储卷支持在线动态扩容（只增不减）</p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">备注说明</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingPvc(null)}
                  className="h-8 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="h-8 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer"
                >
                  确认更新
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 弹窗 3: 删除 PVC 确认 */}
      {/* ======================================================== */}
      {deletingPvc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setDeletingPvc(null)}
        >
          <div
            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">确定要删除该 PVC 吗？</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    即将删除存储卷声明 <strong className="font-mono text-slate-900">「{deletingPvc.name}」</strong>。
                    如果底层 StorageClass 的回收策略为 Delete，存储在卷中的数据将永久丢失，且无法恢复。
                  </p>
                </div>
              </div>

              <div className="p-3 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] space-y-0.5">
                <div>· 关联租户: {deletingPvc.tenant}</div>
                <div>· 存储容量: {deletingPvc.capacity} ({deletingPvc.type})</div>
                <div>· 当前状态: {deletingPvc.status}</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setDeletingPvc(null)}
                className="h-8 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePvc}
                className="h-8 px-5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-medium cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 弹窗 4: 查看 PVC 详情 */}
      {/* ======================================================== */}
      {viewingPvc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setViewingPvc(null)}
        >
          <div
            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">PVC 详情 — {viewingPvc.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingPvc(null)}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400">状态 (Status)</div>
                  <div className="font-bold text-emerald-600 mt-0.5">{viewingPvc.status}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400">申请容量 (Capacity)</div>
                  <div className="font-bold font-mono text-slate-800 mt-0.5">{viewingPvc.capacity}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400">存储类 (StorageClass)</div>
                  <div className="font-mono text-slate-700 mt-0.5">{viewingPvc.type}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400">访问模式 (AccessMode)</div>
                  <div className="font-mono text-slate-700 mt-0.5">{viewingPvc.accessMode || 'ReadWriteMany'}</div>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3 text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">所属租户:</span>
                  <span className="font-medium text-slate-800">{viewingPvc.tenant}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">绑定的物理卷 (PV):</span>
                  <span className="font-mono text-blue-600">{viewingPvc.volumeName || 'pv-' + viewingPvc.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">挂载 Pod 实例数:</span>
                  <span className="font-mono text-slate-800">{viewingPvc.boundPodsCount ?? 2} 个 Pod 正在使用</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">创建时间:</span>
                  <span className="font-mono text-slate-800">{viewingPvc.createdAt}</span>
                </div>
                <div className="py-1">
                  <span className="text-slate-400 block mb-1">描述信息:</span>
                  <span className="text-slate-600">{viewingPvc.description || '无详细描述'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingPvc(null)}
                className="h-8 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 弹窗 5: 添加 S3 存储桶 */}
      {/* ======================================================== */}
      {isAddS3ModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsAddS3ModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center space-x-2">
                <Cloud className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">创建 S3 兼容对象存储桶 (Bucket)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddS3ModalOpen(false)}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddS3Submit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Bucket 存储桶名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如: training-checkpoints-2026"
                  value={newS3Form.name}
                  onChange={(e) => setNewS3Form({ ...newS3Form, name: e.target.value })}
                  className="w-full h-8 px-3 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">全局唯一，仅限小写字母、数字与中划线</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    所属租户 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newS3Form.tenant}
                    onChange={(e) => setNewS3Form({ ...newS3Form, tenant: e.target.value })}
                    className="w-full h-8 px-3 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    {TENANT_OPTIONS.filter(t => t.value !== 'all').map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    存储权限 (ACL)
                  </label>
                  <select
                    value={newS3Form.acl}
                    onChange={(e) => setNewS3Form({ ...newS3Form, acl: e.target.value as any })}
                    className="w-full h-8 px-3 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-500 font-sans"
                  >
                    <option value="private">私有 (仅凭据授权访问)</option>
                    <option value="public-read">公共读 (公开匿名可读，授权写入)</option>
                    <option value="public-read-write">公共读写 (完全公开，允许匿名读写)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">存储桶描述</label>
                <textarea
                  rows={2}
                  placeholder="用于描述该 S3 存储桶所存放的文件类型或业务..."
                  value={newS3Form.description}
                  onChange={(e) => setNewS3Form({ ...newS3Form, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddS3ModalOpen(false)}
                  className="h-8 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="h-8 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer"
                >
                  确认创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 弹窗 6: S3 存储桶配置与权限修改 */}
      {/* ======================================================== */}
      {editingS3 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setEditingS3(null)}
        >
          <div
            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center space-x-2">
                <Cloud className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">配置 S3 存储桶: {editingS3.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingS3(null)}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateS3Submit} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">服务端点 (Endpoint):</span>
                  <span className="font-mono text-slate-800 font-medium">{editingS3.endpoint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">所属租户:</span>
                  <span className="text-slate-800">{editingS3.tenant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">已用容量 / 对象:</span>
                  <span className="font-mono text-slate-800">{editingS3.usedCapacity} ({editingS3.objectCount.toLocaleString()} 对象)</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  存储权限 (ACL) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={editS3Acl}
                  onChange={(e) => setEditS3Acl(e.target.value as any)}
                  className="w-full h-8 px-3 border border-slate-300 rounded text-slate-800 focus:outline-none focus:border-blue-500 font-sans cursor-pointer"
                >
                  <option value="private">私有 (仅凭据授权访问)</option>
                  <option value="public-read">公共读 (公开匿名可读，授权写入)</option>
                  <option value="public-read-write">公共读写 (完全公开，允许匿名读写)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  {editS3Acl === 'private' && '🔒 私有：必须使用租户分配的 AccessKey/SecretKey 签名后方可读取与上传。'}
                  {editS3Acl === 'public-read' && '🌐 公共读：允许通过标准 HTTP/S3 URL 匿名只读下载文件，写操作需凭据。'}
                  {editS3Acl === 'public-read-write' && '⚠️ 公共读写：完全公开读写，任何人均可下载与上传对象，适用于公共缓存或共享测试。'}
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">存储桶描述</label>
                <textarea
                  rows={2}
                  placeholder="修改存储桶描述..."
                  value={editS3Description}
                  onChange={(e) => setEditS3Description(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingS3(null)}
                  className="h-8 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="h-8 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer"
                >
                  保存配置
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
