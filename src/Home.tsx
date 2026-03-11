import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './App.css';

// component imports
import Taskbar from './components/Taskbar'
import './components/Taskbar.css'
import DesktopIcon from './components/DesktopIcon';
import './components/DesktopIcon.css';

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

function Home() {
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

    // Add this to your existing states
    const [showPlayModal, setShowPlayModal] = useState(false);

    // Add this audio state
    const [audioPlayer, setAudioPlayer] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    });

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

    // media player
    const handlePlayAudio = () => {
        const audioElement = document.getElementById('audio-player')  as HTMLAudioElement;
        if (audioElement) {
            if (audioPlayer.isPlaying) {
            audioElement.pause();
            } else {
            audioElement.play();
            }
            setAudioPlayer(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
        }
    };

    // Add this function to handle time updates
    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
        const audio = e.target as HTMLAudioElement;
        setAudioPlayer(prev => ({
            ...prev,
            currentTime: audio.currentTime,
            duration: audio.duration || 0
        }));
    };

    // Function to handle seeking
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audioElement = document.getElementById('audio-player') as HTMLAudioElement;
        const seekTime = parseFloat(e.target.value);
        if (audioElement) {
            audioElement.currentTime = seekTime;
            setAudioPlayer(prev => ({ ...prev, currentTime: seekTime }));
        }
    };

    // Function to format time (seconds to MM:SS)
    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };


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

            {/* media player */}
            <div className="desktop">
                <DesktopIcon
                    icon="/public/images/player.png"
                    label="play"
                    x={50}
                    y={255}
                    onClick={() => setShowPlayModal(true)}
                />

                {showPlayModal && (
                    <div className="modal-overlay" onClick={() => setShowPlayModal(false)}>
                        <div className="modal media-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <span>Media Player</span>
                                <button className='x-button' onClick={() => {
                                    setShowPlayModal(false);

                                    const audioElement = document.getElementById('audio-player') as HTMLAudioElement;

                                    if (audioElement) {
                                        audioElement.pause();
                                        setAudioPlayer({ isPlaying: false, currentTime: 0, duration: 0 });
                                    }
                                }}>✕</button>
                            </div>

                            <div className="modal-body">
                                <div className="media-player-container">
                                    {/* Audio element - hidden but controls playback */}
                                    <audio
                                        id="audio-player"
                                        src="/public/Miki_Matsubara_-_Stay_With_Me_(mp3.pm).mp3"
                                        onTimeUpdate={handleTimeUpdate}
                                        onLoadedMetadata={(e) => {
                                            const audioElement = e.currentTarget as HTMLAudioElement;
                                            setAudioPlayer(prev => ({ ...prev, duration: audioElement.duration }));
                                        }}
                                        onEnded={() => {
                                            setAudioPlayer(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
                                        }}
                                    />
                                    
                                    {/* player controls */}
                                    <div className="media-controls">
                                        <div className='media-player-image'>
                                            <img src='/images/miki.jpg' className='miki'></img>
                                        </div>
                                        
                                        {/* song progress */}
                                        <div className="progress-container">
                                            {/* play/pause button */}
                                            <button 
                                                className="play-button"
                                                onClick={handlePlayAudio}
                                            >
                                                {audioPlayer.isPlaying ? <img src='/images/pause.png' className='media-player-pause'></img> : <img src='/images/play.png' className='media-player-play'></img>}
                                            </button>
                                            <span className="time-display current-time">
                                                {formatTime(audioPlayer.currentTime)}
                                            </span>
                                            
                                            <input
                                                type="range"
                                                className="progress-bar"
                                                min="0"
                                                max={audioPlayer.duration || 100}
                                                value={audioPlayer.currentTime}
                                                onChange={handleSeek}
                                                step="0.1"
                                            />
                                            
                                            <span className="time-display total-time">
                                                {formatTime(audioPlayer.duration)}
                                            </span>
                                        </div>
                                        
                                        <div className="volume-controls">
                                            <span>
                                                <img src='/images/Volume.ico' className="volume-icon"></img>
                                            </span>
                                            <input
                                                type="range"
                                                className="volume-bar"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                defaultValue="1"
                                                onChange={(e) => {
                                                    const audioElement = document.getElementById('audio-player') as HTMLAudioElement;
                                                    if (audioElement) {
                                                    audioElement.volume = parseFloat(e.target.value);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                
                                {/* Track info */}
                                <div className="track-info">
                                    <div className="track-title">Now Playing: "Stay with Me"</div>
                                    <div className="track-artist">Artist: Miki Matsubara</div>
                                </div>
                            </div>
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
                            <img src="/images/18.ico" className='icon' alt="icon"/>
                            <section className='blue-bar-text'>Zoica Browser</section>

                            <div className="button-container">
                                <button className='x-button' onClick={toggleWindow}>✕</button>
                            </div>
                        </section>
                    </header>

                    {/* URL bar */}
                    <div className='url-container'>
                        <div className = 'url-bar'>
                            <div className = 'url-bar-small-1'>
                                <div className='url-bar-small-1-text'>Address</div>
                            </div>
                            <div className = 'url-bar-large'>
                                <div className='dropdown-container'>
                                    <div className='url-text'>http://www.geocities.com/zoica_art</div>
                                </div>
                                    <img src='/images/blue-arrow.png' className='url-dropdown-button'/>
                            </div>
                            <div className = 'url-bar-small-2'>
                                <img src='/images/290.ico' className='url-bar-go'></img>
                                <span className='url-go-text'>Go</span>
                            </div>
                        </div>
                    </div>
                        
                    {/* *************************** NAVBAR ************************/}
                    <nav className='navbar'>
                        <ul>
                            <li className={`button-1 left-button ${location.pathname === '/' ? 'active-home' : ''}`}>
                                <Link to="/">
                                    <img src="/images/home.png" className='home-icon' alt='home'/>
                                    <p>Home</p>
                                </Link>
                            </li>
                            <li className='button-1'>
                                <Link to="/tarot">
                                    <img src="/images/tarot.png" className='home-icon' alt='home'/>
                                    <p>Tarot</p>
                                </Link>
                            </li>
                            <li className='button-1'>
                                <Link to="/norse">
                                    <img src="/public/images/Mythology.png" className='home-icon' alt='home'/>
                                    <p>Mythology</p>
                                </Link>
                            </li>
                            <li className='button-1'>
                                <Link to="/game">
                                    <img src="/images/game_art.png" className='home-icon' alt='home'/>
                                    <p>Game Art</p>
                                </Link>
                            </li>
                            <li className='button-1'>
                                <Link to="/commissions">
                                    <img src="/images/commissions.png" className='home-icon' alt='home'/>
                                    <p>Commissions</p>
                                </Link>
                            </li>
                            <li className='button-1'>
                                <Link to="/contact">
                                    <img src='/images/contact.png' className='contact-icon' alt='contact'></img>
                                    <p>Contact</p>
                                </Link>
                            </li>
                        </ul>
                        
                    </nav>





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

export default Home;