import React from 'react'
import './index.css'

export default ({children, name, className, style}) => (
  <div className={`headerLine ${className || ''}`} style={style}>
    <p className="name">{name}</p>
    {children}
  </div>
)
