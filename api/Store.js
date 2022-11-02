const Product = require("../models/Store");
const router = require("express").Router();

//CREATE

router.post("/", async (req, res) => {
    const newItem = new Store(req.body);

    try {
        const savedItem = await newItem.save();
        res.status(200).json(savedItem);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id", async (req, res) => {
    try {
        const updatedItem = await Store.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedItem);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", async (req, res) => {
    try {
        await Store.findByIdAndDelete(req.params.id);
        res.status(200).json("Item has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
    try {
        const item = await Store.findById(req.params.id);
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let items;

        if (qNew) {
            items = await Store.find().sort({ createdAt: -1 }).limit(1);
        } else if (qCategory) {
            items = await Store.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            items = await Store.find();
        }

        res.status(200).json(items);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;