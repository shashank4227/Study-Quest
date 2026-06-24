import express from 'express';
import { Challenge } from '../models/Challenge.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/debug', async (req, res) => {
  try {
    const challenges = await Challenge.find({ world: 1 }).sort({ order: 1 });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// @desc    Get all challenges or filter by world and course
// @route   GET /api/challenges
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const filter = { course: req.query.course || 'javascript' };
    if (req.query.world) {
      filter.world = req.query.world;
    }
    const challenges = await Challenge.find(filter).sort({ world: 1, order: 1 });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get single challenge by slug
// @route   GET /api/challenges/:slug
// @access  Private
router.get('/:slug', protect, async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ slug: req.params.slug });
    if (challenge) {
      res.json(challenge);
    } else {
      res.status(404).json({ message: 'Challenge not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
