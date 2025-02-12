import { userSignUpSchema } from '../schema/user.schema.js';
import { PrismaClient, UserRole, InvestorMentorType } from '@prisma/client';
import bcrypt, { compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import classifyQueryToCategory from '../configs/gemini.service.js';
import sendEmail from '../configs/nodemailer.service.js';
import logger from '../configs/logger.js';
import { OAuth2Client } from 'google-auth-library';
import {jwtDecode} from "jwt-decode"


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const prisma = new PrismaClient();
export const signUp = async (req, res) => {
    const { email, password, role, profileName, category } = req.body;
    console.log(req.body)
    try {
        const validatedData = userSignUpSchema.safeParse(req.body);
        if (!validatedData.success) {
            logger.warn(validatedData.error)
            return res.json({ error: "Wrong Information Passed" });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.json({ error: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Ensure JWT_SECRET is defined.
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            logger.error("JWT_SECRET environment variable is not defined.")
            throw new Error("JWT_SECRET environment variable is not defined.");
        }

        if (role === UserRole.USER) {
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: UserRole.USER,
                },
            });
            const token = jwt.sign({ email, role }, jwtSecret, { expiresIn: '1h' });
            return res.json({ message: 'User created successfully.', user: newUser, token });
        }

        if (role === UserRole.INVESTOR || role === UserRole.MENTOR) {
            if (!profileName || !category) {
                return res.status(400).json({
                    error: 'Profile name and category are required for investors or mentors.',
                });
            }

            const profile = await prisma.investorMentor.create({
                data: {
                    name: profileName.toLowerCase(),
                    category: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
                    type: role === UserRole.INVESTOR ? InvestorMentorType.Investor : InvestorMentorType.Mentor,
                },
            });

            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role,
                    profileId: profile.id,
                },
            });

            const token = jwt.sign({ email, role }, jwtSecret, { expiresIn: '1h' });
            return res.json({
                message: `${role} created successfully.`,
                user: newUser,
                profile,
                token,
            });
        }

        return res.status(400).json({ error: 'Invalid role provided.' });
    } catch (error) {
        logger.error('Error during signup:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

export const userProfile = (req, res) => {
    try {
        res.status(200).json({ message: "User data retrieved", user: req.user });
    } catch (error) {
        logger.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Ensure JWT_SECRET is defined.
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET environment variable is not defined.");
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: user.email, role: user.role },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful.', user, token });
    } catch (error) {
        logger.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.investorMentor.findMany({
            distinct: ['category'],
            select: {
                category: true
            }
        });

        // Return only the category values
        const categoryList = categories.map(cat => cat.category);
        res.json(categoryList);
    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: 'Error fetching categories' });
    }
};

export const getInvestorsAndMentors = async (req, res) => {
    const { query } = req.body; 
    if (!query) {
        return res.status(400).json({ error: 'Category query is required' });
    }

    try {
        const userCredit = await prisma.user.findUnique({
            where: {
                email: req.user.email
            }
        });

        console.log(req.user.email + " " + userCredit.credit);

        if (userCredit.credit <= 0) {
            sendEmail(req.user.email, 'No Credits Left', 'You are running low on credits, please recharge to keep enjoying our services.');
            return res.json({ msg: "No credits Left" });
        }

        // Step 1: Fetch category list from DB
        const categories = await prisma.investorMentor.findMany({
            distinct: ['category'],
            select: { category: true }
        });

        const categoryList = categories.map(cat => cat.category);

        let geminiResponse;
        try {
            geminiResponse = await classifyQueryToCategory(query, categoryList);
        } catch (error) {
            logger.error("Error classifying query:", error);
            return res.status(500).json({ error: 'Failed to classify query' });
        }

        console.log('Gemini Response:', geminiResponse);

        if (!geminiResponse) {
            return res.json({ msg: 'Unable to determine the category from Gemini' });
        }
        if(geminiResponse.includes("Not found")){
            return res.json({ msg: 'Not found' });

        }

        const resolvedCategory = geminiResponse.charAt(0).toUpperCase() + geminiResponse.slice(1).toLowerCase();

        await prisma.user.update({
            where: { email: req.user.email },
            data: { credit: userCredit.credit - 1 }
        });

        const users = await prisma.investorMentor.findMany({
            where: { category: resolvedCategory },
            select: { name: true, type: true, category: true }
        });

        if (users.length === 0) {
            return res.json({ msg: 'No investors or mentors found for this category' });
        }

        return res.status(200).json({ users });
    } catch (err) {
        logger.error('Error fetching users:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


export const googleAuth = async(req , res)=>{
    const { token } = req.body;
    try {
        // const ticket = await client.verifyIdToken({
        //     idToken: token,
        //     audience: process.env.GOOGLE_CLIENT_ID,
        // });

        const {email} = jwtDecode(token)
        // console.log(jwtDecode(token));
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    password: token,
                    role: UserRole.USER,   
                },
            });
        }
        const jwtSecret = process.env.JWT_SECRET;
        const authToken = jwt.sign({ email: user.email, role: user.role }, jwtSecret, { expiresIn: '1h' });

        res.json({ message: 'Login successful', user, token: authToken });

    } catch (error) {
        logger.error("Google Auth Error : " , error);
        console.error("Google Auth Error:", error);
        res.status(500).json({ error: 'Authentication failed' });
    }
}   