"use client"
import React, { useEffect, useState } from 'react'
import "./nav.scss"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import CreateKnot from "../../components/createKnots/CreateKnot"
import { useSelector } from 'react-redux'

const Nav = () => {
    const { user } = useSelector((state) => state.user)
    const [open, setOpen] = useState(false)
    const router = useRouter()


    const NavItem = ({ href, children }) => {
        const pathname = usePathname()
        const isActive = pathname === href
        return (
            <Link href={href} className={`nav-link ${isActive ? "active" : ""}`}>
                {children}
            </Link>
        )
    }
    return (
        <div className='Nav'>
            <div className="routes">
                <div className="box">
                    <NavItem href={'/'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            aria-label="Home">
                            <path d="M3 10.5L12 3l9 7.5" />
                            <path d="M5 10v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9" />
                        </svg>
                    </NavItem>
                </div>
                <div className="box">
                    <NavItem href={'/search'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            aria-label="Search">
                            <circle cx="11" cy="11" r="7" />
                            <path d="M20 20l-3.5-3.5" />
                        </svg>
                    </NavItem>
                </div>
                <div className="box">
                    <button onClick={() => setOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            aria-label="Add">
                            <path d="M12 5v14" />
                            <path d="M5 12h14" />
                        </svg>
                    </button>
                </div>
                <div className="box">
                    <NavItem href={'/activity'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            aria-label="Notifications">
                            <path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 7H3s3 0 3-7" />
                            <path d="M10 20a2 2 0 0 0 4 0" />
                        </svg>
                    </NavItem>
                </div>
                <div className="box">
                    {user?.username && (
                        <button
                            onClick={() => router.push(`/@${user.username}`)}
                            className="nav-link"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                aria-label="Profile">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20a8 8 0 0 1 16 0" />
                            </svg>
                        </button>
                    )}
                </div>

            </div>

            <CreateKnot open={open} setOpen={setOpen} />

        </div>
    )
}

export default Nav
