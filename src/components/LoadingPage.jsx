import React from 'react'
import { BeatLoader } from 'react-spinners';

const LoadingPage = () => {
    return (
        <div className='entry-container'>
        <BeatLoader
            color="#3da2eb"
            loading
            margin={3}
            size={20}
            speedMultiplier={1}
        />
        <h3 className='mt-5' style={{ color: 'skyblue' }}>
            데이터를 불러오고 있습니다👋🏻
        </h3>
        </div>
    )
}

export default LoadingPage
