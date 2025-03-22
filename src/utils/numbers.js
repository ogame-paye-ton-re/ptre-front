export const shortenNumber = (num) => {
    const si = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "K" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "B" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];

    for (let i = si.length - 1; i >= 0; i--) {
        if (num >= si[i].value) {
            return (num / si[i].value).toFixed(1) + si[i].symbol;
        }
    }
    return num.toString();
};

export const formatWithThousandSeparator = (num) => {
    if (isNaN(num)) return num;

    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
