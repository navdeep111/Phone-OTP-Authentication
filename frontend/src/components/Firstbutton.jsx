
import React from 'react'

export default function Fristbutton(props) {
  return (
    <button className=" 
    font-Montserrat font-semibold text-sm text-white leading-[116% sm:px-4 px-8 mx-7 py-3 rounded-lg w-full sm:ml-0 ml-0 mt-2 mb-3 " onClick={()=>{props.action()}}>{props.title}</button>
   
  )
}
