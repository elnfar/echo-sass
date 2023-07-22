

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import SideBarList from './side-bar'



const links = [
    {
        href:'/admin/profile',
        label:'Profile'
    },
    {
        href:'/admin/team',
        label:'Team'
    },
    {
        href:'/admin/billing',
        label:'Billing'
    }

]


const SideBar = () => {
    return (
        <ul className='w-1/5 px-4'>
            {
                links.map((item) => (
                    <SideBarList href={item.href} label={item.label} key={item.href}/>
                ))
            }
        </ul>
    )
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {




  return (
    <div className='container mx-auto flex gap-4 divide-x-2 py-4'>
        <SideBar/>
        <div className='px-4 flex-grow'>{children}</div>
    </div>
  )
}
