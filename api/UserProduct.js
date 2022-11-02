const UserProduct = require("../models/UserProduct");

const router = require("express").Router();

//CREATE

router.post("/", async (req, res) => {
  const newUserProduct = new UserProduct(req.body);

  try {
    const savedUserProduct = await newUserProduct.save();
    res.status(200).json(savedUserProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updatedUserProduct = await UserProduct.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUserProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    await UserProduct.findByIdAndDelete(req.params.id);
    res.status(200).json("User product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER CART
router.get("/find/:userId", async (req, res) => {
  try {
    const UserProduct = await UserProduct.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get("/", async (req, res) => {
  try {
    const userProduct = await UserProduct.find();
    res.status(200).json(userProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router; 