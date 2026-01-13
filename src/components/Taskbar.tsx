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
                <img src="/images/18.ico" className="start-icon" alt="start"/>
                <span className="start-text">Links</span>
            </button>

            {isStartMenuOpen && (
                <div ref={startMenuRef} className="start-menu">
                    <div className="start-menu-items">
                            {/* don't forget to add the https */}
                        <a href='http://www.linkedin.com/in/zvs' target='_blank' className="start-menu-item">
                            <span className='underline'>L</span>inkedIn
                        </a>
                        <a href='http://www.github.com/ZelmaSedano' target='_blank' className="start-menu-item">
                            <span className='underline'>G</span>itHub
                        </a>
                        <div className="start-menu-item"><span className='underline'>W</span>ebCraft Labs</div>
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