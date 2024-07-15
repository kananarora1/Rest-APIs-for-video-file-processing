const videoService = require('../Services/videoService');

const uploadVideo = async (req, res) => {
  try {
    const file = req.file;
    const title = req.body.title;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const video = await videoService.uploadVideo(file, title);

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const trimVideo = async (req, res) => {
  try {
    const trimmedVideo = await videoService.trimVideo(req.params.id, req.body);
    res.status(200).json(trimmedVideo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const mergeVideos = async (req, res) => {
  try {
    const mergedVideo = await videoService.mergeVideos(req.body.videoIds);
    res.status(200).json(mergedVideo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// const getVideos = async(req, res) =>{

// }

module.exports = { uploadVideo, trimVideo, mergeVideos };
