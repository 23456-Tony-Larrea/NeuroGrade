import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './lib/apollo';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider } from './context/RoleContext';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import Users from './pages/Users';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import AIAnalyticsLanding from './components/AIAnalyticsLanding';
import Assignments from './pages/Assignments';
import Grades from './pages/Grades';
import TeacherGrading from './pages/TeacherGrading';
import TeacherAttendance from './pages/TeacherAttendance';
import RolesAndPermissions from './pages/RolesAndPermissions';
import Questionnaires from './pages/Questionnaires';
import ParentDashboard from './pages/ParentDashboard';
import ParentMessages from './pages/ParentMessages';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <RoleProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/ai-analytics" element={<AIAnalyticsLanding />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="users" element={
                  <PrivateRoute roles={['admin']}>
                    <Users />
                  </PrivateRoute>
                } />
                <Route path="assignments" element={
                  <PrivateRoute roles={['teacher', 'student']}>
                    <Assignments />
                  </PrivateRoute>
                } />
                <Route path="grades" element={
                  <PrivateRoute roles={['student']}>
                    <Grades />
                  </PrivateRoute>
                } />
                <Route path="teacher/grading" element={
                  <PrivateRoute roles={['teacher']}>
                    <TeacherGrading />
                  </PrivateRoute>
                } />
                <Route path="teacher/attendance" element={
                  <PrivateRoute roles={['teacher']}>
                    <TeacherAttendance />
                  </PrivateRoute>
                } />
                <Route path="roles" element={
                  <PrivateRoute roles={['admin']}>
                    <RolesAndPermissions />
                  </PrivateRoute>
                } />
                <Route path="questionnaires" element={
                  <PrivateRoute roles={['teacher']}>
                    <Questionnaires />
                  </PrivateRoute>
                } />
                <Route path="parent/dashboard" element={
                  <PrivateRoute roles={['parent']}>
                    <ParentDashboard />
                  </PrivateRoute>
                } />
                <Route path="parent/messages" element={
                  <PrivateRoute roles={['parent']}>
                    <ParentMessages />
                  </PrivateRoute>
                } />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </RoleProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App