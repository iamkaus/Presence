import { Router } from 'express';
import { signIn, signOut, signUp } from "../controllers/auth.controller";

/**
 * @constant authRoutes
 * @description Express router for handling authentication-related routes.
 */

const authRoutes = Router();

/**
 *
 * @route POST /api/v1/auth
 * @description allows a user to create an account [ create a new user ]
 * @access Public
 */

authRoutes.post('/sign-up', signUp)

/**
 * @route POST /api/v1/auth
 * @description allows a user to sing-in to their account [log-in]
 * @access Public
 */

authRoutes.post('/sign-in', signIn)

/**
 * @route POST /api/v1/auth
 * @description allows a user to sign out of their account [log-out]
 * @access Public
 */


authRoutes.post('/sign-out', signOut)

/**
 * @exports authRoute
 * @description Exports the configured authentication router.
 */

export default authRoutes