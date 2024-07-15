const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const Video = require('../models/video');
const ffmpeg = require('fluent-ffmpeg');
const { generateShareableLink } = require('./linkService');

ffmpeg.setFfmpegPath('C:\\ffmpeg\\bin\\ffmpeg.exe');
ffmpeg.setFfprobePath('C:\\ffmpeg\\bin\\ffprobe.exe');

const uploadVideo = async (file, title) => {
  try {
    const filePath = file.path;
    const fileSize = fs.statSync(filePath).size;

    const metadata = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          resolve(metadata);
        }
      });
    });

    const duration = Math.floor(metadata.format.duration);

    const video = await Video.create({
      title,
      filePath,
      duration,
      size: fileSize
    });

    const shareableLink = await generateShareableLink(filePath);

    return {video, shareableLink};

  } catch (error) {
    throw new Error(`Failed to upload video: ${error.message}`);
  }
};

const trimVideo = async (videoId, trimParams) => {
  const { start, end } = trimParams;
  const video = await Video.findByPk(videoId);
  if (!video) {
    throw new Error('Video not found');
  }

  const inputFilePath = video.filePath;
  const outputFilePath = path.join('C:', 'uploads', `trimmed_${videoId}.mp4`);

  await new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .setStartTime(start)
      .setDuration(end - start)
      .output(outputFilePath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });

  video.filePath = outputFilePath;
  video.duration = end - start;
  await video.save();
  
  const shareableLink = await generateShareableLink(outputFilePath);

  return { video, shareableLink };
};

const mergeVideos = async (videoIds) => {
  try {
    // Retrieve video details from the database
    const videos = await Video.findAll({ where: { id: videoIds } });
    if (videos.length !== videoIds.length) {
      throw new Error('One or more videos not found');
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create a list file for ffmpeg with all video paths
    const listFilePath = path.join(uploadsDir, 'merge_list.txt');
    const inputFiles = videos.map(video => `file '${path.resolve(video.filePath)}'`).join('\n');
    
    fs.writeFileSync(listFilePath, inputFiles);
    console.log('Merge list file created:', listFilePath);

    // Prepare the output file path
    const outputFilePath = path.join(uploadsDir, 'merged_video.mp4');

    // Use fluent-ffmpeg to merge videos
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(listFilePath)
        .inputOptions('-f concat')
        .inputOptions('-safe 0')
        .outputOptions('-c copy')
        .output(outputFilePath)
        .on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
          console.log('Processing: ' + progress.percent + '% done');
        })
        .on('end', () => {
          console.log('Merging completed');
          // Clean up the list file after processing
          fs.unlinkSync(listFilePath);
          resolve();
        })
        .on('error', (err) => {
          console.error('Error during merging:', err);
          reject(err);
        })
        .run();
    });

    // Create a new video entry for the merged video
    const mergedVideo = await Video.create({
      title: 'Merged Video',
      filePath: outputFilePath,
      duration: videos.reduce((sum, video) => sum + video.duration, 0),
      size: videos.reduce((sum, video) => sum + video.size, 0)
    });

    const shareableLink = await generateShareableLink(outputFilePath);

    return { mergedVideo, shareableLink };
  } catch (error) {
    console.error('Error in mergeVideos function:', error);
    throw error;
  }
};

const getVideos = async () => {
  const videos = await Video.findAll();
  return videos;
};

module.exports = { uploadVideo, trimVideo, mergeVideos, getVideos };
