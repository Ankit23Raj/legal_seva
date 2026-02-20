#!/bin/bash

# Legal Seva - Pre-Deployment Verification Script (Simplified)

echo "Legal Seva - Pre-Deployment Verification Checklist"
echo "=================================================="
echo ""

PASSED=0
FAILED=0
WARNINGS=0

# Check function
check() {
    if [ $1 -eq 0 ]; then
        echo "✅ $2"
        ((PASSED++))
    else
        echo "❌ $2"
        ((FAILED++))
    fi
}

check_warn() {
    echo "⚠️  $1"
    ((WARNINGS++))
}

# 1. Environment
echo "1. ENVIRONMENT CHECKS"
echo "-------------------"
node -v > /dev/null 2>&1 && check 0 "Node.js installed" || check 1 "Node.js not found"
npm -v > /dev/null 2>&1 && check 0 "npm installed" || check 1 "npm not found"
git -v > /dev/null 2>&1 && check 0 "Git installed" || check 1 "Git not found"
echo ""

# 2. Frontend
echo "2. FRONTEND CHECKS"
echo "-------------------"
[ -d "/Users/anktraj/Downloads/Legal_Seva/frontend" ] && check 0 "Frontend directory exists" || check 1 "Frontend directory missing"
[ -f "/Users/anktraj/Downloads/Legal_Seva/frontend/package.json" ] && check 0 "Frontend package.json exists" || check 1 "Frontend package.json missing"
[ -d "/Users/anktraj/Downloads/Legal_Seva/frontend/src" ] && check 0 "Frontend src directory exists" || check 1 "Frontend src missing"
[ -d "/Users/anktraj/Downloads/Legal_Seva/frontend/node_modules" ] && check 0 "Frontend dependencies installed" || check_warn "Frontend dependencies not installed"
echo ""

# 3. Backend
echo "3. BACKEND CHECKS"
echo "-------------------"
[ -d "/Users/anktraj/Downloads/backend" ] && check 0 "Backend directory exists" || check 1 "Backend directory missing"
[ -f "/Users/anktraj/Downloads/backend/package.json" ] && check 0 "Backend package.json exists" || check 1 "Backend package.json missing"
[ -d "/Users/anktraj/Downloads/backend/routes" ] && check 0 "Backend routes directory exists" || check 1 "Backend routes missing"
[ -d "/Users/anktraj/Downloads/backend/node_modules" ] && check 0 "Backend dependencies installed" || check_warn "Backend dependencies not installed"
echo ""

# 4. Configuration Files
echo "4. CONFIGURATION FILES"
echo "-------------------"
[ -f "/Users/anktraj/Downloads/Legal_Seva/frontend/vite.config.ts" ] && check 0 "Vite config exists" || check 1 "Vite config missing"
[ -f "/Users/anktraj/Downloads/Legal_Seva/frontend/tsconfig.json" ] && check 0 "Frontend tsconfig exists" || check 1 "Frontend tsconfig missing"
[ -f "/Users/anktraj/Downloads/backend/config/cors.js" ] && check 0 "CORS config exists" || check 1 "CORS config missing"
[ -f "/Users/anktraj/Downloads/backend/config/db.js" ] && check 0 "Database config exists" || check 1 "Database config missing"
echo ""

# 5. Environment Files
echo "5. ENVIRONMENT FILES"
echo "-------------------"
[ -f "/Users/anktraj/Downloads/Legal_Seva/frontend/.env.development" ] && check 0 "Frontend .env.development exists" || check_warn "Frontend .env.development missing"
[ -f "/Users/anktraj/Downloads/backend/.env.example" ] && check 0 "Backend .env.example exists" || check_warn "Backend .env.example missing"
[ -f "/Users/anktraj/Downloads/backend/.env" ] && check 0 "Backend .env exists" || check_warn "Backend .env missing (needed for local testing)"
echo ""

# 6. Documentation
echo "6. DOCUMENTATION"
echo "-------------------"
[ -f "/Users/anktraj/Downloads/Legal_Seva/STAGING_DEPLOYMENT_GUIDE.md" ] && check 0 "Staging deployment guide created" || check 1 "Staging guide missing"
[ -f "/Users/anktraj/Downloads/Legal_Seva/PRODUCTION_READINESS_FINAL.md" ] && check 0 "Production readiness report exists" || check 1 "Readiness report missing"
echo ""

# 7. Git
echo "7. GIT CONFIGURATION"
echo "-------------------"
[ -f "/Users/anktraj/Downloads/Legal_Seva/.gitignore" ] && check 0 ".gitignore exists" || check_warn ".gitignore missing"
echo ""

# Summary
echo "=================================================="
echo "SUMMARY:"
echo "  ✅ Passed:   $PASSED"
echo "  ❌ Failed:   $FAILED"
echo "  ⚠️  Warnings: $WARNINGS"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "✅ All critical checks passed!"
    if [ $WARNINGS -gt 0 ]; then
        echo "⚠️  Fix warnings before deployment"
    fi
else
    echo "❌ Fix failures before deployment"
fi
