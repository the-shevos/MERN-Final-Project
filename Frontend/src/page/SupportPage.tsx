import React, { useEffect, useState } from "react";
import axios from "axios";

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
      } catch (error) {
        console.error("Error fetching contact requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-white mt-10 text-xl">
        Loading contact requests...
      </div>
    );
  }

  const handleSendReply = async (card: ContactCard) => {
    if (!replyMessage.trim()) return;
    try {
      await axios.post(
        `http://localhost:3000/api/v1/contact/reply/${card._id}`,
        { message: replyMessage }
      );
      setCardsData((prev) => prev.filter((c) => c._id !== card._id));
      alert(`Reply sent to ${card.name}`);
      setReplyMessage("");
      setReplyingToId(null);
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Failed to send reply");
    }
  };

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cardsData.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(cardsData.length / cardsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-700">
        Contact Support Requests
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
        {currentCards.map((card) => (
          <div
            key={card._id}
            className="bg-white rounded-3xl border border-gray-300 shadow-md hover:shadow-xl transition-shadow w-80 flex flex-col text-center"
          >
            <div className="p-8 flex flex-col flex-grow">
              <h2 className="text-3xl font-semibold text-purple-600 mb-2">
                {card.name}
              </h2>

              <p className="text-gray-600 text-base mb-2">{card.email}</p>
              <p className="text-gray-700 text-base mb-4">{card.message}</p>

              <p className="text-gray-400 text-sm mb-4">
                Submitted: {new Date(card.createdAt).toLocaleString()}
              </p>

              {replyingToId !== card._id && (
                <button
                  className="px-5 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
                  onClick={() => setReplyingToId(card._id)}
                >
                  Reply
                </button>
              )}
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out w-full ${
                replyingToId === card._id
                  ? "max-h-[500px] opacity-100 mt-0"
                  : "max-h-0 opacity-0 mt-0"
              }`}
            >
              <div className="p-4 flex flex-col gap-3">
                <textarea
                  className="w-full border border-gray-300 rounded-2xl p-3 text-gray-800 resize-none shadow-sm focus:outline-none focus:border-2 focus:border-purple-500 text-base transition-all"
                  placeholder="Type your reply here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={5}
                />

                <div className="flex justify-end gap-3">
                  <button
                    className="px-5 py-2 w-24 bg-red-300/60 text-red-700 rounded-2xl hover:bg-red-300 transition-colors shadow-sm hover:shadow-md"
                    onClick={() => {
                      setReplyingToId(null);
                      setReplyMessage("");
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    className="px-5 py-2 w-28 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
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

      <div className="flex justify-center mt-10 gap-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-3 py-2 text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Support;
