import React from 'react'
import Spinner from "react-bootstrap/esm/Spinner";

function LoadingButton({size,className,variant}) {
  return (
    <button type="button" className={className}>
    <Spinner
      as="span"
      animation="border"
      size={size}
      role="status"
      aria-hidden="true"
      variant={variant}
    />
  </button>
  )
}

export default LoadingButton