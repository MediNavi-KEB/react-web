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
    const onClickMoveLocal = (place) => {
        navigate(`/local?query=${place.hospital_name}&lat=${place.latitude}&lng=${place.longitude}`);
    };

    const onClickDelete = async(favoriteId) => {
        console.log(favoriteId);
        try {
            await axios.delete(`/favorite/delete_by_id/${favoriteId}`);
            setFavorites(favorites.filter(fav => fav.favorite_id !== favoriteId)); 
        } catch (error) {
            console.error('Error deleting favorite', error); 
        }
    }

    return (
        <div className='saved-container'>
            <div className='title'>Saved</div>
            <Header/>
            <hr className='saved-divider'/>
            <ul className="saved-placesList">
                {favorites.map(place=> (
                <li key={place.hospital_phone} className="saved-item">
                    <div className="saved-info">
                        <h5>{place.hospital_name}</h5>
                        <span>{place.hospital_address}</span>
                        <span className="saved-tel">{place.hospital_phone}</span>
                    </div>
                    <div className='saved-button'>
                        <button onClick={()=>onClickMoveLocal(place)} className='saved-button-local'>지도</button>
                        <button onClick={()=>onClickDelete(place.favorite_id)} className='saved-button-delete'>삭제</button>
                    </div>
                </li>
            ))}
            </ul>
        </div>
    )
}

export default Saved
