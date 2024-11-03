import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Dashboards from './pages/Dashboards/Dashboards';
import Dashboard from './pages/Dashboards/Dashboard';
import DashboardTestCases from './pages/Dashboards/DashboardTestCases';
import DashboardHistory from './pages/Dashboards/DashboardHistory';

import Chart from './pages/Chart';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';

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
                  path="/forms/form-elements"
                  element={
                    <>
                      <PageTitle title="Form Elements | CobaltTest - OCBC Automated Testing" />
                      <FormElements />
                    </>
                  }
                />
                <Route
                  path="/forms/form-layout"
                  element={
                    <>
                      <PageTitle title="Form Layout | CobaltTest - OCBC Automated Testing" />
                      <FormLayout />
                    </>
                  }
                />
                <Route
                  path="/tables"
                  element={
                    <>
                      <PageTitle title="Tables | CobaltTest - OCBC Automated Testing" />
                      <Tables />
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
                  path="/chart"
                  element={
                    <>
                      <PageTitle title="Basic Chart | CobaltTest - OCBC Automated Testing" />
                      <Chart />
                    </>
                  }
                />
                <Route
                  path="/ui/alerts"
                  element={
                    <>
                      <PageTitle title="Alerts | CobaltTest - OCBC Automated Testing" />
                      <Alerts />
                    </>
                  }
                />
                <Route
                  path="/ui/buttons"
                  element={
                    <>
                      <PageTitle title="Buttons | CobaltTest - OCBC Automated Testing" />
                      <Buttons />
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
