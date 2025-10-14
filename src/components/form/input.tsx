import { Eye, EyeSlash } from "iconsax-reactjs"
import { useState, type FC } from "react"
import type { ITask } from "../types"
import type { FieldErrors } from "react-hook-form"

interface IProps{
    register: any, 
    label: string, 
    name: keyof ITask, 
    type: string, 
    rules?: any
    errors: FieldErrors<ITask>
}

const Input:FC<IProps> = ({register, label, name, type, rules, errors})=> {
  const [showPass, setShowPass] = useState(false)
  const isPassword = type == "password"

  return (
    <div className={`bg-white p-3.5 rounded-xl flex flex-col shadow ${errors?.[name] && "border border-red-200 shadow-red-100"}`}>
        <label className="text-[#6E6A7C] text-xs mb-1">{label}</label>
        <div className="flex gap-1">
          <input className="outline-0 text-xs w-full" type={isPassword && showPass ? "text" : type} {...register(name, rules)} />
          {isPassword && <button type="button" className="cursor-pointer" onClick={()=>setShowPass(!showPass)}> {showPass ? <Eye size="16" color="#6E6A7C"/> : <EyeSlash size="16" color="#6E6A7C"/> }</button>}    
        </div>
    </div>
  )
}

export default Input