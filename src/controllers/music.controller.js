const musicModel = require('../models/music.model');
const albumModel = require('../models/album.model');
const { uploadFile } = require('../Services/storage.service');

async function createMusic(req, res) {
    const { title } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });
    if (!title) return res.status(400).json({ message: 'Title is required' });

    try {
        const result = await uploadFile(file);

        const music = new musicModel({
            uri: result.url || result.filePath || result.name,
            title,
            artist: req.user.id,
        });
        await music.save();

        return res.status(201).json({
            message: 'Music created successfully',
            music: {
                id: music._id,
                title: music.title,
                uri: music.uri,
                artist: music.artist,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function createAlbum(req, res) {
    const { title, musics } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (!Array.isArray(musics) || musics.length === 0) {
        return res.status(400).json({ message: 'musics must be a non-empty array' });
    }

    try {
        const album = await albumModel.create({
            title,
            musics,
            artist: req.user.id,
        });

        return res.status(201).json({
            message: 'Album created successfully',
            album: {
                id: album._id,
                title: album.title,
                artist: album.artist,
                musics: album.musics,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
async function getAllMusics(req, res) {
    try {
        const musics = await musicModel
        .find()
        .skip(10)
        .limit(1)
        .populate("artist", "username email")

        return res.status(200).json({
            message: 'Musics fetched successfully',
            user: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role,
            },
            musics,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
async function getAllAlbums(req, res) {
    try {
        const albums = await albumModel
            .find()
            .populate({
                path: 'musics',
                select: 'title uri artist',
                populate: { path: 'artist', select: 'username email' },
            })
            .populate({ path: 'artist', select: 'username email' })
            .lean();

        return res.status(200).json({ message: 'Albums fetched successfully', albums });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
async function getAlbumById(req, res) {
    try {
        const albumId = req.params.albumId;

        const album = await albumModel
            .findById(albumId)
            .populate({
                path: 'musics',
                select: 'title uri artist',
                populate: { path: 'artist', select: 'username email' },
            })
            .populate({ path: 'artist', select: 'username email' })
            .lean();

        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }

        return res.status(200).json({
            message: 'Album fetched successfully',
            album,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
    module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById }