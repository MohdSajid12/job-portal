import { Application } from "../models/applicationModel.js";
import { Job } from "../models/jobModel.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "JobId is required",
                success: false
            })
        };
        //check if user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            })
        }
        //check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(400).json({
                message: "Job not found",
                success: false
            })
        } 
        //creating a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        })

        //pushing jobiD In job schema
        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job Applied Successfully",
            status: true
        })
    }
    catch (error) {
        console.log('ERROR', error);
    }


}

export const getAppliedJob = async (req, res) => {
    try {
       const userId = req.id;
       const application = await Application.find({applicant : userId}).sort({createdAt:-1}).populate({
         path : 'job',
         options :  {sort :{createdAt : -1}},
         populate : {
            path : 'company',
            options :  {sort :{createdAt : -1}},
         }
       });
       if(!application){
          return res.status(404).json({
             message : "No application found",
             success : false
          })
       }
       return res.status(200).json({
          application,
          success : true
       })
    }
    catch (error) {
        console.log('ERROR', error);
    }

}

//Recruiter will see how many applicant applied 
export const getApplicants = async (req,res) =>{
    try {
        //first we are fetching job then we will fetch how many applicant applied for this job
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path : 'applications',
            options: {sort : {createdAt :-1}},
            populate : {
                path : 'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message : 'Job not found',
                success : false
            })
        };
        return res.status(200).json({
            job,
            success :  true
        })
    }
    catch(error){
        console.log('ERROR' ,error);
    }
}

export const updateStatus = async (req,res) =>{
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message : "Status is required",
                success :false
            })
        }
        //find the application by applicationId
        const application = await Application.findOne({_id :applicationId});
        if(!application){
            return res.status(404).json({
                message : "Application not found",
                success : false
            })
        };
        //update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message : "Status updated successfully",
            success :  true
        })
    }
    catch(error)
    {
        console.log('ERROR' ,error);
    }
}