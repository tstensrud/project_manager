import React, { useEffect, useState } from 'react';
import MoonIcon from '../assets/svg/moonIcon.jsx';

function ToggleMode() {
    
    const [theme, setTheme] = useState('dark');
    
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            applyTheme(savedTheme);
        } else {
            applyTheme('dark');
        }
    }, []);

    const applyTheme = (theme) => {
        if (theme === 'light') {
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }
    };

    const toggleMode = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <div className="switch-mode-container no-print">
            <button className="mode-switch" title="Endre tema" onClick={toggleMode}>
                Endre mørk/lyst &nbsp;&nbsp;&nbsp;
                {MoonIcon && <MoonIcon />}
            </button>
        </div>
    );
}
export default ToggleMode;