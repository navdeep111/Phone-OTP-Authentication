import { useEffect, useState, useRef } from "react";
import { useContext } from "react";
import { Authenticate, initOTPless, verifyOTP } from "../utils/initOtpless";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import SecondaryButton from "./Secondbutton";
import Context from '../context/AppContext';
import { toast } from "react-toastify";

function LoginStep1() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [activeSection, setActiveSection] = useState("PHONE");
  const [mobileNumber, setMobileNumber] = useState('');
  const hasNavigated = useRef(false);
  const { setMobileNumber: setGlobalMobileNumber } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    initOTPless(handleUserData);
  }, []);

  const handleUserData = async (otplessUser) => {
    if (hasNavigated.current) return;

    const identityValue =
      otplessUser?.identities?.[0]?.identityValue || "No Identity Found";

    setGlobalMobileNumber(identityValue);

    try {
      const response = await axios.post("/api/auth/login", {
        phoneNumber: identityValue,
      });

      if (response.data.message === "Login successful") {
        hasNavigated.current = true; 
        toast.success("OTP verified and login successful");
        localStorage.setItem("token", response.data.token);
        navigate("/success-login"); 
      } else {
        navigate("/signup"); 
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
      toast.error("User does not exist please signup.");
    }

    localStorage.setItem("otplessUser", JSON.stringify(otplessUser)); 
  };

  const switchActiveSection = (e) => {
    setActiveSection(e.target.value);
    setPhone("");
    setEmail("");
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
              id="mobile-input"
              placeholder="Enter mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              onClick={() => {
                Authenticate({ channel: "PHONE", phone })
                  .then((res) => {
                    if (res.success) {
                      // document.getElementById("mobile-input").disabled = true;
                      toast.success("OTP sent on your phone. Check message or WhatsApp");

                    }
                  })
                  .catch((error) => {
                    console.error("Authentication error:", error);
                  });
              }}
              className="w-full py-2 bg-blue-600 text-white rounded-lg mt-2 hover:bg-blue-700 transition duration-200"
            >
              Proceed
            </button>
          </div>
        )}

        <div id="otp-section" className="w-full">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
            id="otp-input"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            minLength={6}
            maxLength={6}
          />
          <button
            onClick={() => {
              verifyOTP({ channel: activeSection, otp, phone, email })
                .then((res) => {
                  if (res.success) {
                    // document.getElementById("otp-input").disabled = true;
                    setOtp("Verified");
                  }
                })
                .catch((error) => {
                  console.error("OTP verification error:", error);
                });
            }}
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

        <div className="flex items-center justify-between mt-4 w-full">
          <hr className="flex-1 bg-gray-300 h-[1px]" />
          <span className="text-gray-500 text-xs px-2">Don't have an account?</span>
          <hr className="flex-1 bg-gray-300 h-[1px]" />
        </div>

        <SecondaryButton title="Sign Up" action={() => navigate("/signup")} className="w-full py-2 bg-gray-200 text-white rounded-lg mt-2 hover:bg-gray-300 transition duration-200" />

        <div className="text-center mt-4 text-gray-600 text-sm font-normal">
          Don't have an account? Sign up to access your personalized dashboard
          and explore AI coding resources.
        </div>
      </div>
    </div>
  );
}

export default LoginStep1;