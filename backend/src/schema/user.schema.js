import {z} from 'zod'

const UserRole = {
    USER: "USER",
    MENTOR: "MENTOR",
    INVESTOR: "INVESTOR"
};

export const userSignUpSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Must be 5 or more characters long" }),
    role: z.enum([UserRole.USER, UserRole.MENTOR, UserRole.INVESTOR], { message: "Role not present" }),
    profileName:z.string().min(4,{message : "Must be 4 or more characters"}).optional(),
    category:z.string().min(1,{message: 'Category not present'}).optional()
}) 