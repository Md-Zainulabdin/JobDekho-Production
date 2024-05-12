import { Router } from "express"
import { registerUser } from "../controller/user.controller.mjs"
import { LoggedInCompany, LoggedInUser } from "../controller/auth.controller.mjs"
import { authRateLimitor } from "../middleware/rateLimitor.middleware.mjs"

const router = Router()

router.route('/register').post(registerUser)
router.route('/user/login').post(LoggedInUser)
router.route('/company/login').post(authRateLimitor, LoggedInCompany)

export default router;