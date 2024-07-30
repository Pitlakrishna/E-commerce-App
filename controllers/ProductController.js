import slugify from "slugify";
import ProductModel from "../models/ProductModel.js"
import CategeryModel from "../models/CategeryModel.js"
import orderModel from "../models/orderModel.js"
import fs from "fs";
import braintree from "braintree";
import dotenv from 'dotenv'

dotenv.config();


//Payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } =
            req.fields;
        const { photo } = req.files;
        //alidation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = new ProductModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in crearing product",
        });
    }
}

// get all products
export const getProductController = async (req, res) => {
    try {
        const products = await ProductModel.find({})
            .populate("category")  // To get Full details of :Slug
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 })  // -photo (minus photo) is for to avoid initiatial photo , And limit is for  get limited items And sort is for { created : -1}
        // Here  SELECT & LIMIT & SORT  are filters for to get limited and ceritain set of products to Display
        res.status(200).send({
            success: true,
            Count: products.length,
            message: "Getting all products",
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in getting products",
            error: error.message,
        })
    }
}
// get single Product
export const getSingleProductController = async (req, res) => {
    try {
        const singleProduct = await ProductModel.findOne({ slug: req.params.slug }).select("-photo").populate("category")
        res.status(200).send({
            success: true,
            message: "Successfully Got the Single Product",
            singleProduct
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error While getting Single Product",
            error,
        })
    }
}

// get Photo of Product

export const productPhotoController = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid).select("photo")
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error While getting Photo of Product",
            error,
        })
    }
}

//delete Product

export const deleteProductController = async (req, res) => {
    try {
        await ProductModel.findByIdAndDelete(req.params.id).select("-photo")  //  select("-photo")  means we are diselecting the product photo                               
        res.status(200).send({
            success: true,
            message: "Deleted Successfully",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error While Deleting Product",
            error,
        })
    }
}

//Update product 

export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files

        // validation

        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" })
            case !description:
                return res.status(500).send({ error: "description is Required" })
            case !price:
                return res.status(500).send({ error: "price is Required" })
            case !category:
                return res.status(500).send({ error: "category is Required" })
            case !quantity:
                return res.status(500).send({ error: "quantity is Required" })
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: "Photo is Required and should be less then 1mb" })
        }

        const products = await ProductModel.findByIdAndUpdate(req.params.id, { ...req.fields, slug: slugify(name) }, { new: true })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error While Updated Product",
            error,
        })
    }
}

// Filter products

export const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {}
        if (checked.length > 0) args.category = checked
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }   // $gte , $lte means greater than and less than  this we have to use for range between Price
        const products = await ProductModel.find(args)
        res.status(200).send({
            success: true,
            products,
        })
    }
    catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error While Filtering products"
        })
    }
}

//product Count

export const productCountController = async (req, res) => {
    try {
        const total = await ProductModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            error,
            message: "Somthing went Wrong While Fetching...."
        })
    }
}

//product list base on page

export const productListController = async (req, res) => {
    try {
        const perPage = 3
        const page = req.params.page ? req.params.page : 1
        const products = await ProductModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            error,
            message: "Somthing went Wrong While doing Product List...."
        })
    }
}

// search Product
export const productSearchController = async (req, res) => {
    try {
        const { keyword } = req.params
        const results = await ProductModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }  // Here we are Doing Based on name , Description & also we did Case Insensitive i.e $options:"i"
            ]
        }).select("-photo")
        res.json(results)
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error in Searching Product",
            error
        })
    }
}

//related products  ( similar products  )
export const relatedProductControlller = async (req, res) => {

    try {
        const { pid, cid } = req.params
        const products = await ProductModel.find({
            category: cid,
            _id: { $ne: pid }  //  $ne  means  except showing id rest all are have to display in similar div

        })
            .select("-photo")
            .limit(3)
            .populate("category")
        res.status(200).send({
            success: true,
            products,

        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error in Getting Similar Products"
        })
    }
}

// Category wise get Product
export const productCategoryController = async (req, res) => {
    try {
        const category = await CategeryModel.findOne({ slug: req.params.slug })
        const products = await ProductModel.find({ category }).populate('category')
        res.status(200).send({
            success: true,
            category,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error in getting product"
        })
    }
}


//Payment Routes Gateway API 

//token
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(response);
            }
        })
    } catch (error) {
        console.log(error)
    }
}

//Paymet
export const brainTreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body
        let total = 0
        cart.map(i => { total += i.price })
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true,
            },
        },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save()
                    res.json({ ok: true })
                } else {
                    res.status(500).send(error)
                }
            }
        )
    } catch (error) {
        console.log(error)
    }
}