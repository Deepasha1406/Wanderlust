const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const { authorize } = require("passport");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//new route  => it should always be above /:id route
router.get("/new",isLoggedIn,listingController.renderNewForm);
router.get("/filter/:id", wrapAsync(listingController.filter));
router.get("/search", wrapAsync(listingController.search));//search route

router.route("/")
.get( wrapAsync(listingController.index))  //index route
.post(isLoggedIn,
    upload.single('listing[image]'), 
    validateListing,
    wrapAsync (listingController.createListing)); //create route

router.route("/:id")
.get( wrapAsync(listingController.showListing))  //show route
.put( isLoggedIn,isOwner,upload.single('listing[image]'),
 validateListing, wrapAsync(listingController.updateListing)) //update route
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));   //delete route


//edit route
// router.get("/:id/edit",isLoggedIn,isOwner, upload.single('listing[image]'), wrapAsync(listingController.renderEditForm));
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


 module.exports = router;