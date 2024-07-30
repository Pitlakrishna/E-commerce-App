import slugify from "slugify"
import CategeryModel from "../models/CategeryModel.js"

export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body

        // check name Valid or not

        if (!name) {
            return res.status(401).send({ message: "Name is Required" })
        }

        // Check Exsisting Category 

        const existingCategory = await CategeryModel.findOne({ name })
        if (existingCategory) {
            res.status(200).send({
                success: true,
                message: "Category Already Exists"
            })
        }

        // Creating Categary

        const category = await new CategeryModel({ name, slug: slugify(name) }).save()
        res.status(201).send({
            success: true,
            message: "Category Successfully Created",
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in catagory creating",
            error,
        })
    }
}

//Update Category

export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body
        const { id } = req.params
        const catagory = await CategeryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })  // In the curly brackets whatever we want to update that only we have enter AND here NAME & SLUG will Update and also we are passing extra one Object we need that to Update i.e {new:true}
        res.status(200).send({
            success: true,
            message: "Category Updated Successfully",
            catagory
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while Updating Category",
            error
        })
    }
}

//Get All Categories

export const categoryController = async (req, res) => {
    try {
        const categories = await CategeryModel.find({})
        res.status(200).send({
            success: true,
            message: "Successfully Getting all Categories",
            categories
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error While getting all categories"
        })
    }
}

//Get SIngle Categgories based on Slug or You can also set to :id your wish

export const singleCategoryController = async (req, res) => {
    try {
        // const { slug } = req.params   // No need take from  request.params you can also take slug directly mean you can directly destructure
        const singleCatagory = await CategeryModel.findOne({ slug: req.params.slug })
        res.status(200).send({
            success: true,
            message: "Successfully getting Single Item",
            singleCatagory,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error While getting single categorie"
        })
    }
}

// Delete category

export const deleteCatoagaryController = async (req, res) => {
    try {
        const { id } = req.params
        await CategeryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: "Category Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Category Delete",
            error
        })
    }
}