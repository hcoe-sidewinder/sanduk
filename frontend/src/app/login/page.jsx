"use client";
import { Eye, EyeClosed, Hospital } from "lucide-react";
import React, { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <section className=" h-screen w-screen p-24 px-18 mx-auto bg-accentCustom">
      <div className="flex h-full w-full bg-primaryCustom rounded-3xl">
        <div className="w-2/5 h-full p-8">
          <div className="p-3 rounded-full bg-[#efefef] w-fit h-fit">
            <Hospital className="text-secondaryCustom" />
          </div>
          <p className="mt-6 text-2xl font-lora text-white font- leading-relaxed">
            We at SUNDUK are fully are
            <br /> always fully focused on
            <br /> helping your family.
          </p>
        </div>
        <div className="w-3/5  font-lora h-full bg-white rounded-3xl px-10 pt-15 pb-10">
          <div className="w-full flex items-center justify-center">
            <span className=" text-center font-extrabold text-4xl text-black">
              LOGIN
            </span>
          </div>
          <div className="mt-15 w-full h-full">
            <div className="mx-auto w-96 h-fit">
              <div className="flex flex-col gap-2">
                <label className="font-bold">
                  Document ID:<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter document ID"
                  className="w-full p-1 px-2 rounded-lg border border-primaryCustom focus:border-secondaryCustom"
                />
              </div>
            </div>
            <div className="mx-auto mt-10 w-96 h-fit">
              <div className="flex flex-col gap-2">
                <label className="font-bold">
                  Password:<span className="text-red-600">*</span>
                </label>
                <div className=" h-fit relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full p-1 px-2 rounded-lg border border-primaryCustom focus:border-secondaryCustom"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {showPassword ? (
                      <Eye onClick={() => setShowPassword(false)} />
                    ) : (
                      <EyeClosed onClick={() => setShowPassword(true)} />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button className="mx-auto mt-10 w-96 p-2 cursor-pointer text-white bg-secondaryCustom hover:bg-secondaryCustom/90 rounded-lg text-xl font-semibold flex items-center justify-center">
              Login
            </button>
          </div>
        </div>
        <div></div>
      </div>
    </section>
  );
};

export default Login;
