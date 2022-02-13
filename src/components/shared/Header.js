import React, { Fragment } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'
import FilterProblem from '../Problems/FilterProblem'

const linkStyle = {
	color: 'white',
	textDecoration: 'none'
}

const authenticatedOptions = (
	<>
		<Nav.Link>
			<Link to='/problems' style={linkStyle}>
				Problems
			</Link>
		</Nav.Link>
		<Nav.Link>
			<Link to='/problems/new' style={linkStyle}>
				Post a Problem
			</Link>
		</Nav.Link>
		<Nav.Link>
			<Link to='sign-out' style={linkStyle}>
				Sign Out
			</Link>
		</Nav.Link>
	</>
)

const unauthenticatedOptions = (
	<>
		<Nav.Link>
			<Link to='sign-up' style={linkStyle}>Sign Up</Link>
		</Nav.Link>
		<Nav.Link>
			<Link to='sign-in' style={linkStyle}>Sign In</Link>
		</Nav.Link>

	</>
)

const Header = ({ user, handleFilter, search, handleSearch }) => (
	<Navbar bg='dark' variant='dark' expand='md' id='navBar'>
		{/* <----- APP NAME -----> */}
		<Navbar.Brand className='mx-4'>
			<Link to='/' style={linkStyle}>
				<img src="/favicon-16x16.png" alt="DevXchange Logo" />
				DevXchange
			</Link>
		</Navbar.Brand>
		<Navbar.Toggle aria-controls='basic-navbar-nav'/>
		<Navbar.Collapse style={{'padding-top':'5px', 'justify-content':'right'}} id='basic-navbar-nav'>
		<Nav.Link>
			{/* <----- SEARCH BAR -----> */}
			<Link style={{'text-decoration':'none'}} to="/problems">
				<FilterProblem
					filterProblems={handleFilter}
					searchVal={search}
					searchChange={handleSearch}
				/>
			</Link>
		</Nav.Link>
			{/* <----- USER PROFILE -----> */}
			<Nav className='ml-auto'>
				{user && (

					<span className='navbar-text mr-2'><Link to="/profile" style={{'text-decoration':'none'}} className='name'>Profile</Link></span>

				)}
				{user ? authenticatedOptions : unauthenticatedOptions}
			</Nav>
		</Navbar.Collapse>
	</Navbar>
)

export default Header
