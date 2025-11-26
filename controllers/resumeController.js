



//controller for creating a new resume

import imageKit from "../configs/imageKit.js";
import Resume from "../Models/Resume.js";
import fs from 'fs'

//POST:/API/RESUIMES/CREATE

export const createResume=async (req,res)=>{
    try {
        const userId=req.userId;
        const {title}=req.body;
        //create new resumd

        const newResume=await Resume.create({userId,title})

        //return success message

        return res.status(201).json({message:"Resume Created Successfully",resume:newResume})
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}


//controller for deleting a resume

//Delete: /api/resumes/delete

export const deleteResume=async (req,res)=>{
    try {
        const userId=req.userId;
        const {resumeId}=req.params;
       
       await Resume.findByIdAndDelete({userId,_id:resumeId})

       //return success message
        return res.status(200).json({message:"Resume Deleted Successfully"})
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}




//get user resume by id

//GET: /api/resumes/get


export const getResumesById=async (req,res)=>{
    try {
        const userId=req.userId;
        const {resumeId}=req.params;
       
      const resume=await Resume.findOne({userId,_id:resumeId})

      if(!resume){
        res.status(404).json({message:"Resume not found"})
    }
    resume.__v =undefined;
    resume.createdAt=undefined;
    resume.updatedAt=undefined;
     return res.status(200).json({resume})
      }

       //return success message
       
     catch (error) {
        return res.status(400).json({message:error.message})
    }
}


//get resume by id public 

//GET /api/resumes/public
export const getPublicResumeById=async (req,res)=>{
try {
    const{resumeId}=req.params;
    const resume=await Resume.findOne({public:true,_id:resumeId})
    if(!resume){
        return res.status(404).json({message:"Resume not found"})

    }

    return res.status(200).json({resume})
} catch (error) {
     return res.status(400).json({message:error.message})
    }
}


//Controller for updating a resume

//PUT: /api/resumes/update
// PUT: /api/resumes/update
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, removeBackground } = req.body;

    let resumeDataCopy;

    // Parse resumeData safely
    if (typeof req.body.resumeData === "string") {
      resumeDataCopy = JSON.parse(req.body.resumeData);
    } else {
      resumeDataCopy = { ...req.body.resumeData };
    }

    // If image uploaded
    if (req.file) {
      const imagePath = req.file.path;

      const imageStream = fs.createReadStream(imagePath);

      const response = await imageKit.files.upload({
        file: imageStream,
        fileName: "resume-profile.png",
        folder: "user-resumes",
        transformation: {
          pre: `w-300,h-300,fo-face,z-0.75${removeBackground ? ",e-bgremove" : ""}`,
        },
      });

      resumeDataCopy.personal_info = {
        ...resumeDataCopy.personal_info,
        image: response.url,
      };
    }

    // Update resume
    const updatedResume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      resumeDataCopy,
      { new: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res
      .status(200)
      .json({ message: "Saved Successfully", resume: updatedResume });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};
