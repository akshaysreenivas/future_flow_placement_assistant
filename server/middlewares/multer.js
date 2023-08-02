// const multer = require("multer");

// //Upload Settings
// const upload = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, callback) {
//             callback(null, "./public/images");
//         },
//         filename: function (req, file, callback) {
//             callback(null, Date.now() + file.originalname);
//         }
//     }),
//     limits: {
//         fileSize: 1024 * 1024 // 1MB
//     }
// });




//     upload.single("file")(req, res, function (err) {
//         if (err) {
//             next(err);
//         } else {
//             next();
//         }
//     });
// };

// module.exports.imageUpload = (req, res, next) => {
//     upload.fileFilter = (req, file, callback) => {
//         if (
//             file.mimetype !== "image/jpeg" &&
//             file.mimetype !== "image/jpg" &&
//             file.mimetype !== "image/png" &&
//             file.mimetype !== "image/gif" &&
//             file.mimetype !== "image/webp"
//         ) {
//             const error = new Error("Invalid file type.");
//             error.statusCode = 400;
//             return callback(error);
//         }
//         callback(null, true);
//     };
//     upload.single("image")(req, res, function (err) {
//         if (err) {
//             next(err);
//         } else {
//             next();
//         }
//     });
// };


const multer = require("multer");
const path = require("path");
// Multer config
module.exports.imageUpload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
            cb(new Error("Unsupported file type!"), false);
            return;
        }
        cb(null, true);
    },
}); 
module.exports.documentUpload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype !== "application/pdf" &&
            file.mimetype !== "application/msword" &&
            file.mimetype !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            cb(new Error("Unsupported file type!"), false);
            return;
        }
        cb(null, true);
    },
}); 

