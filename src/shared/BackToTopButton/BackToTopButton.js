import React, { useState, useEffect } from 'react';

const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
        console.log("scrollToTop triggered");
        if (window.scrollTo) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        } else {
            window.scroll(0, 0);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 250) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        handleScroll()

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        isVisible && (
            <button
                onClick={scrollToTop}
                style={styles.button}
                aria-label="Back to top"
            >
                ↑
            </button>
        )
    );
};

const styles = {
    button: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px',
        fontSize: '18px',
        backgroundColor: 'rgb(188, 105, 21)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        transition: 'opacity 0.3s ease',
    },
};

export default BackToTopButton;
