"use client";

import { useRouter } from "next/navigation";

const MainPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col justify-center items-center font-gong">
      <div className="absolute top-4 right-4 flex space-x-4">
        <button
          onClick={() => router.push("/settings")}
          className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600 transition"
        >
          Settings
        </button>
        <button
          onClick={() => router.push("/fearless")}
          className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600 transition"
        >
          Fearless
        </button>
      </div>

      <div className="flex flex-col space-y-4">
        <button
          onClick={() => router.push("/start")}
          className="bg-green-500 px-6 py-3 rounded text-lg font-bold hover:bg-green-600 transition"
        >
          밴픽 시작하기
        </button>
      </div>
    </div>
  );
};

export default MainPage;