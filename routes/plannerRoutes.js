import express from 'express';
import { suggestCrops, savePlan, getUserPlans, getSoilTypes } from '../controllers/plannerController.js';

const router = express.Router();

// Crop suggestion route
router.post('/suggest-crops', suggestCrops);

// Save plan route
router.post('/save-plan', savePlan);

// Get user plans route
router.get('/user-plans/:userId', getUserPlans);

// Get soil types route
router.get('/soil-types', getSoilTypes);

export default router;