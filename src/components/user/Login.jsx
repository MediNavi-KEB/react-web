import { Button, Card, Form, InputGroup } from 'react-bootstrap'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Login = () => {
    const navi = useNavigate(); 

    const [form, setForm] = useState({
        user_id : '',
        password : ''
    })

    const {user_id, password} = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    const handleLogin = async() => {
        try {
            const response = await axios.post('/user/login', {
                user_id, password
            },{
                headers: {
                    'Content-Type' : 'application/json'
                }
            });

            if (response.status === 200){
                alert("로그인 성공!");
                localStorage.setItem('user_id', user_id)
                navi('/home')
            }
        } catch(error){
            if(error.response){
                alert("ID, PW를 다시 입력하세요");
            }
        }
    }

    const KeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleLogin();
        }
    };

    return (
        <div className="login-container">
            <h1>WELCOME</h1>
            <h1 style={{color :'#368AFF'}}>MediNavi</h1>
            <InputGroup className='user-input-group-custom my-4'>
                <InputGroup.Text style={{ width: '70px' }} className='justify-content-center'>ID</InputGroup.Text>
                <Form.Control value={user_id} name='user_id' onChange={onChange}/>
            </InputGroup>
            <InputGroup className='user-input-group-custom mb-4'>
                <InputGroup.Text style={{ width: '70px'}} className='bold-text justify-content-center'>PW</InputGroup.Text>
                <Form.Control value={password} name='password' type="password" onChange={onChange} onKeyDown={KeyDown}/>
            </InputGroup>
            <div className='text-center mt-3'>
            <Button  style={{ backgroundColor: '#368AFF', borderColor: '#368AFF'}}variant="info" size ='lg' className=" me-4" onClick={handleLogin}>Login</Button>
            <Button variant="secondary" size ='lg' onClick={() => navi('/join')}>Sign Up</Button>
            </div>
        </div>
    )
}

export default Login
