import React, { useEffect, useState } from 'react'
import Header from '../basis/Header'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Saved = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
            const fetchFavorites = async () => {
                try {
                    const response = await axios.get(`/favorite/get/${userId}`);
                    setFavorites(response.data);
                } catch (error) {
                    console.error('Error fetching favorites', error);
                }
            };
            fetchFavorites();
            
    }, [userId]);
    console.log(favorites);
    const onClickMoveLocal = (hospital_name) => {
        navigate(`/local?query=${hospital_name}`);
    }

    const onClickDelete = async(favoriteId) => {
        console.log(favoriteId);
        await axios.delete(`/favorite/delete_by_id/${favoriteId}`);
    }

    return (
        <div className='saved-container'>
            <div className='title mb-3'>Saved</div>
            <Header/>
            <ul className="saved-placesList">
                {favorites.map(place=> (
                <li key={place.hospital_phone} className="saved-item">
                    <div className="saved-info">
                        <h5>{place.hospital_name}</h5>
                        <span>{place.hospital_address}</span>
                        <span className="saved-tel">{place.hospital_phone}</span>
                    </div>
                    <div className='saved-button'>
                        <button onClick={()=>onClickMoveLocal(place.hospital_name)} className='saved-button-local'>지도</button>
                        <button onClick={()=>onClickDelete(place.favorite_id)} className='saved-button-delete'>삭제</button>
                    </div>
                </li>
            ))}
            </ul>
        </div>
    )
}

export default Saved
