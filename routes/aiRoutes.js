import express from 'express';
import protect from '../Middleware/authMiddleware.js';
import { enchanceJobDescription, enchanceProfessionalSummary, uploadResume} from '../controllers/aiController.js';

const aiRouter=express.Router();

aiRouter.post('/enhance-pro-sum',protect,enchanceProfessionalSummary)
aiRouter.post('/enhance-job-desc',protect,enchanceJobDescription)
aiRouter.post('/upload-resume',protect,uploadResume)

export default aiRouter;