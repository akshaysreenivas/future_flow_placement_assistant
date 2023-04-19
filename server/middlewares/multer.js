const multer = require("multer");

// set storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

//Upload Setting
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/gif" ||
            file.mimetype === "image/webp"||
            file.mimetype === "application/pdf"
        ) {
            req.body.fileuploaded = true;
            cb(null, true);
        }
        else {
            req.body.fileuploaded = false;
            cb(null, false);
        }
    }
});

module.exports = upload;
