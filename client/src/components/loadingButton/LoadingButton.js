import React from 'react'
import { Button } from 'react-bootstrap';
import Spinner from "react-bootstrap/esm/Spinner";

function LoadingButton({size,className,variant}) {
  return (
    <Button type="button" className={className}>
    <Spinner
      as="span"
      animation="border"
      size={size}
      role="status"
      aria-hidden="true"
      variant={variant}
    />
  </Button>
  )
}

export default LoadingButton