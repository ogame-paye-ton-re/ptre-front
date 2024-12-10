export const formatDate = (timestamp, format = 'short') => {
    const date = new Date(timestamp * 1000);

    const shortFormatOptions = { 
        day: '2-digit', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
    };

    const longFormatOptions = { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    };

    const options = format === 'long' ? longFormatOptions : shortFormatOptions;

    const formattedDate = date.toLocaleString('en-GB', options);

    if (format === 'short') {
        return formattedDate.replace(',', '').replace(' ', ' - ');
    }

    return formattedDate;
};
