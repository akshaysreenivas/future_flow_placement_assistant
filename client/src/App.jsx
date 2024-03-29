import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import UserRouter from "./routes/UserRouter";
import AdminRouter from "./routes/AdminRouter";
import HrRoutes from "./routes/HrRoutes";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <>
      <Routes>
        {/* user routes */}
        <Route path="/*" element={<UserRouter />} />

        {/*  Hr Manager routes */}
        <Route path="/hr/*" element={<HrRoutes />} />

        {/*  admin routes */}
        <Route path="/admin/*" element={<AdminRouter />} />

        {/* Showing error page */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      {/* Toast container */}

      <ToastContainer newestOnTop limit={3} position="top-center" />
    </>
  );
}

export default App;
