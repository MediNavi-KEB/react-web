import React, { useEffect, useState } from 'react'
import Header from '../basis/Header'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Saved = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');
    const [favorites, setFavorites] = useState([]);
    const [filteredFavorites, setFilteredFavorites] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`/favorite/get/${userId}`);
                setFavorites(response.data);
                setFilteredFavorites(response.data);
                
                const uniqueCategories = [...new Set(response.data.map(fav => fav.category))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Error fetching favorites', error);
            }
        };
        fetchFavorites();
    }, [userId]);

    const onClickMoveLocal = (place) => {
        navigate(`/local?query=${place.hospital_name}&lat=${place.latitude}&lng=${place.longitude}`);
    };

    const onClickDelete = async(favoriteId) => {
        try {
            await axios.delete(`/favorite/delete_by_id/${favoriteId}`);
            const updatedFavorites = favorites.filter(fav => fav.favorite_id !== favoriteId);
            setFavorites(updatedFavorites);
            setFilteredFavorites(updatedFavorites.filter(fav => !selectedCategory || fav.category === selectedCategory));
        } catch (error) {
            console.error('Error deleting favorite', error);
        }
    }

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        if (category === '') {
            setFilteredFavorites(favorites);
        } else {
            setFilteredFavorites(favorites.filter(fav => fav.category === category));
        }
    };

    return (
        <div className='saved-container'>
            <Header/>
            <div className='saved-header'>
                <div className='saved-title'>Saved</div>
            </div>
            <div className='saved-filter'>
                {/* <div className='saved-filter-label'>진료과 : </div> */}
                <select className="saved-select-option" onChange={handleCategoryChange} value={selectedCategory}>
                    <option value=''>전체</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
        
            <hr className='saved-divider'/>
            <ul className="saved-placesList">
                {filteredFavorites.map(place => (
                    <li key={place.hospital_phone} className="saved-item">
                        <div className="saved-info">
                            <h5>{place.hospital_name}</h5>
                            <span>{place.hospital_address}</span>
                            <span className="saved-tel">{place.hospital_phone}</span>
                            <span className="saved-category">진료과 : {place.category}</span>
                        </div>
                        <div className='saved-button'>
                            <button onClick={() => onClickMoveLocal(place)} className='saved-button-local'>지도</button>
                            <button onClick={() => onClickDelete(place.favorite_id)} className='saved-button-delete'>삭제</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Saved
