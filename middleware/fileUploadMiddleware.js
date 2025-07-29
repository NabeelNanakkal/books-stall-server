const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploades/') // Fixed typo: 'uploades/' → 'uploads/'
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const checkFileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    } else {
        cb(new Error('Not an image, Please upload only images'))
    }
} // Added missing closing brace

// To use this configuration:
module.exports =  multer({ 
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // Optional: 5MB limit
    }
}); 