import vine, { errors } from "@vinejs/vine"
import slugify from 'slugify'


import prisma from "../db/db.config.mjs"
import { asyncHandler } from "../utils/AsyncHandler.mjs";
import { companySchema } from "../utils/validation.mjs"


/**
 * @route POST /api/v1/company/register
 * @desc Register Company
 * @access private
 */

export const registerCompany = asyncHandler(async (req, res) => {
    const body = req.body;

    try {
        const validator = vine.compile(companySchema)
        const payload = await validator.validate(body);

        const foundCompany = await prisma.company.findUnique({
            where: {
                email: payload.email,
            }
        })

        if (foundCompany) {
            return res.status(400).send({
                message: "Company with this email already exists."
            })
        }

        const slug = slugify(payload.name);

        const company = await prisma.company.create({
            data: {
                ...payload,
                slug,
            }
        })

        return res.status(201).json({
            success: true,
            message: "Successfully created new company.",
            data: company
        });


    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return res.status(400).json(error.messages)
        }
    }
})

/**
 * @route PATCH /api/v1/company/update/:id
 * @desc Update Company
 * @access private
 */

export const updateCompany = asyncHandler(async (req, res) => {
    const { location, email, phoneNumber, website, description, name } = req.body;
    const companyId = parseInt(req.params.id);
    try {
        const payload = {}

        if (location) payload.location = location;
        if (email) payload.email = email;
        if (phoneNumber) payload.phoneNumber = phoneNumber;
        if (website) payload.website = website;
        if (name) payload.name = name;
        if (description) payload.description = description;

        const updatedCompany = await prisma.company.update({
            where: { id: companyId },
            data: {
                ...payload
            }
        });

        return res.status(200).json({
            message: "Successfully updated the company information",
            data: updatedCompany
        })

    } catch (error) {
        console.log('Company-Update', error);
        return res.status(500).json({ message: "Internal Server Error" })
    }

})

/**
 * @route DELETE /api/v1/company/delete/:id
 * @desc Delete Company
 * @access private
 */
export const deleteCompany = asyncHandler(async (req, res) => {
    const companyId = parseInt(req.params.id);
    try {
        // Use Prisma's delete method to delete the company by ID
        await prisma.company.delete({
            where: { id: companyId },
        });

        return res.status(200).json({
            message: "Successfully deleted the company",
        });

    } catch (error) {
        console.log('Company-Delete', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

/**
 * @route GET /api/v1/company/all
 * @desc Get All Companies
 * @access private
 */
export const getAllCompanies = asyncHandler(async (req, res) => {
    try {
        // Use Prisma's findMany method to get all companies
        const companies = await prisma.company.findMany();

        return res.status(200).json({
            message: "Successfully retrieved all companies",
            data: companies,
        });

    } catch (error) {
        console.log('Get-All-Companies', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

/**
 * @route PATCH /api/v1/company/status/:id
 * @desc Update Company Status
 * @access private
 */

export const approvedCompany = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const companyId = parseInt(req.params.id);
    try {
        const payload = {}

        if (status) payload.status = status;

        const updatedCompany = await prisma.company.update({
            where: { id: companyId },
            data: payload
        });

        return res.status(200).json({
            message: "Successfully updated the company status",
            data: updatedCompany
        })

    } catch (error) {
        console.log('Company-Update', error);
        return res.status(500).json({ message: "Internal Server Error" })
    }

})