module.exports = function uploadVideo(req, res){
    if(!req.file){
        return res.status(400).send('No files were uploaded.');
    }
    
}