# Language Lens - Bug Fix List

## 项目修复日志

### Bug #1: Internal Server Error 500 on localhost:3002
**日期**: 2026-03-02  
**严重级别**: 🔴 Critical  
**状态**: ✅ Fixed

#### 问题描述
- 访问 `http://localhost:3002/` 返回 HTTP 500 Internal Server Error
- 页面无法正常加载，显示"Internal Server Error"

#### 根本原因
两层问题：
1. **Next.js 不支持 `.cjs` Babel 配置** — Next.js Babel loader 报错："The Next.js Babel loader does not support .mjs or .cjs config files"
2. **缺失编译缓存** — 编译过程中找不到 `.next/fallback-build-manifest.json`，导致错误处理页面也加载失败，最终返回 500

#### 解决方案
- 将 `babel.config.cjs` 转换为 `babel.config.json`（内容完全相同，仅格式改变）
- 删除旧的 `babel.config.cjs` 以避免多配置文件冲突
- Next.js 重新编译后自动创建缺失的构建缓存文件

#### 提交信息
```
commit 7e547b9
fix: improve camera error handling with friendly error messages and state management
- Convert babel.config.cjs to babel.config.json to fix Next.js Babel loader compatibility
```

---

### Bug #2: 摄像头权限错误提示不友好
**日期**: 2026-03-02  
**严重级别**: 🟡 Medium  
**状态**: ✅ Fixed

#### 问题描述
- 用户点击"打开摄像头"按钮后，如果权限被拒绝或出现其他摄像头问题
- 系统显示简单的 `alert('无法访问摄像头')`，没有提供具体原因
- 用户无法判断是权限问题、硬件问题还是浏览器兼容性问题

#### 根本原因
- 代码中使用了泛用的 `alert()` 来捕获所有摄像头错误
- 没有区分不同的错误类型（NotAllowedError, NotFoundError, NotReadableError, SecurityError, TypeError）

#### 解决方案
- 添加 `cameraError` 状态来管理错误信息
- 检测并处理 5 种常见错误类型，提供具体的用户提示：
  - **NotAllowedError** → "摄像头权限被拒绝。请在浏览器设置中允许访问摄像头。"
  - **NotFoundError** → "未找到摄像头设备。请确保设备有摄像头。"
  - **NotReadableError** → "摄像头正在被另一个应用使用，请关闭后重试。"
  - **SecurityError** → "出于安全原因，无法访问摄像头。请使用 HTTPS 或 localhost。"
  - **TypeError** → "您的浏览器不支持摄像头功能。"
- 将错误从 `alert()` 改为红色警告框显示（`bg-red-100 border-red-400 text-red-700`）
- 关闭摄像头时自动清除错误消息

#### 提交信息
```
commit 7e547b9
fix: improve camera error handling with friendly error messages and state management
- Add cameraError state to display specific error reasons instead of generic alert
- Detect NotAllowedError, NotFoundError, NotReadableError, SecurityError, TypeError
- Display user-friendly error UI in red box instead of alert popup
- Clear camera error when user closes camera manually
```

---

### Bug #3: 摄像头视频窗口未显示
**日期**: 2026-03-02  
**严重级别**: 🔴 Critical  
**状态**: ✅ Fixed

#### 问题描述
- 用户点击"打开摄像头"后，MacBook的摄像头指示灯亮起（说明stream已启动）
- 但浏览器中看不到任何视频画面或拍照预览
- 用户无法確认摄像头工作正常或看到待拍照的内容

#### 根本原因
- `<video>` 元素缺少必要的 HTML 属性
  - 没有 `autoPlay` 导致视频不会自动播放
  - 没有 `muted` 导致某些浏览器阻止自动播放
  - 没有 `playsInline` 导致移动浏览器可能全屏显示或不支持
- 没有最小高度限制，video容器可能collapse
- 初始化逻辑在视频元数据加载前就调用 `play()`，可能失败

#### 解决方案
- 添加 `autoPlay` 属性 — 视频自动播放
- 添加 `muted` 属性 — 静音以满足自动播放策略
- 添加 `playsInline` 属性 — 兼容移动浏览器内联播放
- 添加 CSS 类 `min-h-96` — 确保视频容器最小高度
- 添加支持容器的黑色背景 — 改善视觉效果
- 改进初始化：等待 `loadedmetadata` 事件后再调用 `play()`

#### 提交信息
```
commit f5f3b9b
fix: enable video stream display with autoplay and proper attributes
- Add autoPlay, muted, and playsInline attributes to video element
- Add min-h-96 for minimum height so video displays properly
- Set black background for video container
- Improve video initialization by waiting for loadedmetadata event before playing
- This ensures video stream from camera is visible and user can see preview before capturing
```

---

### Bug #4: Camera Modal Dialog Missing
**Date**: 2026-03-02  
**严重级别**: 🟡 Medium  
**Status**: ✅ Fixed

#### 问题描述
- 用户打开摄像头后，视频流显示在主页面右侧（col-span-2 区域）
- 用户期望看到一个专门的对话框（modal/dialog）显示摄像头预览
- 当前实现没有焦点，用户体验不理想

#### 根本原因
- 摄像头视频流内联显示在页面布局中，而非独立的对话框
- 缺少专门的CameraModal组件

#### 解决方案
- 创建 `CameraModal.jsx` 组件，显示：
  - 居中对话框（固定定位，z-50 层级）
  - 半透明黑色背景遮罩
  - 摄像头预览标题和关闭按钮（✕）
  - 视频流显示在黑色容器中
  - "拍照" (绿色) 和 "关闭" (灰色) 两个行动按钮
  - 友好的提示文字
- 在 `pages/index.js` 中：
  - 导入 CameraModal 组件
  - 移除 col-span-2 中的内联视频显示
  - 使用 CameraModal 组件，通过 `isOpen={cameraOn}` 控制显示/隐藏

#### 测试验证
- ✅ 所有单元测试通过 (2/2)
- ✅ Dev server 成功编译
- ✅ modal 组件正确集成

#### 提交信息
```
commit a61790d
feat: add camera modal dialog for better UX
- Create CameraModal component that displays video stream in a centered dialog
- Shows camera preview in overlay instead of inline in main view
```

---

## 总结

## Summary Table

| Bug ID | Title | Severity | Status | Commit |
|--------|-------|----------|--------|--------|
| #1 | Internal Server Error 500 on localhost | 🔴 Critical | ✅ Fixed | 7e547b9 |
| #2 | Camera error handling | 🟡 Medium | ✅ Fixed | 7e547b9 |
| #3 | Camera video not displaying | 🔴 Critical | ✅ Fixed | f5f3b9b |
| #4 | Camera modal dialog missing | 🟡 Medium | ✅ Fixed | a61790d |

**修复时间**: 2026-03-02 UTC  
**测试状态**: All tests pass (2/2) ✅  
**代码质量**: 所有修复已验证并提交到 git

