import { Router } from "./express";
var router = Router();
router.get("/", function(req, res) {
    res.send("API is working properly");
});
export default router;