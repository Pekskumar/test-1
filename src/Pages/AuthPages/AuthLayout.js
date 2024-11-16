import React, { useState } from "react";
// import leftImg from "../../Assets/Images/man3.jpg";
import leftImg from "../../Assets/Images/bg1.jpg";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import Logo1 from "../../Assets/Images/Logo12.png";
const AuthLayout = () => {
  const [PageShowFlag, setPageShowFlag] = useState(false);
  return (
    <>
      <div className="login-page">
        <img src={leftImg} alt="leftImg" className="login-left" />
        <div className="login-right">

          <div className="w-100">
            <div className="text-center pb-5 d-flex
    justify-content-center
    align-items-center">
              <img src={Logo1} style={{ height: "75px", width: "75px" }} />
              <h6 className="mb-0 blue text-start">Expense <br/> To Do <br/> Users</h6>
            </div>
            {PageShowFlag ? (
              <SignUpPage data={setPageShowFlag} />
            ) : (
              <LoginPage data={setPageShowFlag} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
