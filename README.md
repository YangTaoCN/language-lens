# Language Lens

这是一个基于 Next.js 的原型，用于从图片中识别外语文本并提供交互式翻译提示。

快速上手:

1. 安装依赖

```bash
npm install
```

2. 运行开发服务器

```bash
npm run dev
```

功能:
- 上传或拍照图片
- 基于 `tesseract.js` 的 OCR 文字识别
- 在图片上显示可点击的热区
- 点击热区后通过 `/api/translate` 获取翻译（演示使用 LibreTranslate）

Google 翻译集成:
- 若要使用 Google 高质量翻译，请在运行时设置 `GOOGLE_API_KEY` 环境变量（Google Cloud Translation API v2 key）。示例：

```bash
export GOOGLE_API_KEY="YOUR_GOOGLE_KEY"
npm run dev
```

当 `GOOGLE_API_KEY` 存在时，服务器端 `/api/translate` 会优先调用 Google 翻译，否则回退到 LibreTranslate（演示用）。

## Bug Reporting

We have a structured bug reporting process to track and fix issues efficiently.

### How to Report a Bug

**Option 1: Using the Bug Report Assistant Script**

```bash
chmod +x scripts/report-bug.sh
./scripts/report-bug.sh "Your bug description here"
```

The script will guide you through providing details and automatically document it.

**Option 2: Direct Report**

Simply tell me the bug in any language:
```
摄像头打开后看不到视频预览窗口
Camera video not displaying
```

I will:
1. ✅ Analyze and reproduce the bug
2. ✅ Implement the fix
3. ✅ Refine the description in English
4. ✅ Document it in `BUG_FIXES.md`
5. ✅ Commit to git

### Documented Bugs

See `BUG_FIXES.md` for complete history of reported and fixed bugs.

See `BUG_REPORTING_PROCESS.md` for detailed process documentation.

后续:
- 集成更好的 OCR 语言模型
- 使用高质量翻译/TTS 服务（Google/Azure/OpenAI）
- 添加生词本与历史记录
