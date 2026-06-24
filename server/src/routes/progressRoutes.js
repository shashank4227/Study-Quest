import express from 'express';
import { submitChallenge, getProgress, saveRunHistory, saveDraft } from '../controllers/progressController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/submit').post(protect, submitChallenge);
router.route('/history').post(protect, saveRunHistory);
router.route('/draft').post(protect, saveDraft);
router.route('/').get(protect, getProgress);

export default router;
