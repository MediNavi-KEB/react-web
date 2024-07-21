import { Button, Card, Form, InputGroup } from 'react-bootstrap'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Login = () => {
    const navi = useNavigate(); 

    const [form, setForm] = useState({
        id : '',
        password : ''
    })

    const {id, password} = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    const handleLogin = async() => {
        try {
            const response = await axios.post('user/login', {
                id, password
            },{
                headers: {
                    'Content-Type' : 'application/json'
                }
            });

            if (response.status === 200){
                alert("로그인 성공!");
                navi('/home')
            }
        } catch(error){
            if(error.response){
                alert("ID, PW를 다시 입력하세요");
            }
        }
    }
    return (
        <div className="login-container">
            <Card className="card">
                <Card.Header className="card-header">
                    <h3 className='centered-text'>WELCOME</h3>
                </Card.Header>
                <Card.Body>
                    <InputGroup className='my-4'>
                        <InputGroup.Text style={{ width: '70px' }} className='justify-content-center'>ID</InputGroup.Text>
                        <Form.Control value={id} name='id' onChange={onChange}/>
                    </InputGroup>
                    <InputGroup className='mb-4'>
                        <InputGroup.Text style={{ width: '70px' }} className='justify-content-center'>PW</InputGroup.Text>
                        <Form.Control value={password} name='password' type="password" onChange={onChange}/>
                    </InputGroup>
                    <div className='text-center mt-3'>
                    <Button className="me-3" onClick={handleLogin}>Login</Button>
                    <Button variant="secondary" onClick={() => navi('/join')}>Sign Up</Button>
                    </div>
                    
                </Card.Body>
            </Card>
        </div>
    )
}

export default Login
