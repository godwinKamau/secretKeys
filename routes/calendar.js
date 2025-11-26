const express = require("express");
const router = express.Router()
const calendarController = require("../controllers/calendar");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/siteEvents/id/:id", calendarController.getSiteCalendar)

module.exports = router;