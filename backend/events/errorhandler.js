module.exports = {
    name:'error',
    once: true,
    execute(error){
        if (error.code === 10062) {
            console.warn('Unknown interaction: The interaction has expired or is invalid.');
        } else {
            console.error('An error occurred:', error);
        }
    }}