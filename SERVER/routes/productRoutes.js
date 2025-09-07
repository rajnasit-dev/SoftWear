const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

//@route POST /api/products
//@desc Create a new product
//@access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      desc,
      price,
      discount,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = new Product({
      name,
      desc,
      price,
      discount,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id, // Reference to the admin user who created the product
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});


//@route PUT /api/products/:id
//@desc Update a product
//@access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      desc,
      price,
      discount,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.desc = desc || product.desc;
      product.price = price || product.price;
      product.discount = discount || product.discount;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;

      //Save updated product
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route DELETE /api/products/:id
//@desc Delete a product
//@access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    //Find product by id
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route GET /api/products
//@desc Get all products with optional filtering
//@access Public
router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};

    //Filter Logic
    if (collection && collection.toLowerCase() !== "all") {
      query.collections = collection;
    }

    if( category && category.toLowerCase() !== "all" ) {
      query.category = category;
    }

    if(material) {
      query.material = { $in: material.split(',') };
    }

    if(brand) {
      query.brand = { $in: brand.split(',') };
    }

    if(size) {
      query.sizes = { $in: size.split(',') };
    }

    if(color) {
      query.colors = { $in: [color] };
    }

    if(gender){
        query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { desc: { $regex: search, $options: "i" } }
      ];
    }

    //sorting logic
    let sort = {};
    if(sortBy){
        switch(sortBy) {
            case "priceAsc":
                sort = { price: 1 };
                break;
            case "priceDesc":
                sort = { price: -1 };
                break;
            case "popularity":
                sort = { rating: -1 };
                break;
            default:
                break;
        }
    }

    const products = await Product.find(query).sort(sort).limit(Number(limit) || 10);

    res.json(products);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/products/best-sellers
// @desc Get best-selling products
// @access Public
router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    if(bestSeller) {
      res.json(bestSeller);
    } else {
      res.status(404).json({ message: "No Best Seller found." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Serve Error" });
  }
});

// @router  GET /api/products/new-arrivals
// @desc Get new arrival products
// @access Public
router.get("/new-arrivals", async (req, res) => {
  try {
    //Fetch latest 8 products based on creation date
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    if(newArrivals) {
      res.json(newArrivals);
    }else {
      res.status(404).json({ message: "No New Arrivals found." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@router GET /api/products/:id
//@desc Get product by ID
//@access Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if(product) {
        res.json(product);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route GET /api/products/similar/:id
//@desc Get similar products based on the current product's category and gender
//@access Public
router.get("/similar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);

    if(!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    //Logic for similar products
    const similarProducts = await Product.find({
      _id: { $ne: id }, // Exclude the current product
      gender: product.gender,
      category: product.category,
    }).limit(4);

    res.json(similarProducts);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  } 
});



module.exports = router;
