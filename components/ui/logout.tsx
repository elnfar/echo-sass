'use client'

import {signOut} from 'next-auth/react'
import { DropdownMenuItem } from './dropdown-menu'

export default function Logout() {
  return (
    <DropdownMenuItem onClick={() => signOut()}>
        Log out
    </DropdownMenuItem>
  )
}
