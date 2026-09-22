import { generateSmartInsights } from '../services/insightEngine.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getInsights = async (req, res, next) => {
  try {
    const insights = await generateSmartInsights(req.userId);
    return sendSuccess(res, {
      message: 'Financial insights generated.',
      data: {
        insights,
      },
    });
  } catch (err) {
    next(err);
  }
};
