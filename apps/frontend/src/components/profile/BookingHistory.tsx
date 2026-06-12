import { Icon } from "@repo/ui/icon";
import { ordersData } from "../../utils/constants";
import { MdChair } from "react-icons/md";

function BookingHistory() {
  return (
    <>
      <div className="px-6 rounded-md">
        <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
        {ordersData.map((order, i) => {
          return (
            <>
              <div key={i} className="bg-white rounded-md mb-4 p-5">
                <div className="flex items-start gap-10">
                  <img
                    src={order.poster}
                    alt=""
                    className="w-30 h-40  object-cover rounded"
                  />
                  <div className="border-l border-gray-300 h-40 border-dashed"></div>
                  <div className="flex items-start justify-center w-full">
                    <div className="flex-1">
                      <p className="font-normal text-lg">{order.title}</p>
                      <p className="text-sm text-gray-500">{order.format}</p>
                      <p className="text-sm font-semibold text-gray-700 mt-2">
                        {order.datetime} - {order.cinema}
                      </p>
                      <small className="text-gray-700 mt-1">
                        Quantity: {order.quantity}
                      </small>
                      <p className="text-md font-semibold text-gray-700 mt-2">
                        <Icon
                          size={24}
                          className="inline items-center mr-2"
                          Icon={MdChair}
                        />
                        {order.seats}
                      </p>
                    </div>
                    <p>M-Ticket</p>
                  </div>
                </div>
                <div className="p-4 text-right">
                  <p className="text-sm text-gray-500">
                    Ticket: ₹{} + Convenience Fees: ₹{}
                  </p>
                  <p className="text-xl font-bold">₹{}</p>
                </div>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-8">
                <div>
                  <p className="font-semibold">Booking Date & Time</p>
                  <p>{}</p>
                </div>
                <div>
                  <p className="font-semibold">Payment Method</p>
                  <p>{}</p>
                </div>
                <div>
                  <p className="font-semibold">Booking ID</p>
                  <p>{}</p>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}

export default BookingHistory;
