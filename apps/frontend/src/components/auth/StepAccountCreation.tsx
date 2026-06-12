import { useState } from "react";
import type { MouseEvent } from "react";

function StepAccountCreation() {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const handleActivateAccount = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-3 px-10 py-6">
      <h2 className="text-center text-lg font-semibold">
        Enter your account details
      </h2>
      <p className="text-center text-sm text-gray-500">
        If you don't have an account, we'll create one for you.
      </p>

      <div className="flex items-center border border-gray-300 rounded-md px-4 py-3">
        <input
          type="text"
          value={name}
          placeholder="Enter your full name"
          onChange={(e) => setPhone(e.target.value)}
          className="flex-grow outline-none text-base"
          required
        />
      </div>
      <div className="flex items-center border border-gray-300 rounded-md px-4 py-3">
        <input
          type="text"
          value={phone}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your phone number"
          className="flex-grow outline-none text-base"
          required
        />
      </div>

      <button
        onClick={handleActivateAccount}
        type="submit"
        className="w-full cursor-pointer text-white bg-black py-2 rounded-md text-lg hover:bg-gray-800 transition"
      >
        Create Account
      </button>

      <p className="text-[#c4c5c5] text-center m-auto text-[12px]">
        By entering your email id, you're agreeing to our{" "}
        <a href="" className="text-[#f74565]">
          Terms of Service
        </a>{" "}
        and
        <a href="" className="text-[#f74565]">
          Privacy Policy
        </a>
        . Thanks!
      </p>
    </div>
  );
}

export default StepAccountCreation;
