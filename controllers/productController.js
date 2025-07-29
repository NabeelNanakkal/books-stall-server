const Product = require("../models/product");

const getProductStatus = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $match: {
          inStock: true,
          price: {
            $gte: 300,
          },
        },
      },
      {
        $group: {
          _id: "$category",
          avgPrice: {
            $avg: "$price",
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error.",
    });
  }
};

const getProductsAnalysis = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $match: {
          category: "Electronics",
        },
      },
      {
        $group:{
          _id: null,
          totalRevenue: {
            $sum: "$price",
          },
          averagePrice: {
            $avg: "$price",
          },
           maxProductPrice: {
            $max: "$price",
          },
           minProductPrice: {
            $min: "$price",
          }
        }
      },
      {
        $project:{
          _id: 0,
          totalRevenue: 1,
          averagePrice: 1,
          maxProductPrice: 1,
          minProductPrice: 1,
          priceRange: {
            $subtract:["$maxProductPrice", "$minProductPrice"]
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error.",
    });
  }
};

const insertManyProducts = async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products data must be a non-empty array.",
      });
    }

    const isValidProduct = (product) => {
      const { name, category, price, inStock, tags } = product;
      return (
        typeof name === "string" &&
        typeof category === "string" &&
        typeof price === "number" &&
        typeof inStock === "boolean" &&
        Array.isArray(tags)
      );
    };

    const invalidItems = products.filter((item) => !isValidProduct(item));
    if (invalidItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Validation failed. ${invalidItems.length} product(s) have missing or invalid fields.`,
        invalidCount: invalidItems.length,
      });
    }

    const insertedProducts = await Product.insertMany(products, {
      ordered: false, // continue even if one fails
    });

    return res.status(201).json({
      success: true,
      message: `${insertedProducts.length} product(s) uploaded successfully.`,
      data: insertedProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error.",
    });
  }
};

module.exports = { insertManyProducts, getProductStatus, getProductsAnalysis };
