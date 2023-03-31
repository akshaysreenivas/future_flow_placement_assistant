import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserRouter from "./routes/UserRouter";
import AdminRouter from "./routes/AdminRouter";
import HrRoutes from "./routes/HrRoutes";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      {
        // user routes
        <Routes>
          <Route path={"/*"} element={<UserRouter />} />
        </Routes>
      }
      {
        // admin Routes
        <Routes>
          <Route path={"/admin/*"} element={<AdminRouter />} />
        </Routes>
      }
      {
        //hr Routes
        <Routes>
          <Route path={"/hr/*"} element={<HrRoutes />} />
        </Routes>
      }
      <ToastContainer />
    </>
  );
}

export default App;
