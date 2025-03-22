import React, { useState, useRef, useEffect } from "react";
import "./Tooltip.css";

const Tooltip = ({ children, content, position = "top" }) => {
    const [visible, setVisible] = useState(false);
    const [tooltipStyle, setTooltipStyle] = useState({});
    const wrapperRef = useRef(null);
    const tooltipRef = useRef(null);

    useEffect(() => {
        const updateTooltipPosition = () => {
            if (visible && wrapperRef.current && tooltipRef.current) {
                const rect = wrapperRef.current.getBoundingClientRect();
                
                const tooltipWidth = tooltipRef.current.offsetWidth;
                
                let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
                
                left = Math.max(20, Math.min(left, window.innerWidth - tooltipWidth - 20));
                
                const top = rect.bottom + 10;

                setTooltipStyle({
                    position: 'fixed',
                    left: `${left}px`,
                    top: `${top}px`,
                });
            }
        };

        if (visible) {
            updateTooltipPosition();
            window.addEventListener('resize', updateTooltipPosition);
            return () => window.removeEventListener('resize', updateTooltipPosition);
        }
    }, [visible]);

    return (
        <div
            ref={wrapperRef}
            className="tooltip-wrapper"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div 
                    ref={tooltipRef}
                    className={`tooltip-box tooltip-${position}`}
                    style={tooltipStyle}
                >
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;