import bcrypt from "bcrypt"

// In this file we will gonna do hash the password and and also compare 

export const hashPassward = async (password) => {
    try {
        const saltrounds = 10;  // You can enter password 10 time frwquently if incase your password is wrong
        const hashedPasword = await bcrypt.hash(password, saltrounds)
        return hashedPasword;
    } catch (error) {
        console.log(error)
    }
}

export const comparePassword = async (password, hashedPasword) => {
    return bcrypt.compare(password, hashedPasword)
}