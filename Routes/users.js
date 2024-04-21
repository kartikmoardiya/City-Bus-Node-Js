const express = require('express');
const User = require('./../Models/user')
const router = express.Router();
const {jwtAuthMiddleware, generateToken} = require('./../JWT/jwt');

// POST route to add a person
router.post('/signup', async (req, res) =>{

    try{
        const data = req.body // Assuming the request body contains the User data

        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
        }

        // Create a new User document using the Mongoose model
        const newUser = new User(data);

        // Save the new user to the database
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);

        res.status(200)
        res.json({token: token});
    }catch(err)
    {
        return res.status(500)
        
    }
})

// Login Route
router.post('/login', async(req, res) => {
    try{
        // Extract aadharCardNumber and password from request body
        const {email, password} = req.body;

        // Check if Email or password is missing
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find the user by Email
        const user = await User.findOne({email: email});

        // If user does not exist or password does not match, return error
        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid Email or Password'});
        }

        // generate Token 
        const payload = {
            id: user.id,
        }
        const token = generateToken(payload);


        res.json({token})
    }catch(err){
        res.status(500);
    }
});

router.put('/profile/password', async (req, res) => {
    try {
        const email= req.body.email; // Extract the id from the token
        const { currentPassword, newPassword } = req.body; // Extract current and new passwords from request body

        // Check if currentPassword and newPassword are present in the request body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
        }

        // Find the user by userID
        const user = await User.findOne({email : email});

        // If user does not exist or password does not match, return error
        if (!user || !(await user.comparePassword(currentPassword))) {// function chhe
            return res.status(400).json({ error: 'Invalid current password' });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        res.status(200);
        return res.json({Message : "Done"})
    } catch (err) {
        console.error(err);
        res.status(500);
        return res.send("Error")
    }
});
module.exports = router;