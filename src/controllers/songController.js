import { v2 as cloudinary } from 'cloudinary';
import songModel from '../models/songModel.js';

const addSong = async (req, res) => {
  try {
    const { name, desc, album } = req.body;
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];

    if (!audioFile || !imageFile) {
      return res.json({ success: false, message: "Missing audio or image file" });
    }

    // Upload files to Cloudinary
    const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: "auto" }).catch(err => {
      console.error("Audio Upload Error:", err);
      return null;
    });

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" }).catch(err => {
      console.error("Image Upload Error:", err);
      return null;
    });

    if (!audioUpload || !imageUpload) {
      return res.json({ success: false, message: "Cloudinary upload failed" });
    }

    // Calculate duration
    const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`;

    const songData = {
      name,
      desc,
      album,
      image: imageUpload.secure_url,
      file: audioUpload.secure_url,
      duration
    };

    const song = new songModel(songData);
    await song.save();

    res.json({ success: true, message: "Song Added" });

  } catch (error) {
    console.error("Error adding song:", error);
    res.json({ success: false, message: error.message });
  }
};

const listSong = async (req, res) => {
    try {
      const allSongs = await songModel.find();
      res.json({success: true, songs: allSongs})
    } catch (error) {
      res.json({success:false})
    }
}

const removeSong = async (req, res) => {
  const id = req.body.id;
  try {
    await songModel.findByIdAndDelete(id);
    res.json({success: true, message: "Song Removed" })
  } catch (error) {
    res.json({success: false})
  }
}


export { addSong, listSong, removeSong };
