import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import AuthLayout from "./Pages/AuthPages/AuthLayout";
import { useSelector } from "react-redux";
import Dashboard from "./Pages/AllPages/Home";
import Layout from "./Pages/AllPages/Layout";
import { Suspense } from "react";
import Transations from "./Pages/AllPages/Transations";
import Home from "./Pages/AllPages/Home";
import Users from "./Pages/AllPages/Users";
import Todos from "./Pages/AllPages/Todos";
import ResetPassword from "./Pages/AuthPages/ResetPassword";
import ForgotPassword from "./Pages/AuthPages/ForgotPassword";

function App() {
  const Token = useSelector((state) => state.userinfo.Token);
  const is_logged = Token !== null ? true : false;

  const AllRoutes = () => (
    <Routes>
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <Suspense fallback={"Loader..."}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/transactions"
          element={
            <Suspense fallback={"Loader..."}>
              <Transations />
            </Suspense>
          }
        />
        <Route
          path="/users"
          element={
            <Suspense fallback={"Loader..."}>
              <Users />
            </Suspense>
          }
        />
        <Route
          path="/todos"
          element={
            <Suspense fallback={"Loader..."}>
              <Todos />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
  const AuthRoutes = () => (
    <Routes>
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/" element={<AuthLayout />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
  return (
    <>
      <Toaster position="bottom-center" />
      <Router 
      // basename={process.env.PUBLIC_URL}
      >{is_logged ? <AllRoutes /> : <AuthRoutes />}</Router>
    </>
  );
}

export default App;
