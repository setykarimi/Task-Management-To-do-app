import { type FC } from "react"

interface IProps{
    register: any, 
    label: string, 
    name:string, 
    rules?:any
}

const Textarea:FC<IProps> = ({register, label, name, rules})=> {

  return (
    <div className="bg-white p-3.5 rounded-xl flex flex-col shadow">
        <label className="text-[#6E6A7C] text-xs mb-1">{label}</label>
        <div className="flex gap-1">
          <textarea rows={4} className="outline-0 text-xs w-full" type="text" {...register(name, rules)} />
        </div>
    </div>
  )
}

export default Textarea