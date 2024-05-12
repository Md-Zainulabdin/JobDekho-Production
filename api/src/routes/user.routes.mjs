import { Router } from "express"
import { getAllUsers, updateUser } from "../controller/user.controller.mjs";
import { isAuthenticated } from "../middleware/auth.middleware.mjs";
import { limitor } from "../middleware/rateLimitor.middleware.mjs";

const router = Router()

router.use(isAuthenticated, limitor)

router.route('/all').get(getAllUsers)
router.route('/update/:id').patch(updateUser)
router.route('/delete/:id').delete()


export default router;