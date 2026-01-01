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

type EmailUser = {
  _id: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  isBlocked: boolean;
};

type GoogleUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
      const emailRes = await axios.get<{ users: EmailUser[] }>(
        "http://localhost:3000/api/v1/user/verified-users"
      );
      const emailUsers: Member[] = emailRes.data.users.map((u) => ({
        id: u._id,
        name: u.userName,
        email: u.userEmail,
        avatar: null,
        provider: "Email & Password",
        createdAt: u.createdAt,
        isBlocked: u.isBlocked,
      }));

      const googleRes = await axios.get<{ users: GoogleUser[] }>(
        "http://localhost:3000/api/get-google-users"
      );
      const googleUsers: Member[] = googleRes.data.users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        avatar: u.avatar || null,
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

    toast.custom(
      (t) => (
        <div
          className={`fixed inset-0 z-50 flex items-start justify-start pt-10 pl-[560px] transition-all duration-500 transform ${
            t.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[340px] text-center transform transition-transform duration-500">
            <div
              className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
                member.isBlocked ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {member.isBlocked ? (
                <FaUserCheck className="text-green-600 text-2xl" />
              ) : (
                <FaUserSlash className="text-red-600 text-2xl" />
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              {action} Confirmation
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to{" "}
              <span className="font-semibold">{action.toLowerCase()}</span>{" "}
              <br />
              <span className="font-medium text-gray-700">{member.name}</span>?
            </p>

            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  try {
                    if (member.provider === "Email & Password") {
                      await axios.patch(
                        `http://localhost:3000/api/v1/user/${
                          member.isBlocked ? "unblock-user" : "block-user"
                        }/${member.id}`
                      );
                    } else {
                      await axios.patch(
                        `http://localhost:3000/api/${
                          member.isBlocked ? "unblock" : "block"
                        }/${member.id}`
                      );
                    }

                    loadMembers();

                    setTimeout(() => {
                      toast.success(
                        `${member.name} has been ${action.toLowerCase()}ed`,
                        {
                          icon: member.isBlocked ? "✅" : "🚫",
                          style: {
                            marginTop: "45px",
                            marginLeft: "220px",
                            borderRadius: "12px",
                            background: "#111827",
                            color: "#fff",
                          },
                        }
                      );
                    }, 1000);
                  } catch {
                    toast.error("Something went wrong!");
                  }
                }}
                className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                  member.isBlocked
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {action}
              </button>
            </div>
          </div>
        </div>
      ),
      { duration: 8000 }
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
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="ml-[220px] w-14 h-14 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
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
                ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg"
                : "bg-gray-300/70 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {f === "all"
              ? "All Members"
              : f === "email"
              ? "Email & Password"
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
              <div className="w-20 h-20 rounded-full bg-purple-200 mb-4 flex items-center justify-center text-purple-700 font-bold text-3xl">
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
          className="px-4 py-2 rounded-lg font-medium bg-gray-400/50 text-purple-700 hover:bg-purple-200 disabled:bg-purple-100 disabled:text-purple-400 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="px-3 py-2 text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg font-medium bg-gray-400/50 text-purple-700 hover:bg-purple-200 disabled:bg-purple-100 disabled:text-purple-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Members;
