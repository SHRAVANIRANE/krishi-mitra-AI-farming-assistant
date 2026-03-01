import React from "react";
import { motion } from "framer-motion"; // Make sure you ran `npm install framer-motion`
import { useNavigate } from "react-router-dom";

// This component receives 'onStartSimulation' as a prop from App.jsx
const Hero = ({}) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex flex-col justify-center items-center px-4 text-center"
      style={{ backgroundImage: "url('src/assets/farm2.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-7xl font-extrabold text-green-50 mb-4">
            🌿Krishi Mitra🌿
          </h1>

          <p className="text-lg md:text-xl text-green-50 font-medium max-w-2xl mx-auto leading-relaxed mt-4">
            Your Personal Crop Care Companion.
            <br />
            Use our AI simulator to detect diseases, visualize infections, and
            calculate your cost savings.
          </p>
        </motion.header>

        <motion.div
          className="mt-10 flex gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="mt-10 flex flex-wrap gap-6 justify-center">
            {/* Start Simulation */}
            <button
              type="submit"
              onClick={() => navigate("/dashboard")}
              class="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-emerald-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-black before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
            >
              {" "}
              Get Started{" "}
              <svg
                class="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
                viewBox="0 0 16 19"
                xmlns="http://www.w3.org/2000/svg"
              >
                {" "}
                <path
                  d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                  class="fill-gray-800 group-hover:fill-gray-800"
                ></path>{" "}
              </svg>{" "}
            </button>
            {/* Get Irrigation Schedule
            <button
              type="submit"
              onClick={() => navigate("/irrigation")}
              class="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-emerald-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-black before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
            >
              {" "}
              Get Irrigation Schedule{" "}
              <svg
                class="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
                viewBox="0 0 16 19"
                xmlns="http://www.w3.org/2000/svg"
              >
                {" "}
                <path
                  d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                  class="fill-gray-800 group-hover:fill-gray-800"
                ></path>{" "}
              </svg>{" "}
            </button> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
