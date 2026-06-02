import { useState } from "react";
import { tabs } from "../utils/constants";
import { IoMdAdd } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import BookingHistory from "../components/profile/BookingHistory";

function Profile() {
    const [activeTab, setActiveTab] = useState("Your Orders");

    return (
        <>
            <div className="bg-[#e5e5e5]">
                <div className="max-w-screen-xl mx-auto flex flex-wrap gap-5 py-2 text-sm font-medium">
                    {tabs.map((tab, i) => {
                        return (
                            <button
                                onClick={() => setActiveTab(tab)}
                                key={i}
                                className={`cursor-pointer ${activeTab === tab ? "text-rose-500" : "text-gray-600 hover:text-black"}`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="min-h-screen py-10 px-4 bg-gray-100">
                <div className="max-w-6xl mx-auto">
                    {/* Profile section */}
                    {activeTab === "Profile" && (
                        <>
                            {/* Header */}
                            <div className="bg-linear-to-r from-gray-800 to-rose-500 rounded-t-md px-6 py-6 flex items-center gap-6 text-white">
                                <div className="relative w-20 h-20 rounded-full border-4 border-white flex items-center justify-center text-gray-600">
                                    <IoMdAdd size={24} />
                                </div>

                                <div className="ml-2">
                                    <h2 className="text-2xl font-bold">Hi, Vinod Kumar</h2>
                                    <small className="underline cursor-pointer">
                                        <IoIosLogOut size={20} className="inline mr-1" /> Logout
                                    </small>
                                </div>
                            </div>
                            {/* Details */}
                            <div className="bg-white px-6 py-6 rounde-b-md">
                                <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                                <div>
                                    <div className="flex justify-between items-center text-sm text-gray-800 mb-3">
                                        <p>Email Address</p>
                                        <div className="flex items-center gap-2">
                                            <p>20bch057@gmail.com</p>
                                            <span className="text-green-600 bg-green-100 text-xs rounded px-1 ">
                                                Verified
                                            </span>
                                        </div>
                                        <FiEdit className="text-rose-500 cursor-pointer" />
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-800 mb-3">
                                        <p>Mobile Number</p>
                                        <div className="flex items-center gap-2">
                                            <p>+91 7876278762</p>
                                            <span className="text-green-600 bg-green-100 text-xs rounded px-1 ">
                                                Verified
                                            </span>
                                        </div>
                                        <FiEdit className="text-rose-500 cursor-pointer" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 bg-white rounded-md p-6">
                                <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="" className="text-sm font-normal">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter your first name..."
                                            className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-1 placeholder:text-gray-500 placeholder:italic placeholder:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="" className="text-sm font-normal">
                                            Lats Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter your last name..."
                                            className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-1 placeholder:text-gray-500 placeholder:italic placeholder:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="" className="text-sm font-normal">
                                            Birthday (Optional)
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-1"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="" className="text-sm font-normal">
                                            Identity (Optional)
                                        </label>
                                        <div className="gap-2 mt-1 flex">
                                            <button
                                                className={`px-4 py-1 border border-gray-200 rounded-lg bg-white`}
                                            >
                                                Woman
                                            </button>
                                            <button
                                                className={`px-4 py-1 border border-gray-200 rounded-lg bg-white`}
                                            >
                                                Man
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="" className="text-sm font-normal">
                                            Married (Optional)
                                        </label>
                                        <div className="gap-2 mt-1 flex">
                                            <button
                                                className={`px-4 py-1 border border-gray-200 rounded-lg bg-white`}
                                            >
                                                Yes
                                            </button>
                                            <button
                                                className={`px-4 py-1 border border-gray-200 rounded-lg bg-white`}
                                            >
                                                No
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {/* Booking section */}
                    {activeTab === "Your Orders" && (
                        <BookingHistory />
                    )}
                </div>
            </div >
        </>
    );
}

export default Profile;
