import bcrypt from 'bcryptjs'
import vine, { errors } from "@vinejs/vine"

import { asyncHandler } from "../utils/AsyncHandler.mjs"
import { registerSchema } from "../utils/validation.mjs"
import prisma from "../db/db.config.mjs"

/**
 * @route POST /api/v1/users/register
 * @desc Register a new user
 * @access public
 */

export const registerUser = asyncHandler(async (req, res) => {
    const body = req.body;

    try {
        const validator = vine.compile(registerSchema)
        const paylaod = await validator.validate(body);

        const foundUser = await prisma.user.findUnique({
            where: {
                email: paylaod.email,
            }
        })

        if (foundUser) {
            return res.status(409).send("User with this email already exists")
        }

        const salt = await bcrypt.genSalt();
        paylaod.password = await bcrypt.hash(paylaod.password, salt)

        // save user to database
        const user = await prisma.user.create({
            data: {
                ...paylaod,
                role: 'USER',
            }
        })

        return res.json({
            message: "User Registered Successfully",
            user: {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
            }
        }).status(201)

    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return res.status(400).json(error.messages)
        } else {
            return res.status(500).json({
                message: 'Internal Server Error',
            })
        }
    }
})

/**
 * @route PATCH /api/v1/users/update/:id
 * @desc Update a current user
 * @access private
 */

export const updateUser = asyncHandler(async (req, res) => {
    const { firstname, lastname, experience, position, description } = req.body;
    const userId = parseInt(req.params.id);
    try {
        const payload = {}

        if (firstname) payload.firstname = firstname;
        if (lastname) payload.lastname = lastname;
        if (experience) payload.experience = experience;
        if (position) payload.position = position;
        if (description) payload.description = description;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...payload
            }
        });

        return res.status(200).json({
            message: "Profile Updated Successfully",
            data: updatedUser
        })

    } catch (error) {
        console.log('Profile-Update', error);
        return res.status(500).json({ message: "Internal Server Error" })
    }

})

/**
 * @route DELETE /api/v1/users/delete/:id
 * @desc Delete a current user
 * @access private
 */

export const deleteUser = asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id); // Assuming id is passed as a route parameter

    try {
        // Check if user exists
        const foundUser = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        });

        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete user
        await prisma.user.delete({
            where: {
                id: userId,
            },
        });

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log('User-Delete', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

/**
 * @route GET /api/v1/users/all
 * @desc Get all user
 * @access private
 */

export const getAllUsers = asyncHandler(async (_, res) => {
    try {
        const users = await prisma.user.findMany({})

        if (users) {
            return res.status(200).json(users)
        }
    } catch (error) {
        console.log('Users-Get', error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
})