import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignupForm from "../../components/signup/Signup";

function SignupPage() {
    const navigate=useNavigate();
    useEffect(() => {
    const token = localStorage.getItem('userAuthToken');
    if (token) return  navigate("/home");
  }, [navigate]);
  return (
   
    <div>
      <SignupForm />
    </div>
  );
}

export default SignupPage;
