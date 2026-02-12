<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/10bnroZyUBFXxKM8YMoQvjkgk2xtZVc62

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`
3. Open http://localhost:3000 in your browser

## Configure AI Providers

This application supports multiple AI providers. Click the Settings icon (⚙️) in the top-right corner to configure:

### Supported Providers

1. **OpenAI**
   - Base URL: `https://api.openai.com/v1` (default)
   - Model: `gpt-3.5-turbo` (default)
   - Get API Key: https://platform.openai.com/api-keys

2. **Anthropic (Claude)**
   - Base URL: `https://api.anthropic.com` (default)
   - Model: `claude-3-haiku-20240307` (default)
   - Get API Key: https://console.anthropic.com/settings/keys

3. **智谱 AI (GLM)**
   - Base URL: `https://open.bigmodel.cn/api/paas/v4` (default)
   - Model: `glm-4-flash` (default)
   - Get API Key: https://open.bigmodel.cn/usercenter/apikeys

4. **火山引擎**
   - Base URL: `https://ark.cn-beijing.volces.com/api/v3` (default)
   - Model: 推理接入点 (需要在火山引擎控制台创建)
   - Get API Key & 接入点: https://www.volcengine.com/docs/82379/1541594
   - 注意: 火山引擎使用 `model_name` (推理接入点) 作为模型标识，而不是模型名称

5. **Google Gemini**
   - Model: `models/gemini-pro` (default)
   - Get API Key: https://aistudio.google.com/app/apikey

### Configuration Steps

1. Click the Settings icon (⚙️) in the top-right corner
2. Select a provider from the dropdown
3. Enter your API Key
4. Optionally customize Base URL and Model Name
5. Click "Save Configuration"
6. Click "Use" to select the provider for text generation

All configurations are saved in your browser's localStorage.

## Deploy to Vercel

Click the button below to deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDanZai233%2FMoodCard&project-name=moodcard&repository-name=moodcard)
