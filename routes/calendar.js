const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const calendarController = require("../controllers/calendar");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/siteEvents/id/:id", calendarController.getSiteCalendar)
router.post("/postEvents", upload.single("file"), calendarController.postEvent)
router.get("/getEvents/id/:id", calendarController.getEvents)
router.post("/addEvent", calendarController.addEvent)
router.get("/personalEvents", calendarController.getPersonalCalendar)
router.get("/getUserEvents", calendarController.getUserEvents)

module.exports = router;