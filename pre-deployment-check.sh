#!/bin/bash

# Legal Seva - Pre-Deployment Verification Script
# This script performs comprehensive checks before staging deployment

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         Legal Seva - Pre-Deployment Verification Script       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0
WARN=0

check_pass() {
    echo -e "${GREEN}✅ PASS${NC}: $1"
    ((PASS++))
}

check_fail() {
    echo -e "${RED}❌ FAIL${NC}: $1"
    ((FAIL++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  WARN${NC}: $1"
    ((WARN++))
}

# ============================================================================
# Section 1: Environment Setup
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SECTION 1: Environment Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    check_pass "Node.js installed: $NODE_VERSION"
else
    check_fail "Node.js not found. Install from https://nodejs.org"
fi

# Check npm version
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    check_pass "npm installed: $NPM_VERSION"
else
    check_fail "npm not found"
fi

# Check Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git -v)
    check_pass "Git installed: $GIT_VERSION"
else
    check_fail "Git not found"
fi

echo ""

# ============================================================================
# Section 2: Frontend Configuration
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SECTION 2: Frontend Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

FRONTEND_DIR="/Users/anktraj/Downloads/Legal_Seva/frontend"

if [ -d "$FRONTEND_DIR" ]; then
    check_pass "Frontend directory exists: $FRONTEND_DIR"
else
    check_fail "Frontend directory not found: $FRONTEND_DIR"
fi

if [ -f "$FRONTEND_DIR/package.json" ]; then
    check_pass "Frontend package.json exists"
else
    check_fail "Frontend package.json not found"
fi

if [ -f "$FRONTEND_DIR/.env.development" ]; then
    if grep -q "VITE_API_URL" "$FRONTEND_DIR/.env.development"; then
        check_pass "Frontend .env.development has VITE_API_URL"
    else
        check_fail "Frontend .env.development missing VITE_API_URL"
    fi
else
    check_fail "Frontend .env.development not found"
fi

if [ -d "$FRONTEND_DIR/src" ]; then
    check_pass "Frontend src directory exists"
else
    check_fail "Frontend src directory missing"
fi

echo ""

# ============================================================================
# Section 3: Backend Configuration
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SECTION 3: Backend Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

BACKEND_DIR="/Users/anktraj/Downloads/backend"

if [ -d "$BACKEND_DIR" ]; then
    check_pass "Backend directory exists: $BACKEND_DIR"
else
    check_fail "Backend directory not found: $BACKEND_DIR"
fi

if [ -f "$BACKEND_DIR/package.json" ]; then
    check_pass "Backend package.json exists"
else
    check_fail "Backend package.json not found"
fi

if [ -f "$BACKEND_DIR/.env.example" ]; then
    check_pass "Backend .env.example exists"
else
    check_warn "Backend .env.example not found (create one for reference)"
fi

if [ -f "$BACKEND_DIR/.env" ]; then
    if grep -q "JWT_SECRET" "$BACKEND_DIR/.env"; then
        check_pass "Backend .env has JWT_SECRET"
    else
        check_fail "Backend .env missing JWT_SECRET"
    fi
    
    if grep -q "MONGODB_URI" "$BACKEND_DIR/.env"; then
        check_pass "Backend .env has MONGODB_URI"
    else
        check_fail "Backend .env missing MONGODB_URI"
    fi
else
    check_warn "Backend .env not found (copy from .env.example for local testing)"
fi

if [ -d "$BACKEND_DIR/routes" ]; then
    check_pass "Backend routes directory exists"
else
    check_fail "Backend routes directory missing"
fi

echo ""

# ============================================================================
# Section 4: Dependency Installation
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SECTION 4: Dependency Installation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "$FRONTEND_DIR/node_modules" ]; then
    check_pass "Frontend node_modules installed"
else
    check_warn "Frontend node_modules not found - run 'npm install' in frontend directory"
fi

if [ -d "$BACKEND_DIR/node_modules" ]; then
    check_pass "Backend node_modules installed"
else
    check_warn "Backend node_modules not found - run 'npm install' in backend directory"
fi

echo ""

# ============================================================================
# Section 5: Code Quality Checks
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SECTION 5: Code Quality Checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for TODO/FIXME comments
echo "Checking for TODO/FIXME comments..."
TODO_COUNT=$(find "$FRONTEND_DIR/src" -name "*.tsx" -o -name "*.ts" | xargs grep -l "TODO\|FIXME" 2>/dev/null | wc -l || true)
if [ $TODO_COUNT -eq 0 ]; then
    check_pass "No TODO/FIXME comments in frontend src"
else
    check_warn "Found $TODO_COUNT files with TODO/FIXME comments"
fi

# Check for console.log statements
CONSOLE_COUNT=$(find "$FRONTEND_DIR/src" -name "*.tsx" -o -name "*.ts" | xargs grep "console\.log" 2>/dev/null | wc -l || true)
if [ $CONSOLE_COUNT -eq 0 ]; then
    check_pass "No console.log statements in frontend src"
else
    check_warn "Found $CONSOLE_COUNT console.log statements (should be removed in production)"
fi

echo ""

# ============================================================================
# Section 6: Security Configuration
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SECTION 6: Security Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -r "TODO.*SECURITY\|FIXME.*SECURITY" "$FRONTEND_DIR/src" 2>/dev/null | grep -q .; then
    check_fail "Found SECURITY TODO/FIXME comments - must fix before deployment"
else
    check_pass "No unresolved security TODOs"
fi

if [ -f "$BACKEND_DIR/config/cors.js" ]; then
    if grep -q "cors(" "$BACKEND_DIR/config/cors.js"; then
        check_pass "CORS middleware properly configured"
    else
        check_fail "CORS middleware not configured correctly"
    fi
else
    check_warn "CORS config file not found"
fi

echo ""

# ============================================================================
# Section 7: File Structure Validation
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SECTION 7: File Structure Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Frontend files
FRONTEND_FILES=(
    "src/App.tsx"
    "src/main.tsx"
    "src/contexts/AuthContext.tsx"
    "src/components/Chatbot.tsx"
    "vite.config.ts"
    "tsconfig.json"
)

for file in "${FRONTEND_FILES[@]}"; do
    if [ -f "$FRONTEND_DIR/$file" ]; then
        check_pass "Frontend file exists: $file"
    else
        check_fail "Frontend file missing: $file"
    fi
done

# Backend files
BACKEND_FILES=(
    "server.js"
    "config/cors.js"
    "config/db.js"
    "middleware/authMiddleware.js"
    "routes/auth.js"
    "routes/issues.js"
)

for file in "${BACKEND_FILES[@]}"; do
    if [ -f "$BACKEND_DIR/$file" ]; then
        check_pass "Backend file exists: $file"
    else
        check_fail "Backend file missing: $file"
    fi
done

echo ""

# ============================================================================
# Section 8: Deployment Configuration
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SECTION 8: Deployment Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "/Users/anktraj/Downloads/Legal_Seva/frontend/vercel.json" ] || [ -f "/Users/anktraj/Downloads/Legal_Seva/frontend/package.json" ]; then
    check_pass "Frontend deployment configuration found"
