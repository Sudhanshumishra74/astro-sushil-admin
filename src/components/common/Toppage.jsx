import React from 'react'
import { Link } from 'react-router-dom'

function Toppage({ Title }) {
  return (
    <>
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-black">
            {Title}
          </h1>
         
          <nav className="flex items-center gap-2 text-sm text-[#9a9abf]">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>›</span>
            <span className="text-primary font-medium">{Title}</span>
          </nav>
        </div>
    </>
  )
}

export default Toppage
