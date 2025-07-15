import React from 'react'

function Container({ children }) {
  return (
    <>
      <div className='w-full flex flex-wrap text-7xl mx-auto px-4'>{children}</div>
    </>
  )
}

export default Container
