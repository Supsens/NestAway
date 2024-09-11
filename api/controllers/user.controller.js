import { Listing } from "../Models/listing.model.js"
import { User } from "../Models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bycryptjs from 'bcryptjs'
export const updateUser = async (req, res, next) => {

    if (req.user !== req.params.id) return next(errorHandler(401, 'Unauthorised'))
    try {
        if (req.body.password) {
            req.body.password = bycryptjs.hashSync(req.body.password, 10)

        }
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true })

        const { password, ...rest } = updateUser._doc
        return res.status(200).json({
            success: true,
            rest
        })

    } catch (error) {
        next(error)
    }




}


export const deleteUser = async (req, res, next) => {

    if (req.user !== req.params.id) return next(errorHandler(401, 'Unauthorised'))
    try {

        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json({
            message: "User has been deleted"
        })
    } catch (error) {
        next(error)
    }

}


export const getUserListings = async (req, res, next) => {
    if (toString(req.user.id) == toString(req.params.id))
        try {
            const Listings = await Listing.find({ userRef: req.params.id })

            res.status(200).json(
                Listings)
        } catch (error) {
            next(error)
        }
    else {
        return next(errorHandler(401, 'Unauthorised'))
    }
}