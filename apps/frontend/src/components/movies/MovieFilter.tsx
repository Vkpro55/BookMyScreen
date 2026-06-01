import { languages } from "../../utils/constants";

function MovieFilter() {
    return (
        <div className="w-full md:w-1/4 p-4 space-y-5">
            <h2 className="text-2xl font-semibold">Filters</h2>
            {/* Languages */}
            <div className="bg-white p-4 rounded-md w-full">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Languages</span>
                    <button className="text-red-500">Clear</button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {languages.map((lang, index) => {
                        return (
                            <span
                                key={index}
                                className="border border-gray-200 text-red-400 px-3 py-1 text-sm rounded hover:bg-gray-100 cursor-pointer"
                            >
                                {lang}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Genre */}
            <div className="bg-white p-4 rounded-md w-full">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Genres</span>
                    <button className="text-red-500">Clear</button>
                </div>
            </div>

            {/* Format */}
            <div className="bg-white p-4 rounded-md w-full">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Formats</span>
                    <button className="text-red-500">Clear</button>
                </div>
            </div>

            <button className="w-full border cursor-pointer border-red-400  text-red-500 py-1 rounded text-sm hover:bg-red-500 hover:text-white transition">
                Browse by Cinemas
            </button>
        </div>
    );
}

export default MovieFilter;
