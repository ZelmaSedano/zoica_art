import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './App.css';

// hi justine, feel free to look at the comments in the modal section to learn more about how to render modals.  the component is in DesktopIcon.tsx :)

// component imports
import Taskbar from './components/Taskbar'
import './components/Taskbar.css'
import DesktopIcon from './components/DesktopIcon';
import './components/DesktopIcon.css'; // contains both icon + modal styles


function About() {
    // JUSTINE: useRef is used to access DOM nodes, this line initiates a useRef hook with the value of null
    const windowRef = useRef<HTMLDivElement | null>(null);
    const location = useLocation();

    // states
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


    // save the position of the window to session storage
    useEffect(() => {
        sessionStorage.setItem('windowPosition', JSON.stringify(position));
    }, [position]);

    useEffect(() => {
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

        document.addEventListener('mousemove', handleNativeMouseMove);
        document.addEventListener('mouseup', handleNativeMouseUp);
        
        return () => {
            document.removeEventListener('mousemove', handleNativeMouseMove);
            document.removeEventListener('mouseup', handleNativeMouseUp);
        };
    }, [isDragging, dragOffset]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer); // Cleanup
    }, []);
    
    // event handler functions
    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.blue-bar') && !(e.target as HTMLElement).closest('.x-button')) {
            const rect = windowRef.current?.getBoundingClientRect();
            if (!rect) return; // guard: abort if ref isn't set
            setIsDragging(true);
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    // toggle visibility
    const toggleWindow = () => setIsVisible(!isVisible);

    return (
        <>
            {/* cat icon */}
            <div className="desktop">
                {/* when you click the desktop icon, setShowModal is set to true */}
                <DesktopIcon
                    icon="/src/assets/cat.png"
                    label="meowdy"
                    x={50}
                    y={75}
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
                                <img src="/src/assets/evil_cat.gif" alt="evil_cat" />
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
                                <img src="/src/assets/evil_cat.gif" alt="evil_cat" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* scream icon */}
            <div className="desktop">
                <DesktopIcon
                    icon="/src/assets/scream.png"
                    label="RING RING"
                    x={50}
                    y={175}
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
                            <img src='/src/assets/wassup.gif' className='wassupp' alt='wassup_gif'></img>
                        </div>
                        </div>
                    </div>
                )}
            </div>

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
                            <img src="/src/assets/connections.ico" className='icon' alt="icon"/>
                            <section className='blue-bar-text'>DevScape - Valentia Sedano</section>

                            <div className="button-container">
                                <button className='x-button' onClick={toggleWindow}>✕</button>
                            </div>
                        </section>


                        {/* NAVBAR */}
                        <nav className='navbar'>
                            <ul>
                                {/* allows you to style the Home button when it's the router path */}
                                <li className={`button left-button ${location.pathname === '/' ? 'active-home' : ''}`}>
                                    <Link to="/">
                                        <img src="/src/assets/Starfield.ico" className='home-icon' alt='home'/>
                                        <p>Home</p>
                                    </Link>
                                </li>
                                <li className={`button ${location.pathname === '/about' ? 'active-about' : ''}`}>
                                    <Link to="/about">
                                        <img src="/src/assets/resume.png" className='resume-icon' alt='about'></img>
                                        <p>About</p>
                                    </Link>
                                </li>
                                <li className='button'>
                                    <Link to="/contact">
                                        <img src="/src/assets/send.png" className='contact-icon' alt='contact'></img>
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
                    <div className='content'>
                        <div className='homepage-banners'>
                            <p className='banner-1'>Welcome to my lil corner of the internet!</p>
                        </div>

                        <div className='bio-section'>
                            <img src="/src/assets/mee.jpg" className='bio-image' alt="bio"/>

                            <div className='sub-bio-section'>
                                <img src="/src/assets/computer_1.png" alt="evil_cat" />
                                <p className='sub-bio-text'>About Me:</p>
                                <p className='sub-bio-p'>
                                    Greetings! I am a passionate Software Engineer who dabbles in both backend Python/AI and frontend UX/UI solutions.
                                </p>
                                <p className='sub-bio-p-1'>
                                    Current obsession: <span>image classifiers</span>
                                </p>
                            </div>
                        </div>

                        {/* content footer */}
                        <div className="footer">
                            <div className='footer-section footer-large'></div>
                            <div className = 'footer-section footer-small'></div>
                            <div className = 'footer-section footer-small'></div>
                            <div className = 'footer-section footer-small'></div>
                            <div className='footer-section footer-medium'>
                                <img src="/src/assets/earth.ico" className='content-footer-icon' alt='content_footer'></img>
                                <p className='footer-section-text'>Internet</p>
                            </div>
                        </div>
                    </div>
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

export default About;