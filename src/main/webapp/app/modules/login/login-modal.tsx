import React from 'react';
import { ValidatedField } from 'react-jhipster';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Row, Col, Form } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import 'app/shared/layout/customStyles/loginForm.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

export interface ILoginModalProps {
  showModal: boolean;
  loginError: boolean;
  handleLogin: (username: string, password: string, rememberMe: boolean) => void;
  handleClose: () => void;
}

const LoginModal = (props: ILoginModalProps) => {
  const login = ({ username, password, rememberMe }) => {
    props.handleLogin(username, password, rememberMe);
  };

  const {
    handleSubmit,
    register,
    formState: { errors, touchedFields },
  } = useForm({ mode: 'onTouched' });

  const { loginError, handleClose } = props;

  const handleLoginSubmit = e => {
    handleSubmit(login)(e);
  };

  return (
  <section className="login">
  <div className="login_box">
  <div className="left">
  <div className="contact">
  <form onSubmit={handleLoginSubmit}>
    <h2 className="login-title">Sign in</h2>
    <div className="form-group">
      
      <input
        type="text"
        id="username"
        name="username"
        placeholder="Enter your Username "
        required
        autoComplete="off"
        data-cy="username"
        {...register('username', { required: 'Username cannot be empty!' })}
      />
      {errors.username && (
        <div className="error-message">{errors.username.message}</div>
      )}
    </div>
    <div className="form-group">
      
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Enter your Password"
        required
        autoComplete="off"
        data-cy="password"
        {...register('password', { required: 'Password cannot be empty!' })}
      />
      {errors.password && (
        <div className="error-message">{errors.password.message}</div>
      )}
    </div>
    
    <div className="form-group">
     
    <div className="button-container">
      <button type="submit" data-cy="submit" className="submit">
        SignIn
      </button>
      <Link to="/account/register">
        <button className="submit">Register</button>
      </Link>
    </div>
    </div>
  </form>
  </div>
			</div>
			<div className="right">
				
        
				
			</div>
		</div>
	</section>


  );
};

export default LoginModal;
