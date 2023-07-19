const Category = require("../models/category")
const {errorHandler} = require("../helpers/dbErrorHandler");
const category = require("../models/category");
exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save()
      .then(data => {
        res.json({ message: "Category created successfully", data });
      })
      .catch(err => {
        res.status(400).json({ error: errorHandler(err) });
      });
  };

  exports.categoryById = async (req, res, next, id) => {
    try {
      const category = await Category.findById(id);
      if (!category) {
        return res.status(400).json({ message: "Category not found" });
      }
      req.category = category; // Set the category object on the request
      next();
    } catch (error) {
      return res.json({ error: errorHandler(error) });
    }
  };
  
  //get a  single catgory

  exports.getSingleCategory = async (req, res) => {
    try {
      const category = req.category;
      if (!category) {
        return res.status(400).json({ message: "Category not found" });
      }
      return res.json(category);
    } catch (error) {
      return res.json({ error: errorHandler(error) });
    }
  };
  // Update a category
  exports.updateCategory = async (req, res) => {
    try {
      const category = req.category; // Get the category object from the request
  console.log(category,"category")
      category.name = req.body.name; // Update the name field with the new value
  
      const updatedCategory = await category.save(); // Save the updated category
  
      res.json({ message: "Category updated successfully", data: updatedCategory });
    } catch (err) {
      console.log(err, "error is");
      res.status(400).json({ error: errorHandler(err) });
    }
  };
  
  
  exports.deleteCategory = async(req, res) => {

    try {
      let category = req.category;
    let responded_category= await Category.findByIdAndRemove(category._id)
     if (responded_category) {
      return res.json({message:`category: ${responded_category.name} " "id: ${responded_category._id} deleted succeffully`})
     }
    } 
    catch (error) {
      return res.status(500).json({error:errorHandler(error)})
    }
    };
  
  
  exports.getAllCategory= async(req,res)=>{
   try {
    const categories = await Category.find()
    if (!categories) {
      return res.status(400).json({message:"No category found"})
    }
    return res.json({message:"All categories Fetched Successfully",categories})
   } catch (error) {
      return res.json({error:errorHandler(error)})
   }
  }