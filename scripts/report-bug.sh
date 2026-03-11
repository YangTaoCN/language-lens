#!/bin/bash
# Bug Report Assistant Script
# Usage: ./scripts/report-bug.sh "Brief bug description"

set -e

if [ $# -eq 0 ]; then
    echo "Usage: ./scripts/report-bug.sh \"Brief bug description\""
    echo ""
    echo "Example: ./scripts/report-bug.sh \"Camera video not displaying\""
    exit 1
fi

BUG_DESC="$1"
BUG_FIXES_FILE="BUG_FIXES.md"
TIMESTAMP=$(date +"%Y-%m-%d")

# Read current bug count
if [ ! -f "$BUG_FIXES_FILE" ]; then
    echo "Error: $BUG_FIXES_FILE not found"
    exit 1
fi

# Get next bug ID
LAST_BUG_ID=$(grep -oP 'Bug #\K\d+' "$BUG_FIXES_FILE" | tail -1 || echo "0")
NEW_BUG_ID=$((LAST_BUG_ID + 1))

echo "📝 Bug Report Assistant"
echo "========================"
echo "Bug ID: #$NEW_BUG_ID"
echo "Description: $BUG_DESC"
echo "Date: $TIMESTAMP"
echo ""
echo "Please provide additional details (or press Enter to skip):"
echo ""

read -p "Expected behavior: " EXPECTED
read -p "Actual behavior: " ACTUAL
read -p "Severity (🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low): " SEVERITY

if [ -z "$SEVERITY" ]; then
    SEVERITY="🟡 Medium"
fi

read -p "Steps to reproduce (optional): " STEPS

echo ""
echo "Creating bug entry..."
echo ""

# Template for English-refined entry (you can customize this)
ENTRY="
### Bug #$NEW_BUG_ID: $BUG_DESC
**Date**: $TIMESTAMP  
**Severity**: $SEVERITY  
**Status**: 📋 Reported

#### Problem Statement
$ACTUAL

#### Expected Behavior
$EXPECTED

#### Steps to Reproduce
$STEPS

#### Root Cause
[To be analyzed and filled in]

#### Solution
[To be implemented]

#### Testing & Verification
[To be completed]

#### Commit Reference
[To be added after fix]
"

echo "Preview of bug entry:"
echo "===================="
echo "$ENTRY"
echo ""

read -p "Add this bug to BUG_FIXES.md? (y/n): " CONFIRM

if [ "$CONFIRM" = "y" ]; then
    # Find the summary section and insert before it
    if grep -q "## 总结" "$BUG_FIXES_FILE"; then
        # macOS compatible sed (using backup)
        sed -i.bak "/## 总结/i\\
$ENTRY
" "$BUG_FIXES_FILE"
        rm -f "$BUG_FIXES_FILE.bak"
    else
        # Fallback: append at end
        echo "$ENTRY" >> "$BUG_FIXES_FILE"
    fi
    
    echo "✅ Bug #$NEW_BUG_ID added to $BUG_FIXES_FILE"
    echo ""
    echo "Next steps:"
    echo "1. Analyze the bug and identify root cause"
    echo "2. Implement fix"
    echo "3. Run: npm test"
    echo "4. Run: git add -A && git commit -m 'fix: [description]'"
    echo "5. Update bug entry with commit hash and details"
else
    echo "❌ Bug entry cancelled"
    exit 1
fi
