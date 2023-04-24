import React from 'react'
import Spinner from "react-bootstrap/esm/Spinner";

function LoadingButton({size,className}) {
  return (
    <button type="button" className={className}>
    <Spinner
      as="span"
      animation="border"
      size={size}
      role="status"
      aria-hidden="true"
    />
  </button>
  )
}

export default LoadingButton