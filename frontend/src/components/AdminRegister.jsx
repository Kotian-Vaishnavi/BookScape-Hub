import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import getBaseUrl from "../utils/baseURL";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Submitting admin registration:", data); // Debug log

    try {
      // Ensure phone is included
      if (!data.phone) data.phone = "";

      const response = await axios.post(
        `${getBaseUrl()}/api/auth/admin/register`,
        {
          username: data.username,
          password: data.password,
          phone: data.phone,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Registration response:", response.data);

      if (response.status === 201) {
        alert("Seller registered successfully!");
        navigate("/admin"); // redirect to admin login
      }
    } catch (error) {
      console.error(
        "Error registering admin:",
        error.response?.data || error.message
      );
      setMessage(
        error.response?.data?.message || "Admin registration failed. Try again."
      );
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Register as Seller</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              {...register("username", { required: true })}
              type="text"
              id="username"
              placeholder="Seller username"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              id="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              {...register("phone", { required: true })}
              type="text"
              id="phone"
              placeholder="Seller phone number"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs italic mt-1">
                Please enter a valid phone number
              </p>
            )}
          </div>

          {message && (
            <p className="text-red-500 text-xs italic mb-3">{message}</p>
          )}

          <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none">
              Register Seller
            </button>
          </div>
        </form>

        <p className="mt-2 text-sm text-center">
          Already have a seller account?{" "}
          <span
            onClick={() => navigate("/admin")}
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
          >
            Login
          </span>
        </p>

        <p className="mt-5 text-center text-gray-500 text-xs">
          ©2025 Book Store. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
