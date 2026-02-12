import { AIProvider, AIProviderConfig } from '../types';

export interface GenerationResponse {
  text: string;
  error?: string;
}

export class AIProviderService {
  private providers: Map<string, AIProviderConfig> = new Map();

  constructor() {
    this.loadProvidersFromStorage();
  }

  private loadProvidersFromStorage() {
    const stored = localStorage.getItem('ai-providers');
    if (stored) {
      const data = JSON.parse(stored);
      data.providers.forEach((p: AIProviderConfig) => {
        this.providers.set(p.provider, p);
      });
    }
  }

  private saveProvidersToStorage() {
    const data = {
      providers: Array.from(this.providers.values()),
      selectedProvider: localStorage.getItem('selected-provider') || ''
    };
    localStorage.setItem('ai-providers', JSON.stringify(data));
  }

  addProvider(config: AIProviderConfig) {
    this.providers.set(config.provider, config);
    this.saveProvidersToStorage();
  }

  removeProvider(provider: AIProvider) {
    this.providers.delete(provider);
    this.saveProvidersToStorage();
  }

  getProvider(provider: AIProvider): AIProviderConfig | undefined {
    return this.providers.get(provider);
  }

  getAllProviders(): AIProviderConfig[] {
    return Array.from(this.providers.values());
  }

  setSelectedProvider(provider: AIProvider) {
    localStorage.setItem('selected-provider', provider);
  }

  getSelectedProvider(): AIProviderConfig | undefined {
    const selected = localStorage.getItem('selected-provider') as AIProvider;
    if (selected) {
      return this.providers.get(selected);
    }
    return undefined;
  }

  async generateText(prompt: string): Promise<GenerationResponse> {
    const config = this.getSelectedProvider();
    if (!config) {
      return { text: '', error: '请先在设置中配置 API Key' };
    }

    try {
      switch (config.provider) {
        case 'openai':
          return await this.generateWithOpenAI(config, prompt);
        case 'anthropic':
          return await this.generateWithAnthropic(config, prompt);
        case 'zhipu':
          return await this.generateWithZhipu(config, prompt);
        case 'volcengine':
          return await this.generateWithVolcengine(config, prompt);
        case 'gemini':
          return await this.generateWithGemini(config, prompt);
        default:
          return { text: '', error: '不支持的供应商' };
      }
    } catch (error) {
      console.error('Generation error:', error);
      return { text: '', error: error instanceof Error ? error.message : '生成失败' };
    }
  }

  private async generateWithOpenAI(config: AIProviderConfig, prompt: string): Promise<GenerationResponse> {
    const baseUrl = config.baseUrl || 'https://api.openai.com/v1';
    const model = config.modelName || 'gpt-3.5-turbo';

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的文案生成助手，擅长生成唯美、情感、励志的短句。请直接返回文案，不要添加其他说明。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    return { text };
  }

  private async generateWithAnthropic(config: AIProviderConfig, prompt: string): Promise<GenerationResponse> {
    const baseUrl = config.baseUrl || 'https://api.anthropic.com';
    const model = config.modelName || 'claude-3-haiku-20240307';

    const response = await fetch(`${baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 500,
        system: '你是一个专业的文案生成助手，擅长生成唯美、情感、励志的短句。请直接返回文案，不要添加其他说明。',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${error}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    return { text };
  }

  private async generateWithZhipu(config: AIProviderConfig, prompt: string): Promise<GenerationResponse> {
    const baseUrl = config.baseUrl || 'https://open.bigmodel.cn/api/paas/v4';
    const model = config.modelName || 'glm-4-flash';

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的文案生成助手，擅长生成唯美、情感、励志的短句。请直接返回文案，不要添加其他说明。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Zhipu API error: ${error}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    return { text };
  }

  private async generateWithVolcengine(config: AIProviderConfig, prompt: string): Promise<GenerationResponse> {
    const baseUrl = config.baseUrl || 'https://ark.cn-beijing.volces.com/api/v3';
    const modelName = config.modelName || 'ep-20241001000000-xxxxx';

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的文案生成助手，擅长生成唯美、情感、励志的短句。请直接返回文案，不要添加其他说明。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Volcengine API error: ${error}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';
    return { text };
  }

  private async generateWithGemini(config: AIProviderConfig, prompt: string): Promise<GenerationResponse> {
    const baseUrl = config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta';
    const model = config.modelName || 'models/gemini-pro';

    const response = await fetch(`${baseUrl}/${model}:generateContent?key=${config.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `你是一个专业的文案生成助手，擅长生成唯美、情感、励志的短句。请直接返回文案，不要添加其他说明。\n\n${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 500
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return { text };
  }
}

export const generateContentWithProvider = async (provider: AIProvider, config: AIProviderConfig, prompt: string): Promise<string> => {
  const service = new AIProviderService();
  service.addProvider(config);
  service.setSelectedProvider(provider);
  const result = await service.generateText(prompt);
  if (result.error) {
    throw new Error(result.error);
  }
  return result.text;
};
