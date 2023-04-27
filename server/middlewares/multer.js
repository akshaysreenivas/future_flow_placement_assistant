const multer = require("multer");

//Upload Settings
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, "./public/images");
        },
        filename: function (req, file, callback) {
            callback(null, Date.now() + file.originalname);
        }
    }),
    limits: {
        fileSize: 1024 * 1024 // 1MB
    }
});

module.exports.documentUpload = (req, res, next) => {
    upload.fileFilter = (req, file, callback) => {
        if (
            file.mimetype !== "application/pdf" &&
            file.mimetype !== "application/msword" &&
            file.mimetype !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            const error = new Error("Invalid file type.");
            error.statusCode = 400;
            return callback(error);
        }
        callback(null, true);
    };


    upload.single("file")(req, res, function (err) {
        if (err) {
            next(err);
        } else {
            next();
        }
    });
};

module.exports.imageUpload = (req, res, next) => {
    upload.fileFilter = (req, file, callback) => {
        if (
            file.mimetype !== "image/jpeg" &&
            file.mimetype !== "image/jpg" &&
            file.mimetype !== "image/png" &&
            file.mimetype !== "image/gif" &&
            file.mimetype !== "image/webp"
        ) {
            const error = new Error("Invalid file type.");
            error.statusCode = 400;
            return callback(error);
        }
        callback(null, true);
    };
    upload.single("image")(req, res, function (err) {
        if (err) {
            next(err);
        } else {
            next();
        }
    });
};
