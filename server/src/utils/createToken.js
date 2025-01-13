import jwt from 'jsonwebtoken';

const createToken = (res, user) => {
    const { _id, username, isAdmin } = user
    const token = jwt.sign({ _id, username, isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '30d' });
    console.log("created token>>",token);

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};

export default createToken;