import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import './App.css';

import Taskbar from './components/Taskbar'
import './components/Taskbar.css'
import DesktopIcon from './components/DesktopIcon';
import './components/DesktopIcon.css'; // contains both icon + modal 

import send from './assets/send.png'
import earth from './assets/earth.ico'

type HoroscopeData = {
    data: {
        date: string;
        horoscope_data: string;
    };
};

function Contact() {
    // portfolio dropdown
    const portfolioRef = useRef<HTMLLIElement>(null);
    const windowRef = useRef<HTMLDivElement | null>(null)
    const location = useLocation();

    // states
    const [position, setPosition] = useState(() => {
        const saved = sessionStorage.getItem('windowPosition');
        return saved ? JSON.parse(saved) : { 
            x: Math.max(0, (window.innerWidth - 1000) / 2),
            y: Math.max(0, (window.innerHeight - 600) / 2)
        };
    });
    // timer state
    const [currentTime, setCurrentTime] = useState(new Date());
    // toggle state
    const [isVisible, setIsVisible] = useState(true);
    // dragging state
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
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

    // portfolio dropdown
    const [isPortfolioDropdownOpen, setIsPortfolioDropdownOpen] = useState(false);

    // Send button active state
    const [isButtonActive, setIsButtonActive] = useState(false);



    // contact window size state - check size of window to resize textarea
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const calculateTextareaHeight = () => {
    const otherElementsHeight = 500; // Adjust this value based on your layout
    const minHeight = 180;
    const maxHeight = 400; // Add a maximum height for sanity
    
    // Base calculation on the window's height, not screen position
    const availableHeight = windowSize.height - otherElementsHeight - 100; // Fixed offset
    
    let height = Math.max(minHeight, Math.min(availableHeight, maxHeight));
    
    // Optional: Keep your width-based constraints
    if (windowSize.width >= 901 && windowSize.width <= 1400) {
        height = Math.min(height, 185);
    }
    
    return height;
};
    // fetch - VITE WAS BLOCKING THIS FROM WORKING, REMEMBER TO UPDATE VITE.CONFIG NEXT
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

/////////////////////////////////////////////////////////////////////////////////////////////////
    // use effects

    // window position - window loads in middle of page
    useEffect(() => {
        sessionStorage.setItem('windowPosition', JSON.stringify(position));
    }, [position]);
    // timer 
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer); // Cleanup
    }, []);
    // contact window size - resize textarea
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    // send button useEffect
    useEffect(() => {
        if (isButtonActive) {
            const timer = setTimeout(() => {
                setIsButtonActive(false);
            }, 2000); // 2 seconds

            return () => clearTimeout(timer);
        }
    }, [isButtonActive]);
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
            
            // bottom-right corner of document
            setClippyPosition({
            x: window.innerWidth - 80, // 100px from right edge
            y: documentHeight - 150 // 120px from bottom
            });
        };

        // initial position
        updateClippyPosition();

        // update on window resize and load
        window.addEventListener('resize', updateClippyPosition);
        window.addEventListener('load', updateClippyPosition);

        return () => {
            window.removeEventListener('resize', updateClippyPosition);
            window.removeEventListener('load', updateClippyPosition);
        };
    }, []);


    // mouse event handlers for React events (used in onMouseDown)
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

    // event listeners for native DOM events
    useEffect(() => {
        document.addEventListener('mousemove', handleNativeMouseMove);
        document.addEventListener('mouseup', handleNativeMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleNativeMouseMove);
            document.removeEventListener('mouseup', handleNativeMouseUp);
        };
    }, [isDragging, dragOffset]);

    // portfolio dropdown
    const handlePortfolioClick = (e: React.MouseEvent) => {
        // fixes window drag breaking, if you don't include this the blue-bar drag 
        e.stopPropagation();
        setIsPortfolioDropdownOpen(!isPortfolioDropdownOpen);
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (portfolioRef.current && !portfolioRef.current.contains(event.target as Node)) {
            setIsPortfolioDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // toggle visibility
    const toggleWindow = () => setIsVisible(!isVisible);

    // form with useful comments
    const [formData, setFormData] = useState({
    to: 'webcraftian.laboratory@gmail.com',
    from: '',
    subject: '',
    message: ''
    });

    // new state for loading indicator


    // handle input changes in the form fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // handle form submission - added emailjs code to actually send email
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsButtonActive(true); // Trigger the color change
        
        emailjs.send(
            'service_fiblai5',
            'template_bzci6ho',
            {
            to_email: 'webcraftian.laboratory@gmail.com',
            from_email: formData.from,
            subject: formData.subject,
            message: formData.message
            },
            'kM5UXATQMVrLI690I'
        )
        .then(() => alert("Email sent to webcraftian.laboratory@gmail.com!"))
        .catch((err) => console.error("Failed to send:", err)); // log the error
    };


    return (
        <>

            {/* cat icon */}
            <div className="desktop">
                {/* when you click the desktop icon, setShowModal is set to true */}
                <DesktopIcon
                    icon="/images/cat.png"
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
                            <span>I know what you did last summer</span>
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

            {/* clippy */}
            <div className="desktop">
                {/* when you click the desktop icon, setShowModal is set to true */}
                <DesktopIcon
                    icon="/images/mad_clippy.png"
                    label="click me"
                    x={clippyPosition.x}
                    y={clippyPosition.y}
                    onClick={() => setShowCatModal(true)}
                    className='clippy'
                />

                {showClippyModal && (
                    <div className="modal-overlay" onClick={() => setShowClippyModal(false)}>{/* when the user clicks again, setShowModal is set to false (modal isn't shown) */}
                    {/* if you click inside the modal, then setShowModal ISN'T set to false */}
                    {/* onClick takes the event, and returns 'don't propogate this event' function */}
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span>Hi, I'm ANGRY CLIPPY</span>
                                <button className='x-button' onClick={() => setShowClippyModal(false)}>✕</button>
                            </div>
                            {/* body of modal */}
                            <div className="modal-body">Are you kidding me??</div>
                            {/* CHALLENGE: add two buttons to this modal, 'yes', and 'I love them!', and return a message to the user based on their selection */}
                            <div className='cat-buttons'>
                                <button 
                                className='cat-button'
                                onClick={() => {
                                    setShowClippyModal(false);
                                    setShowYesModal(true);
                                }}
                                >
                                    Yes
                                </button>
                                <button 
                                    className='cat-button'
                                    onClick={() => {
                                        setShowClippyModal(false);
                                        setShowLoveModal(true);
                                    }}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>


            {/* actual window content */}
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
                            <img src="/images/connections.ico" className='icon' alt="icon"/>
                            <section className='blue-bar-text'>DevScape - Valentia Sedano</section>

                            <div className="button-container">
                                <button className='x-button' onClick={toggleWindow}>✕</button>
                            </div>
                        </section>


                        {/* navbar */}
                        <nav className='navbar'>
                            <ul>
                                <li className='button left-button'>
                                    <Link to="/">
                                        <img src="/images/Starfield.ico" className='home-icon' alt='home'/>
                                        <p>Home</p>
                                    </Link>
                                </li>
                                <li className='button'>
                                    <Link to="/about">
                                        <img src="/images/Starfield.ico" className='home-icon' alt='home'/>
                                        <p>About</p>
                                    </Link>
                                </li>
                                <li className={`button ${location.pathname === '/contact' ? 'active-contact' : ''}`}>
                                    <Link to="/contact">
                                        <img src={send} className='contact-icon' alt='contact'></img>
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
                                    <div className='url-text'>http://www.geocities.com/valentia_is_best_dev</div>
                                </div>
                                <button className='url-dropdown-button'>▼</button>
                            </div>
                            <div className = 'url-bar-small-2'>Links</div>
                        </div>
                    </div>

                    {/* window content */}
                    <div className='contact-content'>
                        <form onSubmit={handleSubmit} className="contact-form">
                            {/* first row - Recipient email (read-only) */}
                            <div className="form-row">
                                <label htmlFor="to" className='to-label'>T<span className='underline'>o.</span>..</label> 
                                <input
                                    type="email"
                                    id="to"
                                    name="to"
                                    value={formData.to}
                                    onChange={handleInputChange}
                                    readOnly
                                    className="form-input"
                                />
                            </div>
                            
                            {/* second row - sender email */}
                            <div className="form-row">
                                <label htmlFor="from" className='from-label'><span className='underline'>F</span>rom...</label>
                                <input
                                    type="email"
                                    id="from"
                                    name="from"
                                    value={formData.from}
                                    onChange={handleInputChange}
                                    required                   
                                    className="form-input"
                                    placeholder="your email"  
                                />
                            </div>
                            
                            {/* third row - email subject */}
                            <div className="form-row">
                                <label htmlFor="subject" className='subject-label'> S<span className='underline'>u</span>bject:</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                    placeholder="subject matter"
                                />
                            </div>
                            
                            {/* fourth row - message body */}
                            <div className="form-row">
                                <label htmlFor="message" className='message-label'>
                                    <span className='underline'>M</span>essage:</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    className="form-textarea"
                                    placeholder='"what a kewl portfolio, you&apos;re hired!"'
                                    style={{ height: `${calculateTextareaHeight()}px` }}
                                />
                            </div>
                            
                            {/* submit button row */}
                            <div className="form-button">
                                <button 
                                    type="submit"
                                    className={`send-button ${isButtonActive ? 'active' : ''}`}
                                >
                                    <img src={send} className="send-icon" alt="Send"/>
                                    Send
                                </button>
                            </div>
                        </form>

                        <div className="footer">
                            <div className='footer-section footer-large'></div>
                            <div className = 'footer-section footer-small'></div>
                            <div className = 'footer-section footer-small'></div>
                            <div className = 'footer-section footer-small'></div>
                            <div className='footer-section footer-medium'>
                                <img src={earth}
                                className='content-footer-icon'></img>
                                <p className='footer-section-text'>Internet</p>
                            </div>
                        </div>
                    {/* contact-content */}
                    </div>
                {/* window */}
                </div>
            )}

            {/* taskbar */}
            <Taskbar 
                isVisible={isVisible} 
                toggleWindow={toggleWindow}
                currentTime={currentTime}
            />
        </>
    );
}

export default Contact;