import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
export const generateNewToken = (id) => {
    return jwt.sign({id}, 'testsecret', {expiresIn: '3d',});
}

