import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import '../App.css';

// component imports
import Taskbar from '../components/Taskbar'
import '../components/Taskbar.css'
import DesktopIcon from '../components/DesktopIcon';
import '../components/DesktopIcon.css';

const images = [
    {
        title:'Graybeard',
        id: 'commissions/Graybeard',
        url: 'http://www.etsy.com',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis massa ex, tristique sit amet ligula eu, semper consectetur erat.'
    },
    {
        title:'Kagnor',
        id: 'commissions/kagnor',
        url: 'http://www.etsy.com',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis massa ex, tristique sit amet ligula eu, semper consectetur erat.'
    },
    {
        title:'Mandrogora',
        id: 'commissions/mandrogora',
        url: 'http://www.etsy.com',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis massa ex, tristique sit amet ligula eu, semper consectetur erat.'
    },
    {
        title:'Mazzerisofar',
        id: 'commissions/mazzerisofar',
        url: 'http://www.etsy.com',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis massa ex, tristique sit amet ligula eu, semper consectetur erat.'
    },
    {
        title:'Olm2',
        id: 'commissions/Olmfinaltiny',
        url: 'http://www.etsy.com',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis massa ex, tristique sit amet ligula eu, semper consectetur erat.'
    },
    {
        title:'Patasola',
        id: 'commissions/patasola',
        url: 'http://www.etsy.com',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis massa ex, tristique sit amet ligula eu, semper consectetur erat.'
    },
    {
        title:'Porcelain',
        id: 'commissions/porcelain5',
        url: 'http://www.etsy.com',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis massa ex, tristique sit amet ligula eu, semper consectetur erat.'
    },
    {
        title:'Witch',
        id: 'commissions/witch',
        url: 'http://www.etsy.com',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis massa ex, tristique sit amet ligula eu, semper consectetur erat.'
    },
    {
        title:'Dragon',
        id: 'commissions/commexample',
        url: 'http://www.etsy.com',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis massa ex, tristique sit amet ligula eu, semper consectetur erat.'
    },
    {
        title:'Demon Lord',
        id: 'commissions/demonlord',
        url: 'http://www.etsy.com',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis massa ex, tristique sit amet ligula eu, semper consectetur erat.'
    },
    {
        title:'Olm1',
        id: 'commissions/olm done',
        url: 'http://www.etsy.com',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis massa ex, tristique sit amet ligula eu, semper consectetur erat.'
    },
];

