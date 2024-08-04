module.exports = (length, validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890") => {
    if (isNaN(length)) {
        throw new Error("Length must be defined and a valid number");
    }
    let result = '';
    const charactersLength = validChars.length;
    for (let i = 0; i < length; i++) {
        result += validChars.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
