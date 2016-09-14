var multer = require('multer');

exports.upload = multer({ dest: './upload/',
    rename: function (fieldname, filename) {
        return filename+Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file);
        console.log(file.fieldname + ' uploaded to  ' + file.path)
    }
});
