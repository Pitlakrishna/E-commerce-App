import userModel from '../models/userModel.js';
import { hashPassward, comparePassword } from './../helpers/authHelper.js';
import orderModel from "../models/orderModel.js"
import JWT from "jsonwebtoken";

// Register

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body

        // validations

        if (!name) {
            return res.status(400).send({ message: "Name is Required" })
        }
        if (!email) {
            return res.status(400).send({ message: "email is Required" })
        }
        if (!password) {
            return res.status(400).send({ message: "password is Required" })
        }
        if (!phone) {
            return res.status(400).send({ message: "phone Number is Required" })
        }
        if (!address) {
            return res.status(400).send({ message: "address is Required" })
        }
        if (!answer) {
            return res.status(400).send({ message: "Answer is Required" })
        }

        //check User

        const existingUser = await userModel.findOne({ email })   // here key: value  are same so You can directly {email} instead of {email : email}
        //check existing user
        if (existingUser) {
            return res.status(409).send({
                success: false,
                message: "User Already Exist So Please Login",
            })
        }

        //register user
        const hashedPasword = await hashPassward(password)
        const user = await new userModel({ name, email, phone, address, password: hashedPasword, answer }).save()
        res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            user   // above object variable 
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error
        })
    }
}

// POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        //vaalidation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or passward"
            })
        }

        //check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not Found"
            })
        }

        // check password And Match compare
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid passward"
            })
        }

        // token

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).send({
            success: true,
            message: 'Login Successfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in login",
            error
        })
    }
}


//forgotPasswordController
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body
        if (!email) {
            res.status(400).send({ message: "Email is required" })
        }
        if (!answer) {
            res.status(400).send({ message: "Answer is required" })
        }
        if (!newPassword) {
            res.status(400).send({ message: "New Password is required" })
        }

        // checking Email to change or reset Password
        const user = await userModel.findOne({ email, answer })
        if (!user) {
            res.status(404).send({
                success: false,
                message: "Wrong Email Or Answer",
            });
        }

        const hashed = await hashPassward(newPassword)   // if incase after we are geting user only otherwise above condn is going follow

        await userModel.findByIdAndUpdate(user._id, { password: hashed })

        res.status(200).send({
            success: true,
            message: "Password Resst Successfully",
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Somthing Went Wrong",
            error
        })
    }
}

//test  controller
export const testController = (req, res) => {
    try {
        res.send("Protected Routes")
    } catch (error) {
        console.log(error)
        res.send({ error })
    }
}



//Update Profile
export const updateProfileController = async (req, res) => {

    try {
        const { name, email, password, address, phone } = req.body
        const user = await userModel.findById(req.user._id)

        //Password
        if (password && password.length < 6) {
            return res.json({ error: 'Password is required and 6 character long' })
        }

        const hashedPasword = password ? await hashPassward(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPasword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
        }, { new: true })
        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error While Update Profile",
            error,
        })
    }
};

//orders
export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name")
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error While Geting Orders",
            error
        })
    }
}

//All orders
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({}).populate("products", "-photo").populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
}

//order Status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Updatind Orders",
            error,
        });
    }
}