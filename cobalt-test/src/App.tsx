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
