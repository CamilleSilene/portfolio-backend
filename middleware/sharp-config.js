const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const optimizeImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const fileName = req.file.filename;
  const inputPath = path.join(__dirname, "../tmp/", req.file.filename);
  //const outputPath = path.join(__dirname, "../images/", req.file.filename);
  const outputPath = path.join(
    __dirname,
    "../pictures/",
    `optimized_${fileName.split(".")[0]}.webp`
  );

  sharp.cache(false);

  sharp(inputPath)
    .toFormat("webp")
    .webp({ quality: 80 })
    .toFile(outputPath)
    .then((outputInfo) => {
      fs.unlink(inputPath, () => {
        //req.file.path = outputPath;
        req.file.filename = `optimized_${fileName.split(".")[0]}.webp`; // Mise à jour du nom de fichier
        console.log("Image convertie en webp");
        next();
      });
    })
    .catch((err) => {
      console.error("Sharp error:", err);
      return next();
    });
};
module.exports = optimizeImage;
