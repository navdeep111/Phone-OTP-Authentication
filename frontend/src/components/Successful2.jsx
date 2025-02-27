import React, { useContext } from 'react'
import done from '../assets/icons/success-icon.svg'
import { Link, useNavigate } from 'react-router-dom'
import Context from '../context/AppContext'
export default function Successful() {
  const navigate = useNavigate();
  
  // const {setProfileCompleted} = useContext(Context)
  const { mobileNumber } = useContext(Context);

  return (
    <div className='flex flex-col justify-between h-full sm:-ml-[20px] sm:-mt-0 -mt-[100px]'>
      <div></div>
      <div className='flex flex-col items-center '>
        <img src={done} alt="" srcset="" className='mx-auto w-[200px] h-[200px]'/>
        <h1 className='font-Montserrat mx-auto h-[28px] font-[700] text-[27px] leading-[28px] mt-[40px]'>Successful</h1>
        <h2 className='text-center font-Montserrat text-[14px] font-[500] leading-[116%] mx-auto mt-[7px]'>Account created successfully.</h2>
        <Link to='/success-signup' className= 'text-center mt-[40px] sm:w-[416px] w-[350px] h-[44px] bg-blue-200 rounded-[8px] text-[14px] font-[600] font-Montserrat text-blue-600 pt-[12px]'>Continue</Link>
      </div>
    </div>
  )
}
