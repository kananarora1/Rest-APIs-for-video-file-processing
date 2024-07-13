const { exec } = require('child_process');
const videoModel = require('../Models/video');

module.exports = function uploadVideo(filePath, callback) {
    exec(`ffprobe -i ${filePath} -show_entries format=duration -v quiet -of csv="p=0"`, (error, stdout) => {
        if (error) return callback(error);
        const duration = parseFloat(stdout.trim());
        if (duration < 5 || duration > 300) { // Duration in seconds
            return callback(new Error('Video duration must be between 5 and 300 seconds'));
        }
        videoModel.saveVideo(filePath, duration, callback);
    });
}

module.exports = function trimVideo(start, end, videoPath, callback) {
    const outputPath = 'path/to/trimmed/video.mp4';
    exec(`ffmpeg -i ${videoPath} -ss ${start} -to ${end} -c copy ${outputPath}`, (error) => {
        callback(error, outputPath);
    });
}

module.exports = function mergeVideos(videoPaths, callback) {
    const inputFile = 'input.txt'; // File listing video paths
    const fs = require('fs');
    fs.writeFileSync(inputFile, videoPaths.map(path => `file '${path}'`).join('\n'));
    exec(`ffmpeg -f concat -safe 0 -i ${inputFile} -c copy merged_video.mp4`, (error) => {
        callback(error, 'merged_video.mp4');
    });
}
