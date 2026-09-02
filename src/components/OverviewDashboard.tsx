import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Layers,
  HardDrive,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlayCircle,
  PauseCircle,
  TrendingUp,
  Users,
  Server,
  Zap,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Filter,
  Info
} from 'lucide-react';
import { Region, UserProfile } from '../types';

interface OverviewDashboardProps {
  activeRegion: Region;
  user: UserProfile;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ activeRegion }) => {
  const [selectedTaskCategory, setSelectedTaskCategory] = useState<string>('all');
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  // Mock slot topology data (32 slots in Cluster Block 1)
  const slotsData = Array.from({ length: 32 }, (_, i) => {
    const slotId = i + 1;
    if ([1, 2, 3, 4].includes(slotId)) {
      return { id: slotId, type: 'training', label: `Slot ${slotId}`, taskName: `train-llama3-7b-job-#08`, owner: 'LLM算法组', gpuMem: '22.4 GB / 24 GB', status: 'Running' };
    }
    if ([5, 6, 7].includes(slotId)) {
      return { id: slotId, type: 'dev', label: `Slot ${slotId}`, taskName: `dev-jupyter-notebook-03`, owner: '视觉研发部', gpuMem: '8.1 GB / 24 GB', status: 'Running' };
    }
    if ([8, 9, 10, 11, 12, 13, 14].includes(slotId)) {
      return { id: slotId, type: 'inference', label: `Slot ${slotId}`, taskName: `inf-qwen2-72b-vllm`, owner: '搜索推荐团队', gpuMem: '23.8 GB / 24 GB', status: 'Active' };
    }
    return { id: slotId, type: 'idle', label: `Slot ${slotId}`, taskName: '无任务 (闲置可调度)', owner: '-', gpuMem: '0 GB / 24 GB', status: 'Idle' };
  });

  const getSlotColor = (type: string) => {
    switch (type) {
      case 'training': return 'bg-emerald-500 hover:bg-emerald-600 text-white';
      case 'dev': return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'inference': return 'bg-purple-500 hover:bg-purple-600 text-white';
      default: return 'bg-slate-200 hover:bg-slate-300 text-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. 任务概览 (Task Dimension Overview) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">任务概览</h2>
          </div>
          <span className="text-[11px] text-slate-400">实时任务队列监控 · 每 5 秒自动同步</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: 训练任务 */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <PlayCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-800">训练任务</span>
              </div>
              <span className="text-[11px] text-indigo-600 font-medium hover:underline cursor-pointer">列表</span>
            </div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-xs text-slate-500">占用总卡数</span>
              <span className="text-2xl font-bold font-mono text-slate-900">5</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center pt-2 border-t border-slate-100/80">
              <div className="bg-slate-50 p-1.5 rounded">
                <div className="text-[10px] text-slate-400">总量</div>
                <div className="text-xs font-bold font-mono text-slate-800 mt-0.5">5</div>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-100/60 p-1.5 rounded">
                <div className="text-[10px] text-emerald-700 font-medium">运行中</div>
                <div className="text-xs font-bold font-mono text-emerald-700 mt-0.5">1</div>
              </div>
              <div className="bg-amber-50/70 border border-amber-100/60 p-1.5 rounded">
                <div className="text-[10px] text-amber-700 font-medium">排队中</div>
                <div className="text-xs font-bold font-mono text-amber-700 mt-0.5">4</div>
              </div>
            </div>
          </div>

          {/* Card 2: 开发机 */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Server className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-800">开发机</span>
              </div>
              <span className="text-[11px] text-indigo-600 font-medium hover:underline cursor-pointer">列表</span>
            </div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-xs text-slate-500">占用总卡数</span>
              <span className="text-2xl font-bold font-mono text-slate-900">7</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center pt-2 border-t border-slate-100/80">
              <div className="bg-slate-50 p-1.5 rounded">
                <div className="text-[10px] text-slate-400">总量</div>
                <div className="text-xs font-bold font-mono text-slate-800 mt-0.5">7</div>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-100/60 p-1.5 rounded">
                <div className="text-[10px] text-emerald-700 font-medium">运行中</div>
                <div className="text-xs font-bold font-mono text-emerald-700 mt-0.5">4</div>
              </div>
              <div className="bg-amber-50/70 border border-amber-100/60 p-1.5 rounded">
                <div className="text-[10px] text-amber-700 font-medium">排队中</div>
                <div className="text-xs font-bold font-mono text-amber-700 mt-0.5">3</div>
              </div>
            </div>
          </div>

          {/* Card 3: 推理服务 */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-800">推理服务</span>
              </div>
              <span className="text-[11px] text-indigo-600 font-medium hover:underline cursor-pointer">列表</span>
            </div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-xs text-slate-500">占用总卡数</span>
              <span className="text-2xl font-bold font-mono text-slate-900">6</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center pt-2 border-t border-slate-100/80">
              <div className="bg-slate-50 p-1.5 rounded">
                <div className="text-[10px] text-slate-400">总量</div>
                <div className="text-xs font-bold font-mono text-slate-800 mt-0.5">6</div>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-100/60 p-1.5 rounded">
                <div className="text-[10px] text-emerald-700 font-medium">运行中</div>
                <div className="text-xs font-bold font-mono text-emerald-700 mt-0.5">1</div>
              </div>
              <div className="bg-amber-50/70 border border-amber-100/60 p-1.5 rounded">
                <div className="text-[10px] text-amber-700 font-medium">排队中</div>
                <div className="text-xs font-bold font-mono text-amber-700 mt-0.5">5</div>
              </div>
            </div>
          </div>

          {/* Card 4: 模型微调 */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-800">模型微调</span>
              </div>
              <span className="text-[11px] text-indigo-600 font-medium hover:underline cursor-pointer">列表</span>
            </div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-xs text-slate-500">占用总卡数</span>
              <span className="text-2xl font-bold font-mono text-slate-900">0</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center pt-2 border-t border-slate-100/80">
              <div className="bg-slate-50 p-1.5 rounded">
                <div className="text-[10px] text-slate-400">总量</div>
                <div className="text-xs font-bold font-mono text-slate-800 mt-0.5">0</div>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-100/60 p-1.5 rounded">
                <div className="text-[10px] text-emerald-700 font-medium">运行中</div>
                <div className="text-xs font-bold font-mono text-emerald-700 mt-0.5">0</div>
              </div>
              <div className="bg-amber-50/70 border border-amber-100/60 p-1.5 rounded">
                <div className="text-[10px] text-amber-700 font-medium">排队中</div>
                <div className="text-xs font-bold font-mono text-amber-700 mt-0.5">0</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 节点与 GPU 服务器信息 (Merged Node & GPU Server Metrics - Pure Data) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">节点与 GPU 服务器信息</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* Node Metrics */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
            <div className="text-[11px] text-slate-400 mb-0.5">节点总数</div>
            <div className="text-xl font-bold font-mono text-slate-900">1</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-1">● 可调度: 1</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
            <div className="text-[11px] text-slate-400 mb-0.5">节点就绪</div>
            <div className="text-xl font-bold font-mono text-emerald-600">1</div>
            <div className="text-[10px] text-slate-400 mt-1">Ready</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
            <div className="text-[11px] text-slate-400 mb-0.5">节点未就绪</div>
            <div className="text-xl font-bold font-mono text-slate-700">0</div>
            <div className="text-[10px] text-slate-400 mt-1">Not Ready</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
            <div className="text-[11px] text-slate-400 mb-0.5">不可调度节点</div>
            <div className="text-xl font-bold font-mono text-slate-700">0</div>
            <div className="text-[10px] text-slate-400 mt-1">Unschedulable</div>
          </div>

          {/* GPU Metrics */}
          <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/80 text-center">
            <div className="text-[11px] text-indigo-600/80 mb-0.5 font-medium">GPU 服务器</div>
            <div className="text-xl font-bold font-mono text-indigo-900">1 台</div>
            <div className="text-[10px] text-indigo-600 mt-1">PCIe-24GB</div>
          </div>
          <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/80 text-center">
            <div className="text-[11px] text-indigo-600/80 mb-0.5 font-medium">GPU 总卡数</div>
            <div className="text-xl font-bold font-mono text-indigo-900">32 卡</div>
            <div className="text-[10px] text-indigo-600 mt-1">物理集群卡槽</div>
          </div>
          <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/80 text-center">
            <div className="text-[11px] text-emerald-700 mb-0.5 font-medium">已分配 / 运行中</div>
            <div className="text-xl font-bold font-mono text-emerald-700">14 卡</div>
            <div className="text-[10px] text-emerald-600 mt-1">占用率 43.8%</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
            <div className="text-[11px] text-slate-400 mb-0.5">闲置卡数</div>
            <div className="text-xl font-bold font-mono text-slate-800">18 卡</div>
            <div className="text-[10px] text-slate-400 mt-1">显存利用率 43.8%</div>
          </div>
        </div>
      </div>

      {/* 3. 租户 GPU 使用明细 & 租户 PVC 使用明细 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 租户 GPU 使用明细 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-800">租户 GPU 使用明细</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">算力配额与真实利用率</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium">
                  <th className="pb-2 font-normal">租户名称</th>
                  <th className="pb-2 font-normal text-right">租户算力配额</th>
                  <th className="pb-2 font-normal text-right">占用率</th>
                  <th className="pb-2 font-normal text-right">利用率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 text-slate-700">
                <tr>
                  <td className="py-2.5 font-medium text-slate-900">LLM 大模型算法组</td>
                  <td className="py-2.5 text-right font-mono">16 卡 (50.0%)</td>
                  <td className="py-2.5 text-right">
                    <span className="font-mono font-medium text-indigo-600">75.0%</span>
                    <span className="text-[10px] text-slate-400 ml-1">(12卡)</span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      88.2%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-slate-900">搜索推荐算法团队</td>
                  <td className="py-2.5 text-right font-mono">8 卡 (25.0%)</td>
                  <td className="py-2.5 text-right">
                    <span className="font-mono font-medium text-indigo-600">100.0%</span>
                    <span className="text-[10px] text-slate-400 ml-1">(8卡)</span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      92.5%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-slate-900">计算机视觉研发部</td>
                  <td className="py-2.5 text-right font-mono">4 卡 (12.5%)</td>
                  <td className="py-2.5 text-right">
                    <span className="font-mono font-medium text-indigo-600">100.0%</span>
                    <span className="text-[10px] text-slate-400 ml-1">(4卡)</span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                      45.0%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-slate-900">自动驾驶感知组</td>
                  <td className="py-2.5 text-right font-mono">4 卡 (12.5%)</td>
                  <td className="py-2.5 text-right">
                    <span className="font-mono font-medium text-slate-400">0.0%</span>
                    <span className="text-[10px] text-slate-400 ml-1">(0卡)</span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-100 text-slate-500">
                      0.0%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 租户 PVC 使用明细 */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">租户 PVC 使用明细</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">持久卷存储容量监控</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium">
                  <th className="pb-2 font-normal">租户名称</th>
                  <th className="pb-2 font-normal text-right">租户 PVC 配额</th>
                  <th className="pb-2 font-normal text-right">占用率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 text-slate-700">
                <tr>
                  <td className="py-2.5 font-medium text-slate-900">LLM 大模型算法组</td>
                  <td className="py-2.5 text-right font-mono">20 TB (50.0%)</td>
                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: '78.5%' }} />
                      </div>
                      <span className="font-mono font-medium text-blue-600">78.5%</span>
                      <span className="text-[10px] text-slate-400">(15.7 TB)</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-slate-900">搜索推荐算法团队</td>
                  <td className="py-2.5 text-right font-mono">10 TB (25.0%)</td>
                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: '54.2%' }} />
                      </div>
                      <span className="font-mono font-medium text-blue-600">54.2%</span>
                      <span className="text-[10px] text-slate-400">(5.42 TB)</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-slate-900">计算机视觉研发部</td>
                  <td className="py-2.5 text-right font-mono">6 TB (15.0%)</td>
                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '82.0%' }} />
                      </div>
                      <span className="font-mono font-medium text-amber-600">82.0%</span>
                      <span className="text-[10px] text-slate-400">(4.92 TB)</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-slate-900">自动驾驶感知组</td>
                  <td className="py-2.5 text-right font-mono">4 TB (10.0%)</td>
                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                        <div className="bg-slate-300 h-full rounded-full" style={{ width: '18.0%' }} />
                      </div>
                      <span className="font-mono font-medium text-slate-500">18.0%</span>
                      <span className="text-[10px] text-slate-400">(0.72 TB)</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. 任务拓扑 / 卡槽映射 (Task Slot Topology Map) */}
      <section className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>任务拓扑</span>
            </h3>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">图例:</span>
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>训练任务</span>
            </span>
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>开发机</span>
            </span>
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>推理服务</span>
            </span>
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span>闲置</span>
            </span>
          </div>
        </div>

        {/* Slot Grid matching reference */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="text-xs font-mono font-medium text-slate-500 mb-2">
            block1 (NVIDIA PCIE-24GB)
          </div>

          <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
            {slotsData.map((slot) => (
              <div
                key={slot.id}
                onMouseEnter={() => setHoveredSlot(slot.id)}
                onMouseLeave={() => setHoveredSlot(null)}
                className={`h-12 rounded flex flex-col items-center justify-between p-1 text-[10px] font-mono cursor-pointer transition-all ${getSlotColor(slot.type)} relative group`}
              >
                <span className="truncate max-w-full text-[9px] opacity-80">{slot.id <= 4 ? 'Train' : slot.id <= 7 ? 'Dev' : slot.id <= 14 ? 'Inf' : 'Idle'}</span>
                <span className="font-bold">slot{slot.id}</span>

                {/* Popover Tooltip on Hover */}
                {hoveredSlot === slot.id && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-slate-900 text-slate-100 p-2.5 rounded-lg shadow-xl z-50 text-[11px] font-sans pointer-events-none border border-slate-700">
                    <div className="font-bold border-b border-slate-700 pb-1 mb-1 text-emerald-400">
                      Slot {slot.id} 详情
                    </div>
                    <div className="space-y-0.5 text-[10px]">
                      <div><span className="text-slate-400">任务:</span> {slot.taskName}</div>
                      <div><span className="text-slate-400">所属部门:</span> {slot.owner}</div>
                      <div><span className="text-slate-400">显存使用:</span> {slot.gpuMem}</div>
                      <div><span className="text-slate-400">状态:</span> {slot.status}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
