"use client"
import Loading from '../../components/loadingSpinner/Loading'
import ProtectedRoute from '../../components/ProtectedRoute'
import axios from '../../lib/axiosConfig'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import "./style.scss"
const SearchPage = () => {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!query.trim() || query.length < 2) {
            setResults([]);
            setMessage("")
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await axios.post("/api/user/search-user", { word: query });
                const users = res.data.users || []
                setResults(users);

                if (users.length === 0) {
                    setMessage("No User Found")

                }
                else {
                    setMessage("")
                }
            } catch (error) {
                console.log(error)
                setMessage("Something went wrong");
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [query]);


    return (
        <ProtectedRoute>
            <div className='Search'>
                <div className="search-container">
                    <div className="top-layer">
                        <div className="search-bar">
                            <input onChange={(e) => setQuery(e.target.value)} value={query} type="text" className="search-input" placeholder="Search" />
                            <button className="search-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* backend -> User avatar , username , later-bio-name */}

                    {
                        loading ? <Loading /> : message ? (
                            <p className="no-result">{message}</p>
                        ) : (
                            <div className={`search-content ${results.length > 0 ? "pb-16" : "pb-0"} `}>
                                {
                                    results.map((profile, i) => (
                                        <div onClick={(() => router.push(`/@${profile.username}`))} key={i} className="box">
                                            <div className="left-side">
                                                <img src={profile.avatar || "./user_logo.png"} alt="" />

                                                <div className="info">
                                                    <h1>{profile.username}</h1>
                                                    <p>{profile.bio_name || ""}</p>
                                                </div>
                                            </div>

                                            <div className="right-side">
                                                <button>Follow</button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                    {
                        query.trim().length === 0 && (
                            <div className="other-content">
                                axime amet fugit reiciendis unde natus voluptas perspiciatis ullam porro! Provident iusto praesentium consequuntur ipsam exercitationem! Ab, modi aliquam? Debitis quae neque fugiat esse quibusdam doloribus nemo a porro, officiis assumenda est sequi voluptate beatae quas dolores minus, ea magnam sint, aliquam facilis aliquid enim eveniet in!
                            </div>
                        )
                    }
                </div>
            </div>

        </ProtectedRoute>
    )
}

export default SearchPage
