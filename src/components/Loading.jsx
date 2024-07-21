import React, { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'


const Loading = () => {
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        const timer = setTimeout(()=>{
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if(loading) return (
        <div className='text-center'>
            <BeatLoader
                color="#44b04b"
                loading
                margin={3}
                size={20}
                speedMultiplier={1}
            />
            <h3 className='mt-5' style={{color:'green'}}>페이지를 불러오고 있습니다👋🏻</h3>
        </div>
    )
}

export default Loading
