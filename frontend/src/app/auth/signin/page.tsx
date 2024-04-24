import {SignInPage} from '@/components/signIn/signInPage'
import Discover from '@/components/signup/discover'
import React from 'react'

const page = () => {
  return (
    <div className=' min-h-[100vh] w-[100vw] flex items-center bg-gray-200 justify-center '>
        <div className=' items-center min-h-[75vh] w-[80vw] md:w-[100vw] lg:w-[80vw] bg-white flex max-w-[1200px] rounded-2xl p-4'>
            <Discover/>
            <SignInPage/>
        </div>
    </div>
  )
}

export default page