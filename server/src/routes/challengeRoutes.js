import express from 'express';
import { Challenge } from '../models/Challenge.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// @desc    Get all challenges or filter by world
// @route   GET /api/challenges
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.query.world ? { world: req.query.world } : {};
    // Don't send expectedOutput to client unless they shouldn't see it? 
    // Actually, client needs expectedOutput to validate in Web Worker, or we validate backend.
    // The prompt says "When user clicks submit: Execute code, Compare output, Validate".
    // If Web Worker compares, it needs expectedOutput. So we send it.
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
