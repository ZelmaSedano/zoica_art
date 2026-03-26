import {useState, useEffect} from 'react';
import './DesktopIcon.css';

interface DesktopIconProps {
    icon: string;
    label: string;
    x: number;
    y: number;
    onClick: () => void;
    className?: string;
    imgClassName?: string;
}

// try and make this the standard, too many varying react function declarations imho 
const DesktopIcon: React.FC<DesktopIconProps> = ({icon, label, x, y, onClick, className='', imgClassName = '',}) => {
    // state
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const handleDocumentClick = (e: MouseEvent) => {
            if (!(e.target as Element).closest('.desktop-icon')) {
                setIsActive(false);
            }
        };

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, []);

    // pass in onClick() so the parent component b/c the onClick inside the DesktopIcon now isn't just onClick, but handleClick
    const handleClick = (e: React.MouseEvent) => {
        // keeps from de-selecting
        e.stopPropagation();
        setIsActive(true);
        onClick();
    };

    return (
        <div
            className={`desktop-icon ${isActive ? 'active' : ''} ${className}`}
            style={{ position: 'absolute', left: x, top: y }}
            onClick={handleClick}
        >
        <img src={icon} alt={label} className={imgClassName}/>
        <span className='desktop-icon-label'>{label}</span>
        </div>
    );
}

export default DesktopIcon;