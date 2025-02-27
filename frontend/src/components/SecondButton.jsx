
import React from 'react'

export default function SecondButton(props) {
    return (
        <button className="font-Montserrat color-white text-white font-[600] text-[14px]  leading-[116%] bg-blue-600 px-[24px] py-[14px] rounded-[8px] sm:w-full w-full sm:ml-0 ml-full mt-7 " onClick={()=>{props.action()}}>{props.title}</button>
    )
}
