import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserSlash, FaUserCheck } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

type Member = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  provider: string;
  createdAt: string;
  isBlocked: boolean;
};

type FilterType = "all" | "email" | "google" | "blocked";

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 8;

  const loadMembers = async () => {
    try {
      const emailRes = await axios.get(
        "http://localhost:3000/api/v1/user/verified-users"
      );
      const emailUsers = emailRes.data.users.map((u: any) => ({
        id: u._id,
        name: u.userName,
        email: u.userEmail,
        avatar: null,
        provider: "Email & Password",
        createdAt: u.createdAt,
        isBlocked: u.isBlocked,
      }));

      const googleRes = await axios.get(
        "http://localhost:3000/api/get-google-users"
      );
      const googleUsers = googleRes.data.users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        provider: "Google",
        createdAt: u.createdAt,
        isBlocked: u.isBlocked,
      }));

      setMembers([...emailUsers, ...googleUsers]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const toggleBlockUser = (member: Member) => {
    const action = member.isBlocked ? "Unblock" : "Block";

    toast(
      (t) => (
        <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-xl shadow-lg">
          <p className="text-center">
            Are you sure you want to <strong>{action}</strong> <br />
            {member.name}?
          </p>
          <div className="flex gap-4 justify-center">
            <button
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-gray-700 font-medium"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 rounded text-white font-medium ${
                member.isBlocked
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  if (member.provider === "Email & Password") {
                    await axios.patch(
                      `http://localhost:3000/api/v1/user/${
                        member.isBlocked ? "unblock-user" : "block-user"
                      }/${member.id}`
                    );
                  } else if (member.provider === "Google") {
                    await axios.patch(
                      `http://localhost:3000/api/${
                        member.isBlocked ? "unblock" : "block"
                      }/${member.id}`
                    );
                  }
                  loadMembers();
                  toast.success(`${action}ed ${member.name} successfully!`);
                } catch (err) {
                  console.error(err);
                  toast.error("Error updating user status.");
                }
              }}
            >
              {action}
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        style: { minWidth: "300px", padding: "0", textAlign: "center" },
        position: "top-center",
      }
    );
  };

  const filteredMembers = members.filter((m) => {
    if (filter === "email") return m.provider === "Email & Password";
    if (filter === "google") return m.provider === "Google";
    if (filter === "blocked") return m.isBlocked;
    return true;
  });

  const indexOfLast = currentPage * membersPerPage;
  const indexOfFirst = indexOfLast - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-xl text-gray-500">Loading...</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 relative">
      <Toaster />
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-700">
        Registered Members
      </h1>

      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {(["all", "email", "google", "blocked"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setCurrentPage(1);
            }}
            className={`px-5 py-2 rounded-full cursor-pointer font-medium transition-all duration-200 ${
              filter === f
                ? "bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {f === "all"
              ? "All Members"
              : f === "email"
              ? "Email/Password"
              : f === "google"
              ? "Google Users"
              : "Blocked Users"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentMembers.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-3xl border border-gray-300 shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col items-center text-center relative"
          >
            {m.avatar ? (
              <img
                src={m.avatar}
                className="w-20 h-20 rounded-full mb-4 border-2 border-purple-500"
                alt={m.name}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-purple-200 mb-4 flex items-center justify-center text-purple-700 font-bold text-xl">
                {m.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}

            <h2 className="text-xl font-semibold text-gray-800">{m.name}</h2>
            <p className="text-gray-500 text-sm">{m.email}</p>
            <p className="mt-1 text-purple-600 font-medium text-sm">
              {m.provider}
            </p>
            <p className="mt-1 text-gray-400 text-xs">
              Joined: {new Date(m.createdAt).toLocaleDateString()}
            </p>

            <button
              onClick={() => toggleBlockUser(m)}
              className={`absolute top-4 right-4 text-xl transition-colors cursor-pointer ${
                m.isBlocked
                  ? "text-green-600 hover:text-green-800"
                  : "text-red-600 hover:text-red-800"
              }`}
              title={m.isBlocked ? "Unblock User" : "Block User"}
            >
              {m.isBlocked ? <FaUserCheck /> : <FaUserSlash />}
            </button>

            {m.isBlocked && (
              <span className="mt-4 text-red-600 font-semibold">Blocked</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-2 text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Members;
