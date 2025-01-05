
module.exports = function killStream(currentStreamProcess){
    if (currentStreamProcess) {
        currentStreamProcess.kill('SIGTERM'); // Graceful termination
        currentStreamProcess.removeAllListeners();
        console.log(currentStreamProcess)
        console.log('Stream terminated.');
    } else {
        console.log('No active stream to terminate.');
    }
}