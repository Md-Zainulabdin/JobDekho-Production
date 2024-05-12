import { Router } from "express"
import { isAuthenticated } from "../middleware/auth.middleware.mjs";
import { createJob, getAllJobs } from "../controller/job.controller.mjs";
import { limitor } from "../middleware/rateLimitor.middleware.mjs";

const router = Router()

router.use(isAuthenticated, limitor)

router.route('/all').get(getAllJobs)
router.route('/create').post(createJob)
router.route('/update/:id').patch(updateCompany)
router.route('/status/:id').patch(approvedCompany)
router.route('/delete/:id').delete(deleteCompany)


export default router;