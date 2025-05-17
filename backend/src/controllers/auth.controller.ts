import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.client";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../config/env.config";

/**
 * @function signUp
 * @description Registers a new user by saving their details into the database and returning a signed JWT token.
 * @param {Request} req - Express request object containing user registration data in the body.
 * @param {Response} res - Express response object used to send status and JSON data.
 * @param {NextFunction} next - Express next middleware function for error handling.
 * @returns {Promise<void>} Responds with success status, JWT token, and newly created user data on success.
 *
 * @throws {400} If any required fields are missing, or if a user with the provided email already exists.
 */

export const signUp =  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password, role, phone } = req.body;

        if ( !name || !email || !password || !role || !phone ) {
            res.status(400).json({
                success: false,
                error: 'Please provide all the required fields.'
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if ( !emailRegex.test(email) ) {
            res.status(400).json({
                success: false,
                error: 'Invalid phone number format.'
            });
            return;
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if ( !phoneRegex.test(phone) ) {
            res.status(400).json({
                success: false,
                error: 'Invalid phone number format.'
            });
            return;
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if ( existingUser ) {
            res.status(400).json({
                success: false,
                error: 'A user with this email already exists.'
            });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                role: role.toUpperCase(),
                phone: phone
            }
        });

        const userToken = jwt.sign({
            userId: newUser.id
        }, JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(201).json({
            success: true,
            message: 'User successfully signed up',
            data: {
                token: userToken,
                user: newUser,
            }
        });

    } catch ( error: any ) {
        next(error);
    }
}

/**
 * @function signIn
 * @description Authenticates an existing user by verifying their credentials and returning a JWT token.
 * @param {Request} req - Express request object containing login credentials in the body.
 * @param {Response} res - Express response object used to send status and JSON data.
 * @param {NextFunction} next - Express next middleware function for error handling.
 * @returns {Promise<void>} Responds with success status, JWT token, and user data on success.
 *
 * @throws {400} If email or password is missing.
 * @throws {401} If user is not found or password doesn't match.
 */

export const signIn =  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        if ( !email || !password ) {
            res.status(400).json({
                success: false,
                error: 'Please provide your email and password.'
            });
            return;
        }
        const user = await prisma.user.findUnique(
            {
                where: {
                    email: email
                },
                omit: {
                    password: true,
                }
            }
        );

        if ( !user || !(await bcrypt.compare(password, user.password)) ) {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials.'
            });
            return;
        }

        const userToken = jwt.sign({
            userId: user.id
        }, JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(200).json({
            success: true,
            message: 'User successfully signed in.',
            data: {
                token: userToken,
                user: user
            }
        });

    } catch ( error: any ) {
        next(error);
    }
}

/**
 * @todo signOut function is a work in progress.
 */

export const signOut =  async (req: Request, res: Response, next: NextFunction): Promise<void> => {}