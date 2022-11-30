// import the database connection
import { db } from '../db/index.js';

// find all photos from database
export const getPhotos = async (req, res) => {
  try {
    const albums = await db.query('SELECT * FROM albums'); // FIX THIS!

    if (!albums) {
      return res.status(404).send();
    }

    res.send(albums);
  } catch (error) {
    res.status(500).send();
  }
};

// GET ALBUMS BY ID
export const getPhotoById = async (req, res) => {
  const id = req.params.id;

  try {
    const album = await db.query('SELECT * FROM albums WHERE id = $1', [id]);

    // if an album does not exist
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.send(album);
  } catch (error) {
    res.status(500).send();
  }
};
