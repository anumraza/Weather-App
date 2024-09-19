// src/Modal.js
import React from 'react';
import './Modal.css';

const Modal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Type correct city name</p>
        <button 
  onClick={onClose} 
  onKeyDown={(event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      onClose(); 
    }
  }}
  tabIndex="0" 
  aria-label="Close" 
>
  Close
</button>
      </div>
    </div>
  );
};

export default Modal;
