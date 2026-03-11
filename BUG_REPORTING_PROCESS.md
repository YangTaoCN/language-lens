# Bug Reporting Process & Template

## Overview
This document establishes a standardized bug reporting process for the Language Lens project. When you report a bug, it will be automatically documented, refined in English, and tracked in the `BUG_FIXES.md` file.

## Quick Bug Report Template

When reporting a bug, provide the following information (in any language):

```
Bug: [User-reported issue in Chinese or English]
Expected: [What should happen]
Actual: [What's happening instead]
Steps: [How to reproduce]
Environment: [Browser, OS, etc.]
```

## Automated Processing Steps

1. **Capture**: You report the bug in natural language (Chinese or English)
2. **Analyze**: I identify root cause and impact level
3. **Fix**: Code changes are implemented
4. **Document**: Bug is recorded in English with:
   - Clear problem statement
   - Root cause analysis
   - Solution implemented
   - Commit reference
5. **Verify**: Tests pass, changes committed
6. **Record**: Entry added to `BUG_FIXES.md` with refined English description

## Bug Severity Levels

- 🔴 **Critical**: Blocks core functionality, makes app unusable
- 🟠 **High**: Major feature broken, significant UX impact
- 🟡 **Medium**: Feature partially broken, workaround exists
- 🟢 **Low**: Minor issue, doesn't affect core functionality
- 🔵 **Enhancement**: Feature request or improvement

## Bug Entry Template (English-Refined)

```markdown
### Bug #[N]: [Concise English Title]
**Date**: YYYY-MM-DD  
**Severity**: [🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low / 🔵 Enhancement]  
**Status**: ✅ Fixed / 🔧 In Progress / 📋 Reported

#### Problem Statement
[Clear description of what's wrong, why it matters]

#### Root Cause
[Technical explanation of why this bug exists]

#### Solution Implemented
[What was changed to fix it]

#### Testing
[How fix was verified]

#### Commit Reference
[git commit hash and message]
```

## Example Workflow

### You Report:
```
摄像头打开后看不到视频预览窗口，但摄像头指示灯亮了
```

### I Process & Refine:
```markdown
### Bug #3: Camera Video Stream Not Displaying in Preview
**Date**: 2026-03-02  
**Severity**: 🔴 Critical  
**Status**: ✅ Fixed

#### Problem Statement
When user clicks "打开摄像头" (Open Camera), the camera indicator light activates 
but no video feed appears in the browser window. User cannot see preview before 
capturing photo, leading to confusion about camera functionality.

#### Root Cause
The `<video>` HTML element was missing critical attributes:
- No `autoPlay` → video doesn't play automatically
- No `muted` → browser autoplay policies block playback
- No `playsInline` → mobile browser compatibility issues
- Missing minimum height → container could collapse
- No metadata wait → play() called before video ready

#### Solution Implemented
- Added `autoPlay`, `muted`, `playsInline` to video element
- Added Tailwind class `min-h-96` for minimum display height
- Changed container background to black for better contrast
- Modified initialization: wait for `loadedmetadata` event before calling play()

#### Testing
- Verified video displays in dev server (http://localhost:3002)
- Confirmed all tests pass (2/2 ✅)
- Tested on desktop browser

#### Commit Reference
```
commit f5f3b9b
fix: enable video stream display with autoplay and proper attributes
```
```

## Benefits of This Process

✅ **Consistency** - All bugs documented in standard format  
✅ **Clarity** - English refinement ensures precise technical language  
✅ **Traceability** - Every bug linked to specific commits  
✅ **Knowledge Base** - Future developers understand what was fixed and why  
✅ **Quality Tracking** - See progress and patterns over time  

## How to Use This Process

1. **Report bug** to me in any language
2. **Keep brief** - 1-2 sentences describing the issue
3. **I will**:
   - Ask clarifying questions if needed
   - Reproduce and analyze
   - Implement fix
   - Write English-refined documentation
   - Update BUG_FIXES.md automatically
   - Commit all changes

## Current Bug List

See `BUG_FIXES.md` for complete history of reported and fixed bugs.
