import type { FC } from "react"

interface IProps{
    register: any, 
    label: string, 
    name:string, 
    type: string, 
    rules?:any
}

const Input:FC<IProps> = ({register, label, name, type, rules})=> {
  return (
    <div className="bg-white p-3 rounded-xl flex flex-col shadow">
        <label className="text-[#6E6A7C] text-xs mb-1">{label}</label>
        <input className="outline-0 text-xs" type={type} {...register(name, rules)} />
    </div>
  )
}

export default Input