import { ChartCircle } from 'iconsax-reactjs'

export default function Loading() {
  return (
    <div className='flex justify-center mt-100'>
        <ChartCircle size="32" color="#5F33E1" className="animate-spin animate-spin-slow" />
    </div>
  )
}
