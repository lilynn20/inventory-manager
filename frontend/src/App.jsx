import './i18n';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { ConfirmProvider } from './components/ConfirmDialog'
import { KeyboardProvider } from './context/KeyboardContext'
import CommandPalette from './components/CommandPalette'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Suppliers from './pages/Suppliers'
import StockMovements from './pages/StockMovements'
import Predictions from './pages/Predictions'
import Employees from './pages/Employees'
import ActivityLogs from './pages/ActivityLogs'
import Notifications from './pages/Notifications'
import Import from './pages/Import'
import Profile from './pages/Profile'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="movements" element={<StockMovements />} />
        <Route path="predictions" element={<Predictions />} />
        <Route path="employees" element={<Employees />} />
        <Route path="activity-logs" element={<ActivityLogs />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="import" element={<Import />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <ConfirmProvider>
            <AuthProvider>
              <BrowserRouter>
                <KeyboardProvider>
                  <AppRoutes />
                  <CommandPalette />
                </KeyboardProvider>
                <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
              </BrowserRouter>
            </AuthProvider>
          </ConfirmProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
