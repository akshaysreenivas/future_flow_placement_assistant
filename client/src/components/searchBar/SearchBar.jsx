import React from 'react'
import { Button, Form } from 'react-bootstrap'
import {FiSearch} from 'react-icons/fi'
function SearchBar({setSearch,value}) {
  return (
    <div className="d-flex mb-4">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              value={value}
              aria-label="Search"
              onChange={(e)=>setSearch(e.target.value)}
            />
            <Button variant="outline-secondary"><FiSearch/></Button>
          </div>
  )
}

export default SearchBar