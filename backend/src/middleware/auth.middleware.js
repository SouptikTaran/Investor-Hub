import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import logger from "../configs/logger";

dotenv.config();
const prisma = new PrismaClient();

export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ error: "Access Denied. No token provided." });
        }
        
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET environment variable is not defined.");
        }
        
        const decoded = jwt.verify(token, jwtSecret);

        // Fetch user details from the database
        const user = await prisma.user.findUnique({
            where: { email: decoded.email },
            select: { id: true, email: true, role: true, profileId: true },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        logger.error("Authentication error:", error);
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};
