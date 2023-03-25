import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserRouter from "./routes/UserRouter";
import AdminRouter from "./routes/AdminRouter";
import HrRoutes from "./routes/HrRoutes";

function App() {
  return (
    <>
     { // user routes
      <UserRouter />}
      {// admin Routes
      <AdminRouter />}
      <ToastContainer />
      {//hr Routes
      <HrRoutes/>}
    </>
  );
}

export default App;
