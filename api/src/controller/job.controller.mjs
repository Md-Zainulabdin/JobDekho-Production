import vine, { errors } from "@vinejs/vine"
import slugify from 'slugify'

import prisma from "../db/db.config.mjs"
import { asyncHandler } from "../utils/AsyncHandler.mjs";
import { jobSchema } from "../utils/validation.mjs"


/**
 * @route GET /api/v1/jobs/all
 * @desc Get All Jobs
 * @access private
 */
export const getAllJobs = asyncHandler(async (req, res) => {
    try {
        // Use Prisma's findMany method to get all companies
        const jobs = await prisma.job.findMany();

        return res.status(200).json({
            message: "Successfully retrieved all Jobs",
            data: jobs,
        });

    } catch (error) {
        console.log('Get-All-Jobs', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

/**
 * @route POST /api/v1/jobs/create
 * @desc Create a new Company
 * @access private
 */

export const createJob = asyncHandler(async (req, res) => {
    const body = req.body;
    const companyId = req.user.id;

    try {
        const validator = vine.compile(jobSchema)
        const payload = await validator.validate(body);

        const slug = payload.title;

        const job = await prisma.job.create({
            data: {
                ...payload,
                slug,
                companyId: companyId,
            }
        })

        return res.status(201).json({
            success: true,
            message: "Successfully created new job.",
            data: job
        });


    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return res.status(400).json(error.messages)
        }
    }
})

/**
 * @route PATCH /api/v1/jobs/:id
 * @desc Update a job by ID
 * @access private
 */

export const updateJob = asyncHandler(async (req, res) => {
    const jobId = parseInt(req.params.id);
    const companyId = (req.user.id).toString();
    const { description, title, location, locationType, jobType, salary, applicationEmail, applicationUrl } = req.body;

    try {
        const job = await prisma.job.findUnique({
            where: { id: jobId },
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        const payload = {}

        if (location) payload.location = location;
        if (title) payload.title = title;
        if (locationType) payload.locationType = locationType;
        if (jobType) payload.jobType = jobType;
        if (salary) payload.salary = salary;
        if (applicationEmail) payload.applicationEmail = applicationEmail;
        if (applicationUrl) payload.applicationUrl = applicationUrl;
        if (description) payload.description = description;

        if (companyId !== job.companyId) {
            return res.status(403).send("You are not authorized to perform this action");
        }

        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: updates,
        });

        return res.status(200).json({
            success: true,
            message: "Successfully updated the Job information",
            data: updatedJob,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

/**
 * @route DELETE /api/v1/jobs/:id
 * @desc Delete a job by ID
 * @access private
 */

export const deleteJob = asyncHandler(async (req, res) => {
    const jobId = parseInt(req.params.id);
    const companyId = (req.user.id).toString();

    try {
        const job = await prisma.job.findUnique({
            where: { id: jobId },
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        if (companyId !== job.companyId) {
            return res.status(403).send("You are not authorized to perform this action");
        }

        await prisma.job.delete({
            where: { id: jobId },
        });

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

/**
 * @route PATCH /api/v1/company/status/:id
 * @desc Update Company Status
 * @access private
 */

export const approvedJob = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const jobId = parseInt(req.params.id);
    const companyId = (req.user.id).toString();

    try {
        const payload = {}

        if (status) payload.status = status;

        const updatedJob = await prisma.job.update({
            where: { id: jobId, companyId: companyId },
            data: payload
        });

        return res.status(200).json({
            message: "Successfully updated the job status",
            data: updatedJob
        })

    } catch (error) {
        console.log('Job-Update', error);
        return res.status(500).json({ message: "Internal Server Error" })
    }

})