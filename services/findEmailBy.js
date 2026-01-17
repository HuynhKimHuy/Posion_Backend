import User from "../models/User.js";

const FindByEmail = async (email) => {
    return await User.findOne({email}).lean()
}

export default FindByEmail