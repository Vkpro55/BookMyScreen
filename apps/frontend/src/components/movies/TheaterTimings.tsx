import dayjs from "dayjs";
import { useState } from "react";
import { theatres } from "../../utils/constants";

function TheaterTimings() {
    const today = dayjs();
    const [selectedData, setSelectedDate] = useState(today);
    // const formattedDate = selectedData.format("DD-MM-YY");

    const next7days = Array.from({ length: 7 }, (_, i) => today.add(i, "day"));
    return (
        <>
            <hr className="my-2 border-gray-200" />
            <div className="flex items-center gap-2 mb-4 py-4 px-2 overflow-x-auto">
                {next7days.map((date, index) => {
                    const isSelected = selectedData.isSame(date, "day");
                    return (
                        <button
                            key={index}
                            onClick={() => setSelectedDate(date)}
                            className={`flex flex-col cursor-pointer border border-gray-200 items-center px-3 py-2 rounded-lg min-w-[50px] ${isSelected ? "bg-black text-white font-semibold" : "text-black hover:bg-gray-100"}`}
                        >
                            <span className="text-sm font-black">{date.format("D")}</span>
                            <span className="text-xs">{date.format("ddd")}</span>
                            <span className="text-[10px]"> {date.format("MMM")}</span>
                        </button>
                    );
                })}
            </div>

            {/* Theater */}
            <div className="px-4 mb-10 space-y-8">
                {theatres.map((theatre, index) => {
                    return <>
                        <div key={index} className="flex items-start gap-3 mb-2">
                            <img src={theatre.img} alt={theatre.name} className="w-8 h-8 object-contain" />
                            <div>
                                <p className="text-lg font-semibold">{theatre.name}</p>
                                <p className="text-sm text-gray-500">{theatre.cancellation}</p>
                            </div>
                        </div>

                        {/* Timings */}
                        <div className="flex flex-wrap gap-3 ml-11">
                            {theatre.timings.map((slot, index) => {
                                return (
                                    <button
                                        key={index} className="border cursor-pointer hover:bg-gray-100 border-gray-300 rounded-[16px] px-12 py-2 text-sm flex flex-col items-center justify-center">
                                        <span className="leading-tight font-semibold">{slot.time}</span>
                                        <span className="text-[10px] text-gray-500 font-black">{slot.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </>
                })}
            </div>
        </>
    );
}

export default TheaterTimings;
