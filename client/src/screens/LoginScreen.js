import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

function LoginScreen() {

  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();


/* SEND OTP */

const sendOtp = async () => {

  if(!email){
    alert("Enter email first");
    return;
  }

  const otpValue = Math.floor(100000 + Math.random() * 900000);

  setGeneratedOtp(otpValue);

  const templateParams = {
     user_email: email,
    otp: otpValue
  };

  try{

    await emailjs.send(
      "service_93u4zo3",
      "template_hvzlrum",
      templateParams,
      "vaY2ST-y_AUk_50mq"
    );

    alert("OTP sent to your email");

    setOtpSent(true);
    setTimer(60);

    const countdown = setInterval(()=>{

      setTimer((prev)=>{

        if(prev <= 1){
          clearInterval(countdown);
          return 0;
        }

        return prev - 1;

      });

    },1000);

  }
  catch(error){

    alert("Failed to send OTP");

  }

};


/* SUBMIT */

const submitHandler = async (e) => {

  e.preventDefault();

  try {

    /* REGISTER */

    if(isRegister){

      if(otp !== generatedOtp){
        alert("Invalid OTP");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/users/register",
        { name,email,password }
      );

      alert("Registration Successful");

      setIsRegister(false);
      setOtpSent(false);
      setOtp("");
      setTimer(0);

    }


    /* LOGIN */

    /* LOGIN */

else if (!isForgot) {

  // ✅ FAKE ADMIN LOGIN
  if (email === "admin@gmail.com" && password === "123456") {

    const adminData = {
      email: email,
      isAdmin: true
    };

    localStorage.setItem("adminInfo", JSON.stringify(adminData));

    navigate("/admin"); // go to admin panel
    return;
  }

  // ✅ NORMAL USER LOGIN
  const { data } = await axios.post(
    "http://localhost:5000/api/users/login",
    { email, password }
  );

  localStorage.setItem("userInfo", JSON.stringify(data));

  navigate("/products");
}

    /* RESET PASSWORD */

    else{

      if(otp !== generatedOtp){
        alert("Invalid OTP");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/users/reset-password",
        { email,password }
      );

      alert("Password Reset Successful");

      setIsForgot(false);
      setOtpSent(false);
      setOtp("");
      setTimer(0);

    }

  }

  catch(error){

    alert(error.response?.data?.message || "Something went wrong");

  }

};


return(

<div style={containerStyle}>

<div style={logoCircle}>🛒</div>

<h1 style={titleStyle}>Welcome to SmartCart</h1>

<form onSubmit={submitHandler} style={cardStyle}>


{/* NAME */}

{isRegister && (

<>
<label style={labelStyle}>Full Name</label>

<input
type="text"
placeholder="Enter your name"
value={name}
onChange={(e)=>setName(e.target.value)}
style={inputStyle}
required
/>

</>

)}


{/* EMAIL */}

<label style={labelStyle}>Email</label>

<input
type="email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
placeholder="Enter email"
style={inputStyle}
required
/>


{/* PASSWORD */}

<label style={labelStyle}>
{isForgot ? "New Password" : "Password"}
</label>

<input
type="password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
placeholder="Enter password"
style={inputStyle}
required
/>


{/* OTP */}

{otpSent && (

<>
<label style={labelStyle}>OTP</label>

<input
type="text"
value={otp}
onChange={(e)=>setOtp(e.target.value)}
placeholder="Enter OTP"
style={inputStyle}
required
/>

{timer > 0 && (

<p style={{color:"#555",fontSize:"14px"}}>
Resend OTP in {timer}s
</p>

)}

{timer === 0 && (

<p
style={{color:"#ff1e63",cursor:"pointer",fontSize:"14px"}}
onClick={sendOtp}
>
Resend OTP
</p>

)}

</>

)}


{/* SEND OTP */}

{(isRegister || isForgot) && !otpSent && (

<button
type="button"
onClick={sendOtp}
style={buttonStyle}
>
Send OTP
</button>

)}


{/* SUBMIT */}

{otpSent && (

<button type="submit" style={buttonStyle}>

{isRegister
? "Register"
: isForgot
? "Reset Password"
: "Login"}

</button>

)}


{/* LOGIN BUTTON */}

{!isRegister && !isForgot && (

<button type="submit" style={buttonStyle}>
Login
</button>

)}


{/* FORGOT PASSWORD */}

{!isRegister && !isForgot && (

<p
style={forgotStyle}
onClick={()=>setIsForgot(true)}
>
Forgot Password?
</p>

)}

</form>


<p style={bottomText}>

{isRegister ? "Already have an account?" : "New User?"}

<span
style={bottomLink}
onClick={()=>{

setIsRegister(!isRegister);
setIsForgot(false);
setOtpSent(false);
setTimer(0);

}}
>

{isRegister ? " Login now" : " Register now"}

</span>

</p>

</div>

);

}


/* STYLES (same as yours) */

const containerStyle={
minHeight:"100vh",
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
background:"linear-gradient(135deg,#7b5cff,#ff4d8d)",
fontFamily:"Arial",
padding:"20px"
};

const logoCircle={
width:"70px",
height:"70px",
background:"rgba(255,255,255,0.3)",
borderRadius:"20px",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontSize:"28px",
marginBottom:"20px"
};

const titleStyle={
color:"#fff",
fontSize:"36px",
fontWeight:"bold"
};

const cardStyle={
background:"#fff",
padding:"35px",
borderRadius:"25px",
width:"380px",
boxShadow:"0 15px 40px rgba(0,0,0,0.2)"
};

const labelStyle={ fontWeight:"600" };

const inputStyle={
width:"100%",
padding:"14px",
marginTop:"8px",
marginBottom:"20px",
borderRadius:"15px",
border:"none",
background:"#f2f2f2"
};

const buttonStyle={
width:"100%",
padding:"14px",
borderRadius:"30px",
border:"none",
background:"#ff1e63",
color:"#fff",
fontWeight:"bold",
cursor:"pointer",
marginTop:"10px"
};

const forgotStyle={
color:"#ff4d8d",
cursor:"pointer",
marginTop:"10px"
};

const bottomText={
marginTop:"20px",
color:"#fff"
};

const bottomLink={
fontWeight:"bold",
cursor:"pointer"
};

export default LoginScreen;