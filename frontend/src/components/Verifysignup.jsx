import React, { useRef, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Context from '../context/AppContext'; // Assuming your context is exported as Context from AppContext.js


const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mobileNumber } = location.state;
  const { setMobileNumber: setGlobalMobileNumber } = useContext(Context);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState(null);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    const inputValue = e.target.value.slice(-1).replace(/[^0-9]/g, '');
    newOtp[index] = inputValue;
    setOtp(newOtp);

    if (index < otp.length - 1 && inputValue !== '') {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const otpString = otp.join('');
      //console.log('OTP string:', otpString);
      //console.log('Mobile number:', mobileNumber);

      const response = await axios.post('/api/auth/login/check-otp', {
        phoneNumber: mobileNumber,
        otp: otpString,
      });

      console.log('Response:', response);

      if (response.status === 200) {
        console.log('OTP verification successful:', response.data);
        setGlobalMobileNumber(mobileNumber);
        navigate('/success-login', { state: { mobileNumber } });
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.response ? error.response.data : error);
      setError('Invalid OTP. Please try again.');
    }
  };

  return (

<div className='flex flex-col bg-[#FFFFFF]'>
<div className='flex flex-col sm:max-w-[480px] mx-auto sm:p-8 '>
  <div className='text-center'>
    <h1 className='font-Montserrat text-[32px] font-[700] leading-[44px]'>Verify</h1>
    <h2 className='font-Montserrat text-[14px] font-[500] leading-[116%] mt-[7px]'>
      Enter OTP which we sent to you
    </h2>
    <div className='mt-4 flex justify-center space-x-4'>
      {otp.map((value, index) => (
        <div key={index} className='relative'>
          <input
            type='text'
            value={value}
            onChange={(e) => handleOtpChange(e, index)}
            className='border font-Montserrat relative border-gray-300 rounded-md w-[62px] h-[44px] px-[16px] py-[12px] text-center text-[14px] font-[500] mt-[40px]'
            maxLength='1'
            ref={inputRefs[index]}
          />
        </div>
      ))}
    </div>
    {error && <div className='text-red-500 text-sm mt-2'>{error}</div>}
    <button
      onClick={handleVerifyOTP}
      className='inline-block h-[44px] sm:w-[416px] w-[300px] rounded-[8px] bg-[#E40443] text-center mx-auto mt-[16px] justify-center font-Montserrat text-[14px] font-[600] leading-[116%] text-white py-[15px]'
    >
      Verify OTP
    </button>
  </div>
  
</div>
<div className='text-center sm:mt-[334px] mt-[50px] text-[#5B6572] font-Montserrat text-[16px] font-normal sm:max-w-full max-w-[300px] mx-auto'>
    Join the community of smart and experienced doctors. Login to access your <br /> personalized dashboard, track
    your record or process and get informed by our services
  </div>
</div>
);
};


export default Verify;
