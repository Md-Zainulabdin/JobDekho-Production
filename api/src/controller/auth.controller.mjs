import bcrypt from 'bcryptjs'
import vine, { errors } from "@vinejs/vine"
import jwt from 'jsonwebtoken'
import { Resend } from "resend";

import prisma from "../db/db.config.mjs"
import { asyncHandler } from "../utils/AsyncHandler.mjs";
import { loggedInSchema } from '../utils/validation.mjs';

/**
 * @route POST /api/v1/auth/user/login
 * @desc Login User
 * @access public
 */

export const LoggedInUser = asyncHandler(async (req, res) => {
    const body = req.body;

    try {
        const validator = vine.compile(loggedInSchema)
        const paylaod = await validator.validate(body);

        const foundUser = await prisma.user.findUnique({
            where: {
                email: paylaod.email,
            }
        })

        if (!foundUser) {
            return res.status(400).send({
                message: "User not found"
            })
        }

        const isPasswordValid = await bcrypt.compare(paylaod.password, foundUser.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password!" })
        }

        const payload = {
            id: foundUser.id,
            email: foundUser.email
        }

        let token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })


        return res.status(200).json({
            message: 'Login Successfully',
            data: {
                token: token,
                role: foundUser.role,
            }
        })

    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return res.status(400).json(error.messages)
        }
    }
})

/**
 * @route POST /api/v1/auth/company/login
 * @desc Login User
 * @access public
 */

const resend = new Resend(process.env.RESEND_PASSKEY);

export const LoggedInCompany = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;

        const foundCompany = await prisma.company.findUnique({
            where: {
                email: email,
            }
        })

        if (!foundCompany) {
            return res.status(404).json({
                message: "Wrong Credentials"
            })
        }

        const payload = {
            email: foundCompany.email,
            id: foundCompany.id,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        // const { data, error } = await resend.emails.send({
        //     to: foundCompany.email,
        //     from: "onboarding@resend.dev",
        //     subject: "Jobdekho - Magic Link",
        //     html: `<div>
        //     <h1>
        //     <a href="${token}">Link</a>
        //     </h1>
        //     </div>`
        // });

        // if (error) {
        //     return res.status(400).json({
        //         message: "Failed to send email",
        //         error: error.message,
        //         statusCode: error.statusCode,
        //     })
        // }

        return res.status(200).json({
            message: "Email sent successfully",
            data: token,
        })

    } catch (error) {
        return res.status(400).json({
            message: "Internal Server Error"
        })
    }
})
