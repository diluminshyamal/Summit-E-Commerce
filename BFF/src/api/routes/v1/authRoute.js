import { Router } from "express";
const router = Router();

import authService from "../../../services/authService.js";

router.post("/signup", async (req, res) => {
  const {
    username,
    password,
    email,
    phone_number,
    name,
    address,
    birthdate,
    gender,
    role,
  } = req.body;

  try {
    const data = await authService.signUp(
      username,
      password,
      email,
      phone_number,
      name,
      address,
      birthdate,
      gender,
      role
    );

    res.json({
      message: "User created.",
      data: data,
    });
  } catch (error) {
    console.log(`Error during signup for  ${error.message}`);
    res
      .status(400)
      .json({ message: "Error during signup", error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const data = await authService.signIn(username, password, res); // Note the 'res' being passed here
    res.json({
      message: "Logged In.",
      data: data,
    });
  } catch (error) {
    console.log(`Error during signin for  ${error.message}`);
    res
      .status(400)
      .json({ message: "Error during signin", error: error.message });
  }
});

export default router;
