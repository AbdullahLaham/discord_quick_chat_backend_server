import { cloudinaryUploadImg } from "../utils/cloudinary.js";

export const uploadImages = async (req, res) => {
    try {
        console.log('hello');
        console.log("hello")
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        let urls = [];
        let files = req.files;
        console.log(files, 'ddddddddddd');
        for (let file of files) {
            let {path} = file;
            let newPath = await uploader(path);
            urls.push(newPath);
        }
        let images = urls.map((file) =>  file);
        console.log('imagesff44444444');

        // let findProduct = await Product.findByIdAndUpdate(id, {
        //     images: urls.map((file) =>  file.url)
        // }, {new: true});
        res.json(images);

    } catch (error) {
        res.status(500).json({ message: error.message, sucess: false },);
    }
}