import { Router } from "express"
import { isAuthenticated } from "../middleware/auth.middleware.mjs";
import { approvedCompany, deleteCompany, getAllCompanies, registerCompany, updateCompany } from "../controller/company.controller.mjs";
import { limitor } from "../middleware/rateLimitor.middleware.mjs";

const router = Router()

router.route('/all').get(getAllCompanies)
router.route('/register').post(registerCompany)

router.use(isAuthenticated, limitor)

router.route('/update/:id').patch(updateCompany)
router.route('/status/:id').patch(approvedCompany)
router.route('/delete/:id').delete(deleteCompany)


export default router;