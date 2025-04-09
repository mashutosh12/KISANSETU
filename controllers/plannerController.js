import supabase from '../models/database.js';
import { getCurrentSeason } from '../services/weatherService.js';

/**
 * Suggest crops based on soil type, season, and location
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const suggestCrops = async (req, res) => {
  try {
    const { soilType, latitude, longitude } = req.body;
    
    if (!soilType || !latitude || !longitude) {
      return res.status(400).json({ 
        success: false, 
        message: 'Soil type, latitude, and longitude are required' 
      });
    }

    // Get current season based on location
    const season = await getCurrentSeason(latitude, longitude);

    // Query crops from Supabase database based on soil type and season
    const { data: crops, error } = await supabase
      .from('crops')
      .select('*')
      .filter('soil_types', 'cs', `{${soilType}}`)
      .filter('suitable_seasons', 'cs', `{${season}}`);

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching crop suggestions', 
        error: error.message 
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        season,
        crops
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * Save planner data
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const savePlan = async (req, res) => {
  try {
    const { soilType, season, location, selectedCrops, userId } = req.body;
    
    if (!soilType || !season || !location || !selectedCrops || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Save plan to Supabase
    const { data, error } = await supabase
      .from('planner')
      .insert({
        user_id: userId,
        soil_type: soilType,
        season,
        location,
        selected_crops: selectedCrops,
        created_at: new Date()
      })
      .select();

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error saving plan', 
        error: error.message 
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Plan saved successfully',
      data
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * Get user's saved plans
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getUserPlans = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    // Get plans from Supabase
    const { data, error } = await supabase
      .from('planner')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching plans', 
        error: error.message 
      });
    }

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * Get soil types
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getSoilTypes = async (req, res) => {
  try {
    // Get soil types from Supabase
    const { data, error } = await supabase
      .from('soil_types')
      .select('*');

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching soil types', 
        error: error.message 
      });
    }

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

export { suggestCrops, savePlan, getUserPlans, getSoilTypes };