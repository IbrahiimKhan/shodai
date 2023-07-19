const Product = require("../models/Product");
const { errorHandler } = require("../helpers/dbErrorHandler");
const formidable = require('formidable');
const fs = require("fs");
const _ = require("lodash")
//create the product
exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  const userId = req.params.userId;
  // console.log("user id to create order",userId)
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: errorHandler(err) });
    }

    let product = new Product(fields);
    console.log("our product",product)
    //checking all fields
const {name,description,price,category,shipping,quantity}=fields
if (!name || !description || !price || !category ||!shipping || !quantity) {
    return res.status(400).json({ error:"All Fields is required" });
}
   //checking file fize
    if (files.photo.size>1000000) {
        return res.status(400).json({ error: "Image size should be less than 1mb" });
    }
    if (files.photo && files.photo.filepath) {
      fs.readFile(files.photo.filepath, (err, data) => {
        if (err) {
          return res.status(400).json({ error: 'Failed to read the file' });
        }
        product.photo.data = data;
        product.photo.contentType = files.photo.type;

        product.save()
          .then(data => {
            res.json({ message: "Product Created Successfully", product_data: data });
          })
          .catch(err => {
            res.status(400).json({ error: errorHandler(err) });
          });
      });
    } else {
      // Handle the case when no file is uploaded
      product.save()
        .then(data => {
          res.json({ message: "Product Created Successfully", product_data: data });
        })
        .catch(err => {
          res.status(400).json({ error: errorHandler(err) });
        });
    }
  });
};

//get product id

exports.findProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec()
    .then((product) => {
      if (!product) {
        return res.status(400).json({
          message: "No product found",
        });
      }
      req.product = product;
      next();
    })
    .catch((err) => {
      return res.status(500).json({
        message: `Internal server error: ${err}`,
      });
    });
};


//get single product
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate("category").exec();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.photo = undefined;
    res.status(200).json({ message:"product data fetched successfully",data:product });
  } catch (err) {
    res.status(500).json({ message: `Error retrieving product: ${err.message}` });
  }
};
//get product based on query parameter
exports.getAllProducts = (req, res) => {
  if (req.query.limit > 25) {
    res.json({ message: "Limit should be less than 25" });
    return;
  }
  let limit = req.query.limit ? parseInt(req.query.limit) : 25;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let offsetf = req.query.offset ? parseInt(req.query.offset) : 0;
  let order = req.query.order ? req.query.order : "asc";
  let search = req.query.search ? req.query.search : "";

  let query = Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .skip(offsetf);

  if (search) {
    query = query.find({ $text: { $search: search } });
  }

  query
    .exec()
    .then((products) => {
      if (!products) {
        return res.status(400).json({
          message: "No product found",
        });
      }
      return res.json({
        message: "Products fetched successfully",
        data: products,
      });
    })
    .catch((e) => {
      return res.status(500).json({
        message: `Internal server error ${e}`,
      });
    });
};
//get all product by category
exports.getProductsByCategory = (req, res) => {
  const categoryId = req.params.categoryId;

  let limit = req.query.limit ? parseInt(req.query.limit) : 25;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let order = req.query.order ? req.query.order : "asc";

  Product.find({ category: categoryId })
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec()
    .then((products) => {
      if (!products || products.length === 0) {
        return res.status(404).json({
          message: "No products found for the specified category.",
        });
      }
      return res.json({
        message: "Products fetched successfully",
        data: products,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: `Internal server error: ${error}`,
      });
    });
};

exports.getProductsByCategories = (req, res) => {
  const categoryIds = req.body.categories; // Assuming you are sending an array of category IDs in the request body

  let limit = req.query.limit ? parseInt(req.query.limit) : 25;
  let offset = req.query.offset ? parseInt(req.query.offset) : 0;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let order = req.query.order ? req.query.order : "asc";
  //console.log(categoryIds,"categoryIds")
  Product.find({ category: { $in: categoryIds } }) // Use $in operator to match multiple categories
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .skip(offset)
    .exec()
    .then((products) => {
      if (!products || products.length === 0) {
        return res.status(404).json({
          message: "No products found for the specified categories.",
        });
      }
      products.forEach((product) => {
        product.photo = undefined;

      }
      )
      return res.json({
        message: "Products fetched successfully",
        data: products,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: `Internal server error: ${error}`,
      });
    });
};

//get related products
exports.getRelatedProducts=(req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 25;
    Product.find({_id:{$ne:req.product},category:req.product.category}).limit(limit).populate("category","_id name").exec().then((products)=>{
        if (!products) {
            return res.status(400).json({
                message:"No product found"
            })
        }
        return res.json({
            message:"Products fetched successfully",
            data:products
        })
    })
    .catch((e)=>{
        return res.status(500).json({
            message:`Internal server error ${e}`
        })
    })
}
//delete a single product
exports.deleteProduct = async(req, res) => {

try {
  let product = req.product;
let responded_product= await Product.findByIdAndRemove(product._id)
 if (responded_product) {
  return res.json({message:`product: ${responded_product.name} " "id: ${responded_product._id} deleted succeffully`})
 }
} 
catch (error) {
  return res.status(500).json({error:errorHandler(error)})
}
};
// Update a single product
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: errorHandler(err) });
    }

    let product = req.product;
    product = _.extend(product, fields);

    // Checking all fields
    const { name, description, price, category, shipping, quantity } = fields;
    if (!name || !description || !price || !category || !shipping || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Checking file size
    if (files.photo && files.photo.size > 1000000) {
      return res.status(400).json({ error: "Image size should be less than 1MB" });
    }

    if (files.photo && files.photo.path) {
      fs.readFile(files.photo.path, (err, data) => {
        if (err) {
          return res.status(400).json({ error: 'Failed to read the file' });
        }
        product.photo.data = data;
        product.photo.contentType = files.photo.type;

        product.save()
          .then(data => {
            res.json({ message: "Product updated successfully", product_data: data });
          })
          .catch(err => {
            res.status(400).json({ error: errorHandler(err) });
          });
      });
    } else {
      // Handle the case when no file is uploaded
      product.save()
        .then(data => {
          res.json({ message: "Product updated successfully", product_data: data });
        })
        .catch(err => {
          res.status(400).json({ error: errorHandler(err) });
        });
    }
  });
};

//get product photo
exports.getProductPhoto=(req,res,next)=>{
  console.log("photo",req.product)
    if (req.product.photo.data) {
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}
exports.decreaseQuantity = (req, res, next) => {
  console.log(req.body,"req body to update quantity");
  let bulkOps = req.body.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { quantity: -item.quantityFront, sold: +item.quantityFront} },
      },
    };
  });

  Product.bulkWrite(bulkOps, {})
    .then((result) => {
      next();
    })
    .catch((error) => {
      return res.status(400).json({
        message: `Could not update the quantity and sold: ${error}`,
      });
    });
};
