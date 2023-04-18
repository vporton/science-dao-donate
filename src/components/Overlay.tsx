import React from 'react'

const Overlay = ({ handleModal }: any) => {
    return (
        <div onClick={handleModal} className='fixed z-50 w-full h-screen bg-black bg-opacity-70'></div>
    )
}

export default Overlay