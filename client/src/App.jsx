import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserRouter from "./routes/UserRouter";
import AdminRouter from "./routes/AdminRouter";
import HrRoutes from "./routes/HrRoutes";
import { Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import io from "socket.io-client"

const socket= io.connect(process.env.REACT_APP_BASE_URL)
function App() {

  return (
    <>
      <Routes>
        {/* user routes */}
        <Route path="/*" element={<UserRouter />} />

        {/*  admin routes */}
        <Route path="/admin/*" element={<AdminRouter />} />

        {/*  Hr Manager routes */}
        <Route path="/hr/*" element={<HrRoutes />} />
        
        {/* Showing error page */}
        <Route path="*" element={<ErrorPage />} />
        </Routes>
      {/* Toast container */}

      <ToastContainer newestOnTop limit={3} position="top-center" />
    </>
  );
}

export default App;
