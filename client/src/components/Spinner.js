import { useState, CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

import React from 'react'

const Spinner = () => {
  return (
    <div className="d-flex justify-content-center spinner">
  <div className="spinner-border" role="status">
  </div>
  <span className="sr-only">Loading...</span>
</div>

  )
}

export default Spinner