import React, { useState, useRef, useEffect } from 'react';

interface TaskbarProps {
    isVisible: boolean;
    toggleWindow: () => void;
    currentTime: Date;
}

const Taskbar: React.FC<TaskbarProps> = ({isVisible, toggleWindow, currentTime}) => {
    // states 
    // is menu open?
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
    // useRefs can access DOM nodes directly
    const startMenuRef = useRef<HTMLDivElement>(null);
    const startButtonRef = useRef<HTMLButtonElement>(null);

    // close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                startMenuRef.current && 
                !startMenuRef.current.contains(event.target as Node) &&
                startButtonRef.current &&
                !startButtonRef.current.contains(event.target as Node)
            ) {
                setIsStartMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // event handlers
    const toggleStartMenu = () => {
        setIsStartMenuOpen(!isStartMenuOpen);
    };

    return (
        <div className="taskbar">
            <button
                ref={startButtonRef}
                className={`start-button ${isStartMenuOpen ? 'active' : ''}`}
                onClick={toggleStartMenu}
            >
                <img src="/images/windows_purple.png" className="start-icon" alt="start"/>
                <span className="start-text">links</span>
            </button>

            {isStartMenuOpen && (
                <div ref={startMenuRef} className="start-menu">
                    <section className='blue-bar-1'>
                            <img src="/images/16.ico" className='start-menu-icon' alt="icon"/>
                            <section className='blue-bar-text-1'>Administrator</section>
                    </section>

                    <div className="start-menu-items">
                        <a href='https://www.etsy.com/uk/shop/ZoicaArt' target='_blank' className="start-menu-item">
                            <img src="/images/etsy.png" className='start-icon-1' alt="icon"/>
                            Shop
                        </a>
                        <a href='https://www.twitch.tv/zoicaart' target='_blank' className="start-menu-item">
                            <img src="/images/twitch.png" className='start-icon-1' alt="icon"/>
                            Twitch
                        </a>
                        <a href='https://www.instagram.com/zoica' target='_blank' className="start-menu-item">
                            <img src="/images/insta.png" className='start-icon-1' alt="icon"/>
                            Instagram
                        </a>

                    </div>
                </div>
            )}

            <div className='devscape-section'>
                <button 
                className={`devscape-button ${isVisible ? 'window-visible' : ''}`}
                onClick={toggleWindow}
                >
                    <img src="/images/home.png" className='connections-icon' alt="icon"/>
                    <span className="devscape-text">Zoica Browser</span>
                </button>
            </div>

            <div className="taskbar-items">
                <div className="clock">
                {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
            </div>
        </div>
    )
}

export default Taskbar;