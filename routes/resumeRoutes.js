import express from 'express'
import protect from '../Middleware/authMiddleware.js';
import { createResume, deleteResume, getPublicResumeById, getResumesById, updateResume } from '../controllers/resumeController.js';
import upload from '../configs/multer.js';

const resumeRouter=express.Router();

resumeRouter.post('/create',protect,createResume)
resumeRouter.put('/update',upload.single('image'), protect,updateResume)

resumeRouter.delete('/delete/:resumeId',protect,deleteResume);
resumeRouter.get('/get/:resumeId',protect,getResumesById);
resumeRouter.get('/public/:resumeId',getPublicResumeById)

export default resumeRouter;