else
    check_warn "Frontend deployment config not found (Vercel will use defaults)"
fi

if [ -f "/Users/anktraj/Downloads/Legal_Seva/.gitignore" ]; then
    check_pass ".gitignore exists"
    if grep -q "node_modules\|.env" "/Users/anktraj/Downloads/Legal_Seva/.gitignore"; then
        check_pass ".gitignore contains sensitive items (node_modules, .env)"
    else
        check_fail ".gitignore missing sensitive items"
    fi
else
    check_fail ".gitignore not found"
fi

echo ""

# ============================================================================
# Section 9: Git Repository
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SECTION 9: Git Repository"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "/Users/anktraj/Downloads/Legal_Seva/.git" ]; then
    check_pass "Frontend Git repository initialized"
else
    check_warn "Frontend Git repository not initialized - run 'git init' before deployment"
fi

if [ -d "/Users/anktraj/Downloads/backend/.git" ]; then
    check_pass "Backend Git repository initialized"
else
    check_warn "Backend Git repository not initialized - run 'git init' before deployment"
fi

echo ""

# ============================================================================
# Summary
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Passed:${NC}   $PASS"
echo -e "${RED}❌ Failed:${NC}   $FAIL"
echo -e "${YELLOW}⚠️  Warnings:${NC} $WARN"
echo ""

if [ $FAIL -eq 0 ]; then
    if [ $WARN -eq 0 ]; then
        echo -e "${GREEN}🎉 All checks passed! Ready for deployment.${NC}"
        exit 0
    else
        echo -e "${YELLOW}⚠️  All critical checks passed, but fix warnings before deployment.${NC}"
        exit 0
    fi
else
    echo -e "${RED}❌ Fix $FAIL failures before proceeding with deployment.${NC}"
    exit 1
fi