function Commissions() {
    // position states
    // window position
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // modal positions: where they load - LOAD IN THE MIDDLE
    const [modalPosition, setModalPosition] = useState(() => ({
        x: Math.max(0, (window.innerWidth - 500) / 2),
        y: Math.max(0, (window.innerHeight - 400) / 2)
    }));

    const [screamModalPosition, setScreamModalPosition] = useState(() => ({
        x: Math.max(0, (window.innerWidth - 400) / 2),
        y: Math.max(0, (window.innerHeight - 300) / 2)
    }));

    const [contactModalPosition, setContactModalPosition] = useState(() => ({
        x: Math.max(0, (window.innerWidth - 500) / 2),
        y: Math.max(0, (window.innerHeight - 400) / 2)
    }));

    // STATES
    // mobile menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // mobile state
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // const [customScrollTop, setCustomScrollTop] = useState(0);
    // const [isDraggingScroll, setIsDraggingScroll] = useState(false);
    // const scrollContentRef = useRef<HTMLDivElement | null>(null);
    // const scrollTrackRef = useRef<HTMLDivElement | null>(null);
    // const scrollThumbRef = useRef<HTMLDivElement | null>(null);


    // icon states
    const [showScreamModal, setShowScreamModal] = useState(false);
    const [showPlayModal, setShowPlayModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    // dragging states
    const [isDraggingModal, setIsDraggingModal] = useState(false);
    const [modalDragOffset, setModalDragOffset] = useState({ x: 0, y: 0 });
    // taskbar clock
    const [currentTime, setCurrentTime] = useState(new Date());
    // window visibility
    const [isVisible, setIsVisible] = useState(true);
    // active button for CONTACT
    const [isButtonActive, setIsButtonActive] = useState(false);
    // scrolling image menu
    const [selectedImage, setSelectedImage] = useState(images[0]);

    // video player
    const [videoPlayer, setVideoPlayer] = useState({
        isPlaying: false,
        currentTime: 0,
        duration: 0,
    });

    // refs for dragging
    const windowRef = useRef<HTMLDivElement | null>(null);
    const mediaModalRef = useRef<HTMLDivElement | null>(null);
    const screamModalRef = useRef<HTMLDivElement | null>(null);
    const contactModalRef = useRef<HTMLDivElement | null>(null);
    
    const isDraggingRef = useRef(false);
    const dragOffsetRef = useRef({ x: 0, y: 0 });
    const windowSizeRef = useRef({ width: 0, height: 0 });
    const dragPositionRef = useRef(position);

    // scrolling image menu ref
    const scrollRef = useRef<HTMLDivElement | null>(null);


    // active button styling
    const location = useLocation();

    // initial window load - IN THE MIDDLE
    useEffect(() => {
        if (windowRef.current) {
            const rect = windowRef.current.getBoundingClientRect();
            // divide the actual width of the viewport
            setPosition({
                x: (window.innerWidth - rect.width) / 2,
                y: (window.innerHeight - rect.height) / 2
            });
        }
    }, []);
    // Clock ticker
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // recalculate modal positions when window resizes
    useEffect(() => {
        const handleResize = () => {
            // Mobile detection
            setIsMobile(window.innerWidth <= 768);

            // Only update if the modals are NOT currently being dragged
            if (!isDraggingModal) {
                setModalPosition({
                    x: Math.max(0, (window.innerWidth - 500) / 2),
                    y: Math.max(0, (window.innerHeight - 400) / 2)
                });
                setScreamModalPosition({
                    x: Math.max(0, (window.innerWidth - 400) / 2),
                    y: Math.max(0, (window.innerHeight - 300) / 2)
                });
                setContactModalPosition({
                    x: Math.max(0, (window.innerWidth - 500) / 2),
                    y: Math.max(0, (window.innerHeight - 400) / 2)
                });
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isDraggingModal]);
    // these dependencies run everytime a state is changed, so everytime isDraggingModal's value changes, this useEffect is ran

    // CONTACT
    useEffect(() => {
        if (isButtonActive) {
            const timer = setTimeout(() => {
                setIsButtonActive(false);
            }, 2000); // 2 seconds

            return () => clearTimeout(timer);
        }
    }, [isButtonActive]);
    const [formData, setFormData] = useState({
        to: 'zoicaart@gmail.com',
        from: '',
        subject: '',
        message: ''
    });
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
            to_email: 'zoicaart@gmail.com',
            from_email: formData.from,
            subject: formData.subject,
            message: formData.message
            },
            'kM5UXATQMVrLI690I'
        )
        .then(() => alert("Email sent to zoicaart@gmail.com!"))
        .catch((err) => console.error("Failed to send:", err)); // log the error
    };


    // HANDLER FUNCTIONS
    // content window
    const handleWindowMouseDown = (e: React.MouseEvent) => {
        if (
            (e.target as HTMLElement).closest('.blue-bar') && 
            !(e.target as HTMLElement).closest('.x-button')
        ) {
            const rect = windowRef.current?.getBoundingClientRect();
            if (!rect || !windowRef.current) return;

            windowSizeRef.current = {
                width: windowRef.current.offsetWidth,
                height: windowRef.current.offsetHeight
            };

            isDraggingRef.current = true;

            dragOffsetRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };

            // cursor
            windowRef.current.style.cursor = 'grabbing';
        }
    };
    // modal windows
    const handleModalMouseDown = (e: React.MouseEvent) => {
        // if clicking on either modal's header
        if ((e.target as HTMLElement).closest('.modal-header') && 
            !(e.target as HTMLElement).closest('.x-button')) {
            
            // choose which modal is being dragged
            const isMediaModal = mediaModalRef.current?.contains(e.target as Node);
            const isScreamModal = screamModalRef.current?.contains(e.target as Node);
            const isContactModal = contactModalRef.current?.contains(e.target as Node);
            
            if (isMediaModal && mediaModalRef.current) {
                const rect = mediaModalRef.current.getBoundingClientRect();
                setIsDraggingModal(true);
                setModalDragOffset({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            } else if (isScreamModal && screamModalRef.current) {
                const rect = screamModalRef.current.getBoundingClientRect();
                setIsDraggingModal(true);
                setModalDragOffset({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            } else if (isContactModal && contactModalRef.current) {
                const rect = contactModalRef.current.getBoundingClientRect();
                setIsDraggingModal(true);
                setModalDragOffset({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        }
    };

    // content window
    const handleWindowMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current || !windowRef.current) return;

        const newX = e.clientX - dragOffsetRef.current.x;
        const newY = e.clientY - dragOffsetRef.current.y;

        // use cached size (no per-frame reflow)
        const { width, height } = windowSizeRef.current;

        const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - width));
        const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - height));

        // direct DOM update (fast)
        windowRef.current.style.left = `${constrainedX}px`;
        windowRef.current.style.top = `${constrainedY}px`;

        // store final position for mouseup
        dragPositionRef.current = { x: constrainedX, y: constrainedY };
    };
    // modal windows
    const handleModalMouseMove = (e: MouseEvent) => {
        if (isDraggingModal) {
            // check which modal is currently being dragged
            if (mediaModalRef.current && document.activeElement !== screamModalRef.current && document.activeElement !== contactModalRef.current) {
                const newX = e.clientX - modalDragOffset.x;
                const newY = e.clientY - modalDragOffset.y;
                const { offsetWidth, offsetHeight } = mediaModalRef.current;
                
                setModalPosition({
                    x: Math.max(0, Math.min(newX, window.innerWidth - offsetWidth)),
                    y: Math.max(0, Math.min(newY, window.innerHeight - offsetHeight))
                });
            } else if (screamModalRef.current) {
                const newX = e.clientX - modalDragOffset.x;
                const newY = e.clientY - modalDragOffset.y;
                const { offsetWidth, offsetHeight } = screamModalRef.current;
                
                setScreamModalPosition({
                    x: Math.max(0, Math.min(newX, window.innerWidth - offsetWidth)),
                    y: Math.max(0, Math.min(newY, window.innerHeight - offsetHeight))
                });
            } else if (contactModalRef.current) {
                const newX = e.clientX - modalDragOffset.x;
                const newY = e.clientY - modalDragOffset.y;
                const { offsetWidth, offsetHeight } = contactModalRef.current;
                
                setContactModalPosition({
                    x: Math.max(0, Math.min(newX, window.innerWidth - offsetWidth)),
                    y: Math.max(0, Math.min(newY, window.innerHeight - offsetHeight))
                });
            }
        }
    };

    // content window
    const handleWindowMouseUp = () => {
        if (!isDraggingRef.current) return;
        
        isDraggingRef.current = false;
        
        // Restore cursor
        if (windowRef.current) {
            windowRef.current.style.cursor = 'default';
        }
        
        // Single state update when drag ends
        setPosition(dragPositionRef.current);
    };
    const handleModalMouseUp = () => setIsDraggingModal(false);

    // MEDIA PLAYER HANDLER FUNCS
    const handlePlayVideo = () => {
        const videoElement = document.getElementById('video-player') as HTMLVideoElement;
        if (videoElement) {
            if (videoPlayer.isPlaying) {
                videoElement.pause();
            } else {
                videoElement.play();
            }
            setVideoPlayer(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
        }
    };
    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const video = e.target as HTMLVideoElement;
        setVideoPlayer(prev => ({
            ...prev,
            currentTime: video.currentTime,
            duration: video.duration || 0
        }));
    };
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const videoElement = document.getElementById('video-player') as HTMLVideoElement;
        const seekTime = parseFloat(e.target.value);
        if (videoElement) {
            videoElement.currentTime = seekTime;
            setVideoPlayer(prev => ({ ...prev, currentTime: seekTime }));
        }
    };
    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // image menu scrolling handlers
    const scrollUp = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ top: -120, behavior: 'smooth' });
        }
    };
    const scrollLeft = () => {
        if(scrollRef.current) {
            scrollRef.current.scrollBy({ left: -120, behavior: 'smooth'});
        }
    }
    const scrollRight = () => {
        if(scrollRef.current) {
            scrollRef.current.scrollBy({ left: 120, behavior: 'smooth'})
        }
    }
    const scrollDown = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ top: 120, behavior: 'smooth' });
        }
    };



    // after drag
    useEffect(() => {
        if (windowRef.current && !isDraggingRef.current) {
            windowRef.current.style.left = `${position.x}px`;
            windowRef.current.style.top = `${position.y}px`;
        }
    }, [position]);


    // this needs to be after handler funcs
    // adds event listeners to DOM
    useEffect(() => {
        document.addEventListener('mousemove', handleWindowMouseMove);
        document.addEventListener('mouseup', handleWindowMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleWindowMouseMove);
            document.removeEventListener('mouseup', handleWindowMouseUp);
        };
    }, []);
    useEffect(() => {
        document.addEventListener('mousemove', handleModalMouseMove);
        document.addEventListener('mouseup', handleModalMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleModalMouseMove);
            document.removeEventListener('mouseup', handleModalMouseUp);
        };
    }, [isDraggingModal, modalDragOffset]);

    // recalculate modal positions when window resizes
    useEffect(() => {
        const handleResize = () => {
            // Only update if the modals are NOT currently being dragged
            if (!isDraggingModal) {
                setModalPosition({
                    x: Math.max(0, (window.innerWidth - 500) / 2),
                    y: Math.max(0, (window.innerHeight - 400) / 2)
                });
                setScreamModalPosition({
                    x: Math.max(0, (window.innerWidth - 400) / 2),
                    y: Math.max(0, (window.innerHeight - 300) / 2)
                });
                setContactModalPosition({
                    x: Math.max(0, (window.innerWidth - 500) / 2),
                    y: Math.max(0, (window.innerHeight - 400) / 2)
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isDraggingModal]);

    // menu loads 150px down so user sees next image
    useEffect(() => {
        // small delay to ensure images are rendered
        const timer = setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = 150;
            }
        }, 50);
        
        return () => clearTimeout(timer);
    }, []);


    // hide/show content window
    const toggleWindow = () => setIsVisible(!isVisible);

    return (
        <>
            {/* scream icon */}
            <div className="desktop">
                <DesktopIcon
                    icon="/images/fishicon.png"
                    label="click me"
                    x={isMobile ? 30: 50}
                    y={isMobile ? 20: 35}
                    onClick={() => setShowScreamModal(true)}
                />

                {showScreamModal && (
                    <div className="modal-overlay" onClick={() => setShowScreamModal(false)}>
                        <div 
                            className="modal" 
                            ref={screamModalRef}
                            style={{
                                position: 'fixed',
                                left: `${screamModalPosition.x}px`,
                                top: `${screamModalPosition.y}px`,
                                cursor: isDraggingModal ? 'grabbing' : 'default',
                                margin: 0,
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={handleModalMouseDown}
                        >
                            <div className="modal-header">
                                <span className='scream-modal'>Simple and clean is the way you're making me feel tonight</span>
                                <button className='x-button' onClick={() => setShowScreamModal(false)}>✕</button>
                            </div>
                            <div className="modal-body">
                                <img src="/images/idk.gif" className='gif' alt="Kingdom Hearts" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* media player */}
            <div className="desktop">
                <DesktopIcon
                    icon="/images/player.png"
                    label="play"
                    x={isMobile ? 30: 50}
                    y={isMobile ? 125: 145}
                    onClick={() => setShowPlayModal(true)}
                />

                {showPlayModal && (
                    <div className="modal-overlay" onClick={() => setShowPlayModal(false)}>
                        <div 
                            className="modal media-modal" 
                            ref={mediaModalRef}
                            style={{
                                position: 'fixed',
                                left: `${modalPosition.x}px`,
                                top: `${modalPosition.y}px`,
                                cursor: isDraggingModal ? 'grabbing' : 'default',
                                margin: 0, // Override any default margin
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={handleModalMouseDown}
                        >
                            <div className="modal-header">
                                <div className='modal-left'>
                                    <img className='tiny-media-player' src='/images/player.png' alt="player" />
                                    <span className='media-header-title'>Zoica Player</span>
                                </div>
                                <button className='x-button' onClick={() => {
                                    setShowPlayModal(false);
                                    const videoElement = document.getElementById('video-player') as HTMLVideoElement;
                                    if (videoElement) {
                                        videoElement.pause();
                                        setVideoPlayer({ isPlaying: false, currentTime: 0, duration: 0 });
                                    }
                                }}>✕</button>
                            </div>

                            <div className="modal-body">
                                <div className="media-player-container">
                                    <video 
                                        id='video-player'
                                        src='/perfect.mp4'
                                        className='lane'
                                        onClick={handlePlayVideo}
                                        onTimeUpdate={handleTimeUpdate}
                                        onLoadedMetadata={(e) => {
                                            const videoElement = e.currentTarget as HTMLVideoElement;
                                            setVideoPlayer(prev => ({ ...prev, duration: videoElement.duration }));
                                        }}
                                        onEnded={() => {
                                            setVideoPlayer(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
                                        }}
                                    />

                                    <div className="track-info">
                                        <div className="track-title">Now Playing: "Your Video Title"</div>
                                    </div>

                                    <div className="media-controls">
                                        <div className="progress-container">
                                            <button
                                                className="play-button"
                                                onClick={handlePlayVideo}
                                            >
                                                {videoPlayer.isPlaying ? 
                                                    <img src='/images/pause_1.png' className='media-player-pause' alt="pause" /> : 
                                                    <img src='/images/play_1.png' className='media-player-play' alt="play" />
                                                }
                                            </button>

                                            <span className="time-display current-time">
                                                {formatTime(videoPlayer.currentTime)}
                                            </span>
                                            
                                            <input
                                                type="range"
                                                className="progress-bar"
                                                min="0"
                                                max={videoPlayer.duration || 100}
                                                value={videoPlayer.currentTime}
                                                onChange={handleSeek}
                                                step="0.1"
                                            />
                                            
                                            <span className="time-display total-time">
                                                {formatTime(videoPlayer.duration)}
                                            </span>
                                        </div>
                                        
                                        <div className="volume-controls">
                                            <span>
                                                <img className='backwards' src='/images/backwards.png'></img>
                                            </span>
                                            <span>
                                                <img className='forward' src='/images/forward.png'></img>
                                            </span>

                                            <span>
                                                <img src='/images/volume.png' className="volume-icon" alt="volume" />
                                            </span>
                                            <input
                                                type="range"
                                                className="volume-bar"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                defaultValue="1"
                                                onChange={(e) => {
                                                    const videoElement = document.getElementById('video-player') as HTMLVideoElement;
                                                    if (videoElement) {
                                                        videoElement.volume = parseFloat(e.target.value);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* contact icon */}
            <div className="desktop">
                <DesktopIcon
                    icon="/images/contact.png"
                    label="contact"
                    x={isMobile ? 30: 50}
                    y={isMobile ? 230: 255}
                    onClick={() => setShowContactModal(true)}
                />

                {showContactModal && (
                    <div className="modal-overlay" onClick={() => setShowContactModal(false)}>

                        <div 
                            className="modal contact" 
                            ref={contactModalRef}
                            style={{
                                position: 'fixed',
                                left: `${contactModalPosition.x}px`,
                                top: `${contactModalPosition.y}px`,
                                cursor: isDraggingModal ? 'grabbing' : 'default',
                                margin: 0,
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={handleModalMouseDown}
                        >

                            <div className="modal-header">
                                <div className='modal-header-group'>
                                    <img className='contact-modal-img' src="/images/265.ico" alt="" />
                                    <section className='blue-bar-text'>Contact Zoica Art</section>
                                </div>
                                <button className='x-button' 
                                    onClick={(e) => {setShowContactModal(false);}}>✕</button>
                            </div>

                            <div className="modal-body">
                                
                                <div className='contact-content'>

                                    <div className='contact-header'>
                                        <div className='contact-header-items'>
                                            <div className='contact-header-text'><span>F</span>ile</div>
                                        </div>
                                        <div className='contact-header-items'>
                                            <div className='contact-header-text'><span>E</span>dit</div>
                                        </div>
                                        <div className='contact-header-items'>
                                            <div className='contact-header-text'><span>V</span>iew</div>
                                        </div>
                                        <div className='contact-header-items'>
                                            <div className='contact-header-text'><span>In</span>sert</div>
                                        </div>
                                        <div className='contact-header-items'>
                                            <div className='contact-header-text'><span>F</span>ormat</div>
                                        </div>
                                        <div className='contact-header-items'>
                                            <div className='contact-header-text'><span>T</span>ools</div>
                                        </div>
                                        <div className='contact-header-items'>
                                            <div className='contact-header-text'><span>T</span>able</div>
                                        </div>
                                    </div>

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
                                                placeholder="Commission"
                                            />
                                        </div>
                                        
                                        {/* fourth row - message body */}
                                        <div className="form-row">
                                            <label htmlFor="message" className='message-label'>
                                                <span className='underline'>M</span>essage:
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                required
                                                className="form-textarea"
                                                placeholder='Can you make a portrait of my amazing cat?'
                                            />
                                        </div>

                                        {/* submit button row */}
                                        <div className="form-button">
                                            <button 
                                                type="submit"
                                                className={`send-button ${isButtonActive ? 'active' : ''}`}
                                            >
                                                <img src='/images/265.ico' className="send-icon" alt="Send"/>
                                                Send
                                            </button>
                                        </div>
                                    </form>
                                {/* contact-content */}
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div>


            {/* content window - draggable */}
            {isVisible && (
                <div 
                    className={`window ${isVisible ? 'visible' : ''}`}
                    ref={windowRef}
                    style={{
                        position: 'absolute',
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                    }}
                    onMouseDown={handleWindowMouseDown}
                >
                    {/* BLUE BAR */}
                    <header>
                        <section className='blue-bar'>
                            <img src="/images/18.ico" className='icon' alt="icon"/>
                            <section className='blue-bar-text'>Zoica Browser</section>
                            <div className="button-container">
                                <button className='x-button' onClick={toggleWindow}>✕</button>
                            </div>
                        </section>
                    </header>

                    {/* URL BAR */}
                    <div className='url-container'>
                        <div className='url-bar'>
                            <div className='url-bar-small-1'>
                                <div className='url-bar-small-1-text'>Address</div>
                            </div>
                            <div className='url-bar-large'>
                                <div className='dropdown-container'>
                                    <div className='url-text'>http://www.geocities.com/zoica_art</div>
                                </div>
                                <img src='/images/blue-arrow.png' className='url-dropdown-button'/>
                            </div>
                            <div className='url-bar-small-2'>
                                <img src='/images/290.ico' className='url-bar-go'></img>
                                <span className='url-go-text'>Go</span>
                            </div>
                        </div>
                    </div>
                    

                    <div className='content'>

                        {isMobile ? (
                            // MOBILE VERSION
                            <>
                                <div className='homepage-banners'>
                                    <div className='inner-banner-text'>
                                        <p className='banner'>Zoica Art</p>
                                    </div>
                                </div>

                                <div className='content-container'>
                                    <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                        ☰
                                    </div>

                                    <nav className={`navbar ${isMenuOpen ? 'mobile-open' : ''}`}>
                                        <ul>
                                            <li className={`button-1 left-button ${location.pathname === '/' ? 'active-home' : ''}`}>
                                                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                                                    <p className='nav-p'>Home</p>
                                                </Link>
                                            </li>
                                            <li className='button-1'>
                                                <Link to="/tarot" onClick={() => setIsMenuOpen(false)}>
                                                    <p className='nav-p'>Tarot</p>
                                                </Link>
                                            </li>
                                            <li className='button-1'>
                                                <Link to="/norse" onClick={() => setIsMenuOpen(false)}>
                                                    <p className='nav-p'>Mythology</p>
                                                </Link>
                                            </li>
                                            <li className='button-1'>
                                                <Link to="/game" onClick={() => setIsMenuOpen(false)}>
                                                    <p className='nav-p'>Game Art</p>
                                                </Link>
                                            </li>
                                            <li className='button-1'>
                                                <Link to="/commissions" onClick={() => setIsMenuOpen(false)}>
                                                    <p className='nav-p'>Commissions</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </nav>

                                    <section className='image-layout'>
                                        <div className="preview-pane">
                                            <img
                                                src={`/images/${selectedImage.id}.jpg`}
                                                alt={selectedImage.title}
                                            />
                                            <div className="preview-title">{selectedImage.title}</div>
                                        </div>

                                        <div className="scroll-menu">
                                            <div className="custom-scroll-container">
                                                <div className="scroll-list" ref={scrollRef}>
                                                    {images.map((img) => (
                                                        <div
                                                            key={img.id}
                                                            className={`scroll-item ${selectedImage.id === img.id ? 'active' : ''}`}
                                                            onClick={() => setSelectedImage(img)}
                                                        >
                                                            <img src={`/images/${img.id}.jpg`} alt={img.title} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className='right-left-arrows'>
                                                <button className="arrow-1 left" onClick={scrollLeft}>
                                                    <img src='/images/left_arrow.png' />
                                                </button>
                                                <button className="arrow-1 right" onClick={scrollRight}>
                                                    <img src='/images/right_arrow.png' />
                                                </button>
                                            </div>
                                        </div>
                                    </section>

                                    <section className='info-box'>
                                        <div className='inner-info-box'>
                                            <div className='info-box-text'>
                                                <p>{selectedImage.description}</p>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </>
                        ) : (

                            // DESKTOP VERSION
                            <>
                                <div className='homepage-banners'>
                                    <div className='inner-banner-text'>
                                        <p className='banner'>Zoica Art</p>
                                    </div>
                                </div>

                                <div className='content-container'>

                                <div className='navbar-info-container'>
                                    <nav className={`navbar ${isMenuOpen ? 'mobile-open' : ''}`}>
                                        <ul>
                                            <li className={`button-1 left-button ${location.pathname === '/' ? 'active-home' : ''}`}>
                                                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                                                    <p className='nav-p'>Home</p>
                                                </Link>
                                            </li>
                                            <li className='button-1'>
                                                <Link to="/tarot" onClick={() => setIsMenuOpen(false)}>
                                                    <p className='nav-p'>Tarot</p>
                                                </Link>
                                            </li>
                                            <li className='button-1'>
                                                <Link to="/norse" onClick={() => setIsMenuOpen(false)}>
                                                    <p className='nav-p'>Mythology</p>
                                                </Link>
                                            </li>
                                            <li className='button-1'>
                                                <Link to="/game" onClick={() => setIsMenuOpen(false)}>
                                                    <p className='nav-p'>Game Art</p>
                                                </Link>
                                            </li>
                                            <li className='button-1'>
                                                <Link to="/commissions" onClick={() => setIsMenuOpen(false)}>
                                                    <p className='nav-p'>Commissions</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </nav>

                                    <section className='info-box'>
                                        <div className='inner-info-box'>
                                            <p className='info-box-text'>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis massa ex, tristique sit amet ligula eu, semper consectetur erat.
                                            </p>
                                        </div>
                                    </section>
                                </div>

                                    <section className='image-layout'>
                                        {/* LEFT: selected image preview */}
                                        <div className="preview-pane">
                                            <img
                                                src={`/images/${selectedImage.id}.jpg`}
                                                alt={selectedImage.title}
                                            />
                                            <div className="preview-title">{selectedImage.title}</div>
                                        </div>

                                        {/* RIGHT: scroll selector */}
                                        <div className="scroll-menu">
                                            <button className="arrow-1 up" onClick={scrollUp}>
                                                <img src='/images/up_arrow.png' />
                                            </button>

                                            <div className="custom-scroll-container">
                                                <div className="scroll-list" ref={scrollRef}>
                                                    {images.map((img) => (
                                                        <div
                                                            key={img.id}
                                                            className={`scroll-item ${selectedImage.id === img.id ? 'active' : ''}`}
                                                            onClick={() => setSelectedImage(img)}
                                                        >
                                                            <img src={`/images/${img.id}.jpg`} alt={img.title} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className='right-left-arrows'>
                                                <button className="arrow-1 left" onClick={scrollLeft}>
                                                    <img src='/images/left_arrow.png' />
                                                </button>
                                                <button className="arrow-1 right" onClick={scrollRight}>
                                                    <img src='/images/right_arrow.png' />
                                                </button>
                                            </div>

                                            <button className="arrow-1 down" onClick={scrollDown}>
                                                <img src='/images/downward_arrow.png'/>
                                            </button>
                                        </div>
                                    </section>
                                </div>
                            </>
                        )}

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

export default Commissions;
