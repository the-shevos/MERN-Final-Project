import React from "react";

const DashboardHome = () => {
  return (
    <>
      <div className="bg-white rounded-3xl p-7 shadow-xl border border-gray-400/90">
        <div className="flex items-center justify-between mb-8 relative">
          <div className="flex gap-6">
            <button className="text-gray-600 font-semibold border-b-2 border-gray-600 pb-2 transition-all">
              All Tasks
            </button>
            <button className="text-gray-500 hover:text-gray-700 pb-2 transition-all">
              Completed
            </button>
            <button className="text-gray-500 hover:text-gray-700 pb-2 transition-all">
              In Progress
            </button>
            <button className="text-gray-500 hover:text-gray-700 pb-2 transition-all">
              Pending
            </button>
          </div>
          <div className="flex justify-center items-center gap-10">
            <div className="flex items-center gap-10">
              <div className="flex flex-col items-center">
                <p className="text-4xl font-bold text-gray-800">24</p>
                <p className="text-gray-500 text-sm mt-1">Pending</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <p className="text-4xl font-bold text-gray-800">94</p>
                <p className="text-gray-500 text-sm mt-1">Done</p>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="flex flex-col items-center">
                <p className="text-4xl font-bold text-gray-800">23</p>
                <p className="text-gray-500 text-sm mt-1">Processing</p>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wide">
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Admin</th>
                <th className="py-3 px-4 font-medium">Members</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Run time</th>
                <th className="py-3 px-4 font-medium">Finish date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-t hover:bg-gray-50 transition-all">
                <td className="py-4 px-4 font-medium text-gray-700">
                  ClientOnboarding - Circle
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 flex items-center justify-center font-medium text-pink-800 text-xs shadow-sm">
                      S
                    </div>
                    <span className="text-gray-700">Samanta J.</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">3</td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    In progress
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-500">6 hours</td>
                <td className="py-4 px-4 text-gray-500">6 Mon</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-8 border border-gray-600 w-[600px]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Order Progress</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                In Progress
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                Completed
              </div>
              <div className="bg-gray-300 rounded-lg px-3 py-1 text-sm flex items-center gap-1 cursor-pointer">
                01-07 May
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-6">
            Data updates every 3 hours
          </p>
          <div className="relative h-42">
            <svg
              className="w-full h-full"
              viewBox="0 0 400 120"
              preserveAspectRatio="none"
            >
              <line x1="30" y1="0" x2="400" y2="0" stroke="#f0f0f0" />
              <line x1="30" y1="30" x2="400" y2="30" stroke="#f0f0f0" />
              <line x1="30" y1="60" x2="400" y2="60" stroke="#f0f0f0" />
              <line x1="30" y1="90" x2="400" y2="90" stroke="#f0f0f0" />
              <line x1="30" y1="120" x2="400" y2="120" stroke="#f0f0f0" />
              <text x="10" y="6" className="text-xs" fill="#9ca3af">
                40
              </text>
              <text x="10" y="35" className="text-xs" fill="#9ca3af">
                30
              </text>
              <text x="10" y="65" className="text-xs" fill="#9ca3af">
                20
              </text>
              <text x="10" y="95" className="text-xs" fill="#9ca3af">
                10
              </text>
              <text x="10" y="120" className="text-xs" fill="#9ca3af">
                0
              </text>
              <polyline
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                points="50,90 100,75 150,60 200,15 250,30 300,50 350,70"
              />
              <polyline
                fill="none"
                stroke="#1e293b"
                strokeWidth="2"
                points="50,100 100,85 150,70 200,35 250,20 300,40 350,55"
              />
              <circle cx="50" cy="90" r="4" fill="#22d3ee" />
              <circle cx="100" cy="75" r="4" fill="#22d3ee" />
              <circle cx="150" cy="60" r="4" fill="#22d3ee" />
              <circle cx="200" cy="15" r="4" fill="#22d3ee" />
              <circle cx="250" cy="30" r="4" fill="#22d3ee" />
              <circle cx="300" cy="50" r="4" fill="#22d3ee" />
              <circle cx="350" cy="70" r="4" fill="#22d3ee" />
              <rect
                x="175"
                y="-5"
                width="50"
                height="22"
                rx="6"
                fill="#1e293b"
              />
              <text
                x="200"
                y="11"
                textAnchor="middle"
                fill="white"
                fontSize="10"
              >
                117
              </text>
            </svg>
            <div className="flex justify-between px-6 mt-2 text-xs text-gray-400">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-3xl p-8 text-white relative">
          <h2 className="text-[22px] font-semibold mb-6">
            Assistance for Contact Support
          </h2>
          <div id="card-container" className="relative h-40">
            <div className="bg-white rounded-2xl p-4 text-gray-800 absolute inset-0 transition-opacity duration-700 opacity-100">
              <h3 className="font-medium mb-1">John Doe</h3>
              <p className="text-gray-500 text-sm mb-2">john@example.com</p>
              <p className="text-gray-700 text-sm">Task: Setup dashboard</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-gray-800 absolute inset-0 transition-opacity duration-700 opacity-0">
              <h3 className="font-medium mb-1">Jane Smith</h3>
              <p className="text-gray-500 text-sm mb-2">jane@example.com</p>
              <p className="text-gray-700 text-sm">Task: Update clients</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
