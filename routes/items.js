const express = require("express");
const router = express.Router();
const images = require("../helpers/images");
const {
  getAllItem,
  addItem,
  updateItem,
  deleteItem,
  getItemByid
} = require("../controllers/item");

router
  .get("/", getAllItem)
  .post("/addItems", addItem)
  .put("/updateItem/:itemId", updateItem)
  .delete("/deleteItem/:itemId", deleteItem)
  .get("/:id", getItemByid)
  .post(
    "/upload",
    images.multer.single("image"),
    images.sendUploadToGCS,
    (req, res) => {
      res.send({
        status: 200,
        message: "Your file is successfully uploaded",
        link: req.file.cloudStoragePublicUrl
      });
    }
  );

module.exports = router;
