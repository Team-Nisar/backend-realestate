import expresss from 'express'
import { loginAdmin, RegisterAdmin } from '../controllers';
import { verifyAdmin } from '../../../middleware/verifyAdmin';
const router = expresss.Router()


router.post('/register', RegisterAdmin)
router.post('/login', loginAdmin)

router.use(verifyAdmin)

export default router;