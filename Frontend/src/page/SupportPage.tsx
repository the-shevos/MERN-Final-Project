import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

interface ContactCard {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const Support = () => {
  const [cardsData, setCardsData] = useState<ContactCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ContactCard[]>(
          "http://localhost:3000/api/v1/contact"
        );
        setCardsData(response.data);
      } catch {
        toast.error("Failed to load contact requests");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="ml-[220px] w-14 h-14 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );

  const handleSendReply = async (card: ContactCard) => {
    if (!replyMessage.trim()) return;

    try {
      await axios.post(
        `http://localhost:3000/api/v1/contact/reply/${card._id}`,
        { message: replyMessage }
      );

      setCardsData((prev) => prev.filter((c) => c._id !== card._id));
      setReplyMessage("");
      setReplyingToId(null);

      toast.success(`Reply sent to ${card.name}`, {
        icon: "✅",
        style: {
          marginTop: "45px",
          marginLeft: "220px",
          borderRadius: "12px",
          background: "#111827",
          color: "#fff",
        },
      });
    } catch {
      toast.error("Failed to send reply");
    }
  };

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cardsData.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(cardsData.length / cardsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6 relative">
      <Toaster />

      <h1 className="text-4xl font-bold mb-10 text-center text-purple-700 drop-shadow-md">
        Contact Support Requests
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
        {currentCards.map((card) => (
          <div
            key={card._id}
            className="bg-white rounded-3xl border border-purple-200 shadow-lg hover:shadow-2xl transition-all w-80 flex flex-col text-center transform hover:-translate-y-1"
          >
            <div className="p-8 flex flex-col flex-grow">
              <h2 className="text-2xl font-semibold text-purple-700 mb-2">
                {card.name}
              </h2>

              <p className="text-gray-600 text-sm mb-2">{card.email}</p>
              <p className="text-purple-800 font-medium text-base mb-4">
                {card.message}
              </p>

              <p className="text-gray-400 text-xs mb-4">
                Submitted: {new Date(card.createdAt).toLocaleString()}
              </p>

              {replyingToId !== card._id && (
                <button
                  className="px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg font-semibold"
                  onClick={() => setReplyingToId(card._id)}
                >
                  Reply
                </button>
              )}
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out w-full ${
                replyingToId === card._id
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-5 flex flex-col gap-3 bg-purple-50 rounded-b-3xl">
                <textarea
                  className="w-full border border-purple-200 rounded-2xl p-3 text-gray-800 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-base transition-all"
                  placeholder="Type your reply here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={5}
                />

                <div className="flex justify-end gap-3">
                  <button
                    className="px-5 py-2 w-24 bg-red-200 text-red-700 rounded-2xl hover:bg-red-300 transition-colors shadow-sm hover:shadow-md font-medium"
                    onClick={() => {
                      setReplyingToId(null);
                      setReplyMessage("");
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    className="px-5 py-2 w-28 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors shadow-sm hover:shadow-md font-medium"
                    onClick={() => handleSendReply(card)}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12 gap-4 items-center">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-5 py-2 rounded-xl font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:bg-purple-50 disabled:text-purple-300 disabled:cursor-not-allowed shadow-sm"
        >
          Previous
        </button>

        <span className="px-3 py-2 text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-5 py-2 rounded-xl font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:bg-purple-50 disabled:text-purple-300 disabled:cursor-not-allowed shadow-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Support;
