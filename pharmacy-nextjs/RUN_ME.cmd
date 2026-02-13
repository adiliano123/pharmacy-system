@echo off
echo ========================================
echo   Pharmacy ERP System - Next.js
echo   Starting Development Server...
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    echo.
    call npm install
    echo.
)

echo [INFO] Starting Next.js development server...
echo.
echo ========================================
echo   Server will start at:
echo   http://localhost:3000
echo ========================================
echo.
echo   Login Credentials:
echo   ------------------
echo   Admin:      admin / admin123
echo   Pharmacist: pharmacist1 / admin123
echo   Cashier:    cashier1 / admin123
echo.
echo ========================================
echo.
echo [INFO] Press Ctrl+C to stop the server
echo.

call npm run dev
