import foodModel from "../models/foodModel.js";
import fs from 'fs'


//add food item

const addFood = async (req, res) => {

  let image_filename = `${req.file.filename}`;

  
  const food = new foodModel({
    name:req.body.name,
    description:req.body.description,
    price:req.body.price,
    discount: req.body.discount,
    category:req.body.category,
    image:image_filename
  })

//add food item

   try {
      await food.save();
      res.json({success:true,message:"product Added"})
    } catch(error) {
      console.log(error)
      res.json({success:false,message:"Error"})
    }
  }
   

//list food

const listFood = async (req,res) => {
  try {
    const foods = await foodModel.find({});
    res.json({success:true,data:foods})
  } catch(error) {
    console.log(error)
    res.json({success:false,message:"Error"})
  }

}

//remove food items

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`,()=>{})

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({success:true,message:"product Removed"})
  } catch(error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}
const updateFoodPrice = async (req, res) => {
  try {
    const { id, price } = req.body;
    if (!id || price === undefined) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }
    await foodModel.findByIdAndUpdate(id, { price });
    res.json({ success: true, message: "Price updated successfully." });
  } catch (error) {
    console.error("Error updating price:", error);
    res.status(500).json({ success: false, message: "Error updating price." });
  }
};

export {addFood,listFood,removeFood,updateFoodPrice}