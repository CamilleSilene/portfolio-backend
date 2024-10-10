const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const projectsCtrl = require("../controllers/Ctrl-Project");
const multer = require("../middleware/multer-config");
const optimizeImage = require("../middleware/sharp-config");

router.get("/", projectsCtrl.getAllProject);
router.get("/tags", projectsCtrl.getAllTags);
router.get("/tag/:tag", projectsCtrl.getProjectsByTag);
//router.get("/tags/filters", projectsCtrl.getFiltersTags);
router.post("/", multer, optimizeImage, projectsCtrl.createProject);
router.get("/:id", projectsCtrl.getOneProject);
router.put("/:id", multer, optimizeImage, projectsCtrl.modifyProject);
router.delete("/:id", projectsCtrl.deleteProject);

module.exports = router;
