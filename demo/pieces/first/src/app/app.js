import React from 'react'
import PropTypes from 'prop-types'

import Logo from './react.svg'


const FirstView = ({title, value, onChange}) => {
  return (
    <>
      <img src={Logo} alt="react" width={256}/>
      <h1 style={{ color: 'red'}}>{title}</h1>
      <input type="text" onChange={onChange} value={value} />
    </>
  )
}

FirstView.propTypes = {
  title: PropTypes.string.isRequired,
}

export default FirstView
