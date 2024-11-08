import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Dashboards from './pages/Dashboards/Dashboards';
import Dashboard from './pages/Dashboards/Dashboard';
import DashboardTestCases from './pages/Dashboards/DashboardTestCases';
import DashboardHistory from './pages/Dashboards/DashboardHistory';
import Settings from './pages/Settings';
import DefaultLayout from './layout/DefaultLayout';
import AllTestCases from './pages/AllTestCases';
import AllHistory from './pages/AllHistory';
import AllApplication from './pages/AllApplications';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import Credits from './pages/Credits';
import Help from './pages/Help';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/dashboards'); // Redirect to the home page after login
  };

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      {!isLoggedIn ? (
        <>
          <Route
            path="/auth/signin"
            element={
              <>
                <PageTitle title="Signin | CobaltTest - OCBC Automated Testing" />
                <SignIn onLogin={handleLogin} />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/auth/signin" />} />
        </>
      ) : (
        <Route
          path="*"
          element={
            <DefaultLayout>
              <Routes>
                <Route
                  path = "/dashboards"
                  element={
                    <>
                      <PageTitle title="Dashboard | CobaltTest - OCBC Automated Testing" />
                      <Dashboards />
                    </>
                  }
                />
                <Route
                  path="/dashboards/dashboard1"
                  element={
                    <>
                      <PageTitle title="Dashboard | CobaltTest - OCBC Automated Testing" />
                      <Dashboard />
                    </>
                  }
                />
                <Route
                  path="/dashboards/dashboard1/dashboard-testcases"
                  element={
                    <>
                      <PageTitle title="Dashboard Test Cases | CobaltTest - OCBC Automated Testing" />
                      <DashboardTestCases />
                    </>
                  }
                />
                <Route
                  path="/dashboards/dashboard1/dashboard-history"
                  element={
                    <>
                      <PageTitle title="Dashboard History| CobaltTest - OCBC Automated Testing" />
                      <DashboardHistory />
                    </>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <>
                      <PageTitle title="Settings | CobaltTest - OCBC Automated Testing" />
                      <Settings />
                    </>
                  }
                />
                <Route
                  path="/all-test-cases"
                  element={
                    <>
                      <PageTitle title="All Test Cases | CobaltTest - OCBC Automated Testing" />
                      <AllTestCases />
                    </>
                  }
                />
                 <Route 
                  path="/all-applications"
                  element={
                    <>
                      <PageTitle title="All Applications | CobaltTest - OCBC Automated Testing" />
                      <AllApplication />
                    </>
                  }
                 />
                 <Route 
                  path="/all-applications/:id" 
                  element={
                    <>
                      <PageTitle title = "Application Details | CobaltTest - OCBC Automated Testing" />
                      <ApplicationDetailPage />
                    </> 
                  }
                  />
                
                 <Route
                  path="/all-history"
                  element={
                    <>
                      <PageTitle title="All History | CobaltTest - OCBC Automated Testing" />
                      <AllHistory />
                    </>
                  }
                />
                <Route
                  path="/credits"
                  element={
                    <>
                      <PageTitle title="Credits | CobaltTest - OCBC Automated Testing" />
                      <Credits />
                    </>
                  }
                />
                <Route
                  path="/help"
                  element={
                    <>
                      <PageTitle title="Help | CobaltTest - OCBC Automated Testing" />
                      <Help />
                    </>
                  }
                />
                <Route path="/auth/signin" element={<Navigate to="/dashboard" />} />
              </Routes>
            </DefaultLayout>
          }
        />
      )}
    </Routes>
  );
}

export default App;
