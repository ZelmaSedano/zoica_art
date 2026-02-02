import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

// component imports
import Taskbar from '../components/Taskbar'
import '../components/Taskbar.css'
import DesktopIcon from '../components/DesktopIcon';
import '../components/DesktopIcon.css';

type HoroscopeData = {
    data: {
        date: string;
        horoscope_data: string;
    };
};

const images = [
        {
            title:'Big Scary',
            id: '12',
            url: 'http://www.etsy.com'
        },
        {
            title:'Hanging Man',
            id: '13',
            url: 'http://www.etsy.com'
        },
                {
            title:'Wizard',
            id: '19',
            url: 'http://www.etsy.com'
        },
        {
            title:'Princess',
            id: '8',
            url: 'http://www.etsy.com'
        },
        {
            title:'Chronic Wasting',
            id: '14',
            url: 'http://www.etsy.com'
        },
        {
            title:'Joten',
            id: '7',
            url: 'http://www.etsy.com'
        }
    ];

function Game() {
    // portfolio dropdown
    const portfolioRef = useRef<HTMLLIElement>(null);
    // dragging feature
    const windowRef = useRef<HTMLDivElement | null>(null);
    // clock
    const location = useLocation();

    // STATES
    const [position, setPosition] = useState(() => {
        const saved = sessionStorage.getItem('windowPosition');
        // if there isn't a saved position, center the window on default load
        return saved ? JSON.parse(saved) : { 
            x: Math.max(0, (window.innerWidth - 1000) / 2),
            y: Math.max(0, (window.innerHeight - 600) / 2)
        };
    });
    // taskbar clock
    const [currentTime, setCurrentTime] = useState(new Date());
    // window visibility
    const [isVisible, setIsVisible] = useState(true);
    // drag the content window
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // icons
    const [showCatModal, setShowCatModal] = useState(false);
    const [showYesModal, setShowYesModal] = useState(false);
    const [showLoveModal, setShowLoveModal] = useState(false);

    const [showScreamModal, setShowScreamModal] = useState(false);

    // horoscope API states
    const [showHoroscopeModal, setShowHoroscopeModal] = useState(false);
    const [horoscopeData, setHoroscopeData] = useState<HoroscopeData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sign, setSign] = useState('aries'); // Default sign

    const [clippyPosition, setClippyPosition] = useState({ x: 0, y: 0 });
    const [showClippyModal, setShowClippyModal] = useState(false);
    const [chatbotInput, setChatbotInput] = useState('');
    const [chatHistory, setChatHistory] = useState<Array<{sender: string, message: string}>>([]);
    const [shouldShake, setShouldShake] = useState(false);

    // API fetches
    const fetchHoroscope = async (sign: string) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/horoscope?sign=${sign.toLowerCase()}`); // <-- No full URL needed
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            setHoroscopeData(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch horoscope";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    const handleGetHoroscope = () => {
    fetchHoroscope(sign);
    };

    // getters
    // const getChatbotResponse = async (input: string): Promise<string> => {
    //     try {
    //         const response = await fetch('/api/chatbot', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ message: input })
    //         });
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         const data = await response.json();
    //         return data.message;
    //         } catch (error) {
    //             console.error('Chatbot error:', error);
    //             return "Sorry, I'm having trouble responding right now!";
    //         }
    // };

    // useEffects
    // save the position of the window to session storage
    useEffect(() => {
        sessionStorage.setItem('windowPosition', JSON.stringify(position));
    }, [position]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer); // Cleanup
    }, []);
    
    // CLIPPY
    // clippy useEffect, keeps him stuck to the bottom-right
    useEffect(() => {
        const updateClippyPosition = () => {
            // get document height
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight,
                document.body.clientHeight,
                document.documentElement.clientHeight
            );
            
            setClippyPosition({
            x: window.innerWidth - 80,
            y: documentHeight - 150
            });
        };

        updateClippyPosition();

        window.addEventListener('resize', updateClippyPosition);
        window.addEventListener('load', updateClippyPosition);
        return () => {
            window.removeEventListener('resize', updateClippyPosition);
            window.removeEventListener('load', updateClippyPosition);
        };
    }, [location.pathname]);

    useEffect(() => {
        // Check if shake has already been shown in this session
        const hasShaken = sessionStorage.getItem('clippyShaken');
        
        if (!hasShaken) {
            // Trigger the shake
            setShouldShake(true);
            // Mark as shaken for this session
            sessionStorage.setItem('clippyShaken', 'true');
            
            // Reset after animation completes (adjust time to match your CSS animation duration)
            const shakeTimer = setTimeout(() => {
                setShouldShake(false);
            }, 1000); // Adjust this time to match your animation duration
            
            return () => clearTimeout(shakeTimer);
        }
    }, []);
    // clippy shakes on page reload, not just first visit
    useEffect(() => {
        return () => {
            // Reset on page unload if you want it to shake on next visit
            sessionStorage.removeItem('clippyShaken');
        };
    }, []);


    const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start dragging if clicking on dropdown or its children
        if (
            (e.target as HTMLElement).closest('.blue-bar') && 
            !(e.target as HTMLElement).closest('.x-button') &&
            !(e.target as HTMLElement).closest('.portfolio-dropdown') &&
            !(e.target as HTMLElement).closest('.portfolio-link-wrapper')
        ) {
            const rect = windowRef.current?.getBoundingClientRect();
            if (!rect) return;
            setIsDragging(true);
            setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
            });
        }
    };
    // native DOM event handlers (used with addEventListener)
    const handleNativeMouseMove = (e: MouseEvent) => {
        if (isDragging && windowRef.current) {
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            const { offsetWidth, offsetHeight } = windowRef.current;
            
            setPosition({
                x: Math.max(0, Math.min(newX, window.innerWidth - offsetWidth)),
                y: Math.max(0, Math.min(newY, window.innerHeight - offsetHeight))
            });
        }
    };
    const handleNativeMouseUp = () => setIsDragging(false);
    useEffect(() => {
        document.addEventListener('mousemove', handleNativeMouseMove);
        document.addEventListener('mouseup', handleNativeMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleNativeMouseMove);
            document.removeEventListener('mouseup', handleNativeMouseUp);
        };
    }, [isDragging, dragOffset]);


    // toggle visibility
    const toggleWindow = () => setIsVisible(!isVisible);

    return (
        <>
            {/* cat icon */}
            <div className="desktop">
                {/* when you click the desktop icon, setShowModal is set to true */}
                <DesktopIcon
                    icon="images/cat.png"
                    label="meowdy"
                    x={50}
                    y={35}
                    onClick={() => setShowCatModal(true)}
                />

                {showCatModal && (
                    <div className="modal-overlay" onClick={() => setShowCatModal(false)}>{/* when the user clicks again, setShowModal is set to false (modal isn't shown) */}
                    {/* if you click inside the modal, then setShowModal ISN'T set to false */}
                    {/* onClick takes the event, and returns 'don't propogate this event' function */}
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span>Question...</span>
                                <button className='x-button' onClick={() => setShowCatModal(false)}>✕</button>
                            </div>
                            {/* body of modal */}
                            <div className="modal-body">Do you like cats?</div>
                            {/* CHALLENGE: add two buttons to this modal, 'yes', and 'I love them!', and return a message to the user based on their selection */}
                            <div className='cat-buttons'>
                                <button 
                                className='cat-button'
                                onClick={() => {
                                    setShowCatModal(false);
                                    setShowYesModal(true);
                                }}
                                >
                                    Yes
                                </button>
                                <button 
                                    className='cat-button'
                                    onClick={() => {
                                        setShowCatModal(false);
                                        setShowLoveModal(true);
                                    }}
                                >
                                    Yes, I do 
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

                {/* define what showYesModal is */}
                {showYesModal && (
                    <div className="modal-overlay" onClick={() => setShowYesModal(false)}>
                        <div className="modal cat-response-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span>Smart Answer</span>
                                <button className='x-button' onClick={() => setShowYesModal(false)}>✕</button>
                            </div>
                            <div className="modal-body">
                                <div className="image-container">
                                    <img src="/images/evil_cat.gif" alt="evil_cat" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showLoveModal && (
                    <div className="modal-overlay" onClick={() => setShowLoveModal(false)}>
                        <div className="modal cat-response-modals" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span>That's right, MINION</span>
                                <button className='x-button' onClick={() => setShowLoveModal(false)}>✕</button>
                            </div>
                            <div className="modal-body">
                                <div className="image-container">
                                    <img src="/images/evil_cat.gif" alt="evil_cat" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/* scream icon */}
            <div className="desktop">
                <DesktopIcon
                    icon="/images/scream_2.png"
                    label="RING RING"
                    x={50}
                    y={145}
                    onClick={() => setShowScreamModal(true)}
                />

                {showScreamModal && (
                    <div className="modal-overlay" onClick={() => setShowScreamModal(false)}>

                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className='scream-modal'>I know what you did last summer</span>
                            <button className='x-button' onClick={() => setShowScreamModal(false)}>✕</button>
                        </div>

                        <div className="modal-body">
                            <img src="/images/wassup.gif" className='gif' alt="evil_cat" />
                        </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* horoscope icon */}
            <div className="desktop">
                <DesktopIcon
                    icon="/images/scandique.jpg"
                    label="horoscope"
                    x={50}
                    y={255}
                    onClick={() => setShowHoroscopeModal(true)}
                    className=''
                    imgClassName='horoscope-icon'
                />

                {showHoroscopeModal && (
                    <div className="modal-overlay" onClick={() => setShowHoroscopeModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <span>Your Horoscope</span>
                            <button className='x-button' onClick={() => setShowHoroscopeModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="horoscope-controls">
                                <select 
                                    value={sign} 
                                    onChange={(e) => setSign(e.target.value)}
                                    className="horoscope-select"
                                >
                                    {["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"].map((sign) => (
                                    <option key={sign} value={sign}>
                                        {sign.charAt(0).toUpperCase() + sign.slice(1)}
                                    </option>
                                    ))}
                                </select>
                                
                                <button 
                                    onClick={handleGetHoroscope}
                                    className="horoscope-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Loading..." : "Get Horoscope"}
                                </button>
                            </div>

                            {error && <div className="error">{error}</div>}

                            {horoscopeData && (
                                <div className="horoscope-results">
                                    <h3>{sign.charAt(0).toUpperCase() + sign.slice(1)}</h3>
                                    <p><strong>Date:</strong> {horoscopeData.data.date}</p>
                                    <p><strong>Horoscope Data:</strong> {horoscopeData.data.horoscope_data}</p>
                                </div>
                            )}
                        </div>
                        </div>
                    </div>
                    )}
            </div>

        {/* content window - draggable */}
            {/* if isVisible is true, */}
            {isVisible && (
                <div 
                    className={`window ${isVisible ? 'visible' : ''}`}
                    ref={windowRef}
                    style={{
                        position: 'absolute',
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        cursor: isDragging ? 'grabbing' : 'default'
                    }}
                    onMouseDown={handleMouseDown}
                >

                    {/* header */}
                    <header>
                        <section className='blue-bar'>
                            <img src="/images/16.ico" className='icon' alt="icon"/>
                            <section className='blue-bar-text'>Zoica Art</section>

                            <div className="button-container">
                                <button className='x-button' onClick={toggleWindow}>✕</button>
                            </div>
                        </section>

                        {/* *************************** NAVBAR ************************/}
                        <nav className='navbar'>
                            <ul>
                                <li className='button'>
                                    <Link to="/">
                                        <img src="/images/home.png" className='home-icon' alt='home'/>
                                        <p>Home</p>
                                    </Link>
                                </li>
                                <li className='button'>
                                    <Link to="/tarot">
                                        <img src="/images/tarot.png" className='home-icon' alt='home'/>
                                        <p>Tarot</p>
                                    </Link>
                                </li>
                                <li className='button'>
                                    <Link to="/norse">
                                        <img src="/images/d2.ico" className='home-icon' alt='home'/>
                                        <p>Mythology</p>
                                    </Link>
                                </li>
                                <li className={`button left-button ${location.pathname === '/game' ? 'active-game' : ''}`}>
                                    <Link to="/game">
                                        <img src="/images/game_art.png" className='home-icon' alt='home'/>
                                        <p>Game Art</p>
                                    </Link>
                                </li>
                                <li className='button'>
                                    <Link to="/commissions">
                                        <img src="/images/commissions.png" className='home-icon' alt='home'/>
                                        <p>Commissions</p>
                                    </Link>
                                </li>
                                <li className='button'>
                                    <Link to="/contact">
                                        <img src='/images/contact.png' className='contact-icon' alt='contact'></img>
                                        <p>Contact</p>
                                    </Link>
                                </li>   
                            </ul>
                        </nav>
                    </header>

                    {/* URL bar */}
                    <div className='url-container'>
                        <div className = 'url-bar'>
                            <div className = 'url-bar-small-1'>Address</div>
                            <div className = 'url-bar-large'>
                                <div className='dropdown-container'>
                                    <div className='url-text'>http://www.geocities.com/val_is_best_dev</div>
                                </div>
                                <button className='url-dropdown-button'>▼</button>
                            </div>
                            <div className = 'url-bar-small-2'>Links</div>
                        </div>
                    </div>

                    {/* window content */}
                    <div className='content'>
                        <div className='homepage-banners'>
                            <div className='inner-banner-text'>
                                <p className='banner'>Zoica Art</p>
                                <p className='banner-1'>Explore Your Dark Fantasy</p>
                            </div>
                        </div>

                        <div className="img-grid">
                            {images.map((image, index) => (
                                <div key={index}>
                                    <div className='grid-container'>
                                        <div className='image-title'>{image.title}</div>
                                        <a href={image.url} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={`/images/${image.id}.jpg`} // Changed to use public folder path
                                                title={`${image.id} website`}

                                                alt={image.id}
                                                className='image clickable-image'
                                            />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* content footer */}
                            <div className="xp-footer-line"></div>
                    </div>
                </div>
            )}

            <Taskbar
                isVisible={isVisible} 
                toggleWindow={toggleWindow}
                currentTime={currentTime}
            />
        </>
    );
}

export default Game;