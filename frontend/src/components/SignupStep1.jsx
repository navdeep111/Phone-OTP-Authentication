import { useEffect, useState } from "react";
import { useContext } from "react";
import { Authenticate, initOTPless, verifyOTP } from "../utils/initOtpless";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { useAvailabilityContext } from "../AvailabilityContext";
import SecondaryButton from "./Secondbutton";
import Context from '../context/AppContext';
import { toast } from "react-toastify";

function SignupStep1() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [activeSection, setActiveSection] = useState("PHONE");
  const [mobileNumber, setMobileNumber] = useState('');
  const { setMobileNumber: setGlobalMobileNumber } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    initOTPless(handleUserData);
  }, []);

  const handleUserData = async (otplessUser) => {
    console.log(otplessUser);

    const identityValue =
      otplessUser?.identities?.[0]?.identityValue || "No Identity Found";
    setMobileNumber(identityValue);
    setGlobalMobileNumber(identityValue);
  

    try {
      const response = await axios.post("/api/auth/signup", {
        phoneNumber: identityValue,
      });

      if (response.data.userExists) {
        navigate("/login");
      } else {
        toast.success("OTP verified and login successful");
        localStorage.setItem("token", response.data.token);
        navigate("/success-signup");
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
      toast.error("User already exist please login.");
    }

    localStorage.setItem("otplessUser", JSON.stringify(otplessUser));
  };

  const switchActiveSection = (e) => {
    setActiveSection(e.target.value);
    setPhone("");
    setEmail("");
  };

  const handleProceed = async () => {
    try {
      if (activeSection === "PHONE") {
        const res = await Authenticate({ channel: "PHONE", phone });
        if (res.success) {
          document.getElementById("mobile-input").disabled = true;
             toast.success("OTP sent on your phone. Check message or WhatsApp");

        }
      } 
      } catch (error) {
      console.error("Error during authentication:", error);
      alert("An error occurred during authentication.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const res = await verifyOTP({
        channel: activeSection,
        otp,
        phone,
        email,
      });
      if (res.success) {
        document.getElementById("otp-input").disabled = true;
        setOtp("Verified");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      alert("An error occurred during OTP verification.");
    }
  };

  return (
    <div className="p-2 rounded-lg max-w-md mx-auto ">
      <div className="text-center">
        <div className="text-gray-700 font-medium text-sm">
          Welcome back to{" "}
          <span className="text-gray-900 font-semibold">AI Coding Hub</span>, please
          log in to continue
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full space-y-6">
        <div className="w-full">
          <input
            type="radio"
            id="mobile"
            name="section"
            value="PHONE"
            checked={activeSection === "PHONE"}
            onChange={switchActiveSection}
            className="hidden"
          />
        </div>

        {activeSection === "PHONE" && (
          <div id="mobile-section" className="w-full">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
              placeholder="Enter mobile number"
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              onClick={handleProceed}
              className="w-full py-2 bg-blue-600 text-white rounded-lg mt-2 hover:bg-blue-700 transition duration-200"
            >
              Proceed
            </button>
          </div>
        )}

        <div id="otp-section" className="w-full">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            minLength={6}
            maxLength={6}
          />
          <button
            onClick={handleVerifyOTP}
            className="w-full py-2 bg-blue-600 text-white rounded-lg mt-2 hover:bg-blue-700 transition duration-200"
          >
            Verify OTP
          </button>
        </div>

        <button
          onClick={() =>
            Authenticate({ channel: "OAUTH", channelType: "WHATSAPP" })
          }
          className="w-full py-2 bg-green-600 text-white rounded-lg mt-2 hover:bg-green-700 transition duration-200"
        >
          Authenticate with WhatsApp
        </button>
        {/* <button onClick={() => Authenticate({ channel: 'OAUTH', channelType: 'GOOGLE' })}>
        Authenticate with Gmail
      </button> */}
        <div className="flex items-center justify-between mt-4">
          <hr className="flex-1 bg-[#B8BFC7] h-[1px]" />
          <span className="text-[#B8BFC7] text-xs">
            Already have an account?
          </span>
          <hr className="flex-1 bg-[#B8BFC7] h-[1px]" />
        </div>

        <SecondaryButton title="Login" action={() => navigate("/")} />
      </div>
      <div className="text-center mt-4 text-[#5B6572] text-sm font-normal">
      Don't have an account? Sign up to access your personalized dashboard
      and explore AI coding resources.
      </div>
    </div>
  );
}

export default SignupStep1;
