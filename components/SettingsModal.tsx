import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Eye, EyeOff, Check } from 'lucide-react';
import { AIProvider, AIProviderConfig } from '../types';
import { AIProviderService } from '../services/ai-provider.service';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigured: () => void;
}

interface ProviderInfo {
  name: string;
  defaultBaseUrl: string;
  defaultModel: string;
  placeholder: string;
  note?: string;
  models?: string[];
}

const PROVIDER_INFO: Record<AIProvider, ProviderInfo> = {
  openai: {
    name: 'OpenAI',
    defaultBaseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-3.5-turbo',
    placeholder: 'sk-...'
  },
  anthropic: {
    name: 'Anthropic (Claude)',
    defaultBaseUrl: 'https://api.anthropic.com',
    defaultModel: 'claude-3-haiku-20240307',
    placeholder: 'sk-ant-...'
  },
  zhipu: {
    name: '智谱 AI (GLM)',
    defaultBaseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    defaultModel: 'glm-4-flash',
    placeholder: '输入您的 API Key'
  },
  volcengine: {
    name: '火山引擎',
    defaultBaseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    defaultModel: 'doubao-1-5-pro-32k-250115',
    placeholder: '输入您的 API Key',
    note: '火山引擎使用推理接入点（Endpoint ID）作为模型标识，例如: doubao-1-5-pro-32k-250115',
    models: [
      'doubao-1-5-pro-32k-250115',
      'doubao-1-5-pro-4k-250115',
      'doubao-pro-32k-240515',
      'doubao-pro-4k-240515',
      'doubao-lite-32k-240515'
    ]
  },
  gemini: {
    name: 'Google Gemini',
    defaultBaseUrl: '',
    defaultModel: 'models/gemini-pro',
    placeholder: 'AIza...'
  }
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onConfigured }) => {
  const [providers, setProviders] = useState<AIProviderConfig[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openai');
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});
  const [editingProvider, setEditingProvider] = useState<Partial<AIProviderConfig>>({});

  const service = new AIProviderService();

  useEffect(() => {
    if (isOpen) {
      loadProviders();
    }
  }, [isOpen]);

  const loadProviders = () => {
    const loadedProviders = service.getAllProviders();
    setProviders(loadedProviders);
    const selected = service.getSelectedProvider();
    if (selected) {
      setSelectedProvider(selected.provider);
    }
  };

  const handleSaveProvider = () => {
    if (!editingProvider.provider || !editingProvider.apiKey) {
      alert('请填写供应商和 API Key');
      return;
    }

    const config: AIProviderConfig = {
      provider: editingProvider.provider as AIProvider,
      apiKey: editingProvider.apiKey,
      baseUrl: editingProvider.baseUrl || PROVIDER_INFO[editingProvider.provider as AIProvider].defaultBaseUrl,
      modelName: editingProvider.modelName || PROVIDER_INFO[editingProvider.provider as AIProvider].defaultModel
    };

    service.addProvider(config);
    loadProviders();
    setSelectedProvider(config.provider);
    setEditingProvider({});
    onConfigured();
  };

  const handleDeleteProvider = (provider: AIProvider) => {
    if (confirm('确定要删除这个配置吗？')) {
      service.removeProvider(provider);
      loadProviders();
    }
  };

  const handleSelectProvider = (provider: AIProvider) => {
    setSelectedProvider(provider);
    service.setSelectedProvider(provider);
  };

  const toggleShowApiKey = (provider: AIProvider) => {
    setShowApiKey(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const startEditing = (provider: AIProvider) => {
    const existing = providers.find(p => p.provider === provider);
    setEditingProvider(existing || { provider });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">AI 配置</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">已配置的供应商</label>
            {providers.length === 0 ? (
              <p className="text-sm text-slate-400">暂无配置，请添加 API Key</p>
            ) : (
              <div className="space-y-2">
                {providers.map((p) => (
                  <div
                    key={p.provider}
                    className={`p-4 border rounded-lg transition ${
                      selectedProvider === p.provider
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedProvider === p.provider && (
                          <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-800">
                            {PROVIDER_INFO[p.provider].name}
                          </div>
                          {p.modelName && (
                            <div className="text-xs text-slate-500">模型: {p.modelName}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleShowApiKey(p.provider)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {showApiKey[p.provider] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => handleSelectProvider(p.provider)}
                          className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded transition"
                        >
                          使用
                        </button>
                        <button
                          onClick={() => startEditing(p.provider)}
                          className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded transition"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteProvider(p.provider)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {showApiKey[p.provider] && (
                      <div className="mt-2 p-2 bg-slate-50 rounded text-xs font-mono break-all">
                        {p.apiKey}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-6">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Plus size={16} />
              添加新配置
            </label>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1">选择供应商</label>
                <select
                  value={editingProvider.provider || ''}
                  onChange={(e) => setEditingProvider({ ...editingProvider, provider: e.target.value as AIProvider })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">请选择...</option>
                  {Object.entries(PROVIDER_INFO).map(([key, info]) => (
                    <option key={key} value={key}>{info.name}</option>
                  ))}
                </select>
              </div>

              {editingProvider.provider && PROVIDER_INFO[editingProvider.provider as AIProvider] && (
                <>
                  {PROVIDER_INFO[editingProvider.provider as AIProvider].note && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                      {PROVIDER_INFO[editingProvider.provider as AIProvider].note}
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-slate-500 block mb-1">API Key</label>
                    <input
                      type="text"
                      value={editingProvider.apiKey || ''}
                      onChange={(e) => setEditingProvider({ ...editingProvider, apiKey: e.target.value })}
                      placeholder={PROVIDER_INFO[editingProvider.provider as AIProvider].placeholder}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Base URL (可选)</label>
                    <input
                      type="text"
                      value={editingProvider.baseUrl || PROVIDER_INFO[editingProvider.provider as AIProvider].defaultBaseUrl}
                      onChange={(e) => setEditingProvider({ ...editingProvider, baseUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 block mb-1">
                      Model Name / 推理接入点
                    </label>
                    {PROVIDER_INFO[editingProvider.provider as AIProvider].models ? (
                      <>
                        <select
                          value={editingProvider.modelName || PROVIDER_INFO[editingProvider.provider as AIProvider].defaultModel}
                          onChange={(e) => setEditingProvider({ ...editingProvider, modelName: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">请选择模型...</option>
                          {(PROVIDER_INFO[editingProvider.provider as AIProvider] as any).models.map((model: string) => (
                            <option key={model} value={model}>{model}</option>
                          ))}
                        </select>
                        <p className="text-[10px] text-slate-400 mt-1">
                          模型列表来源于火山引擎常用模型，您也可以手动输入其他推理接入点
                        </p>
                      </>
                    ) : (
                      <input
                        type="text"
                        value={editingProvider.modelName || PROVIDER_INFO[editingProvider.provider as AIProvider].defaultModel}
                        onChange={(e) => setEditingProvider({ ...editingProvider, modelName: e.target.value })}
                        placeholder={PROVIDER_INFO[editingProvider.provider as AIProvider].defaultModel}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                    )}
                  </div>

                  <button
                    onClick={handleSaveProvider}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
                  >
                    保存配置
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
