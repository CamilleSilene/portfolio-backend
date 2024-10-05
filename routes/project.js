const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const projectsCtrl = require("../controllers/Ctrl-Project");
const multer = require("../middleware/multer-config");
const optimizeImage = require("../middleware/sharp-config");

router.get("/", projectsCtrl.getAllProject);
//router.get("/tags", projectsCtrl.getTags);
//router.get("/tags/filters", projectsCtrl.getFiltersTags);
router.post("/", auth, projectsCtrl.createProject);
router.get("/:id", projectsCtrl.getOneProject);
router.put("/:id", auth, projectsCtrl.modifyProject);
router.delete("/:id", auth, projectsCtrl.deleteProject);

module.exports = router;
