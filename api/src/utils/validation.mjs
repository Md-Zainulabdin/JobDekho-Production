import vine from '@vinejs/vine'
import { CustomErrorReporter } from "./customErrorReporter.mjs"

// * Custom Error Reporter 
vine.errorReporter = () => new CustomErrorReporter();

export const registerSchema = vine.object({
    firstname: vine.string().minLength(2).maxLength(10),
    lastname: vine.string().minLength(2).maxLength(10),
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(36)
})

export const loggedInSchema = vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(36)
})

export const companySchema = vine.object({
    name: vine.string().minLength(2).maxLength(10),
    description: vine.string(),
    email: vine.string().email(),
    location: vine.string(),
})

export const jobSchema = vine.object({
    title: vine.string().minLength(2).maxLength(10),
    description: vine.string(),
    location: vine.string(),
    locationType: vine.string(),
    jobType: vine.string(),
    salary: vine.string(),
})