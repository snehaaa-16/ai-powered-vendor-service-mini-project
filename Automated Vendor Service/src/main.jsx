import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './index.css'
import HomePage from './pages/HomePage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import VendorDetailPage from './pages/VendorDetailPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import UserRegistrationPage from './pages/auth/UserRegistrationPage.jsx'
import VendorRegistrationPage from './pages/auth/VendorRegistrationPage.jsx'
import VendorSkillsPage from './pages/auth/VendorSkillsPage.jsx'
import VendorServicesPage from './pages/auth/VendorServicesPage.jsx'
import VendorProjectsPage from './pages/auth/VendorProjectsPage.jsx'
import VendorAvailabilityPage from './pages/auth/VendorAvailabilityPage.jsx'
import VendorPreviewPage from './pages/auth/VendorPreviewPage.jsx'

import OnboardingPage from './pages/onboarding/OnboardingPage.jsx'
import VendorRegistrationPageOld from './pages/vendor-registration/VendorRegistrationPage.jsx'
import ChatBotPage from './pages/ChatBotPage.jsx'
import ChatSummaryPage from './pages/ChatSummaryPage.jsx'
import ChatHistoryPage from './pages/ChatHistoryPage.jsx'
import FeedbacksPage from './pages/FeedbacksPage.jsx'

// Initialize theme before app mounts
const savedTheme = localStorage.getItem('theme')
if (savedTheme) {
  document.documentElement.classList.toggle('dark', savedTheme === 'dark')
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'vendor/:id', element: <VendorDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'register/new-user', element: <UserRegistrationPage /> },
      { path: 'register/new-vendor', element: <VendorRegistrationPage /> },
      { path: 'register/new-vendor/step2', element: <VendorSkillsPage /> },
      { path: 'register/new-vendor/step3', element: <VendorServicesPage /> },
      { path: 'register/new-vendor/step4', element: <VendorProjectsPage /> },
      { path: 'register/new-vendor/step5', element: <VendorAvailabilityPage /> },
      { path: 'register/new-vendor/preview', element: <VendorPreviewPage /> },
      { path: 'onboarding', element: <ProtectedRoute><OnboardingPage /></ProtectedRoute> },
      { path: 'chatbot', element: <ProtectedRoute><ChatBotPage /></ProtectedRoute> },
      { path: 'chat-summary', element: <ProtectedRoute><ChatSummaryPage /></ProtectedRoute> },
      { path: 'chats', element: <ProtectedRoute><ChatHistoryPage /></ProtectedRoute> },
      { path: 'feedbacks', element: <ProtectedRoute><FeedbacksPage /></ProtectedRoute> },
      { path: 'vendor-registration', element: <VendorRegistrationPageOld /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
