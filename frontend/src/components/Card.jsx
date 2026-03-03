import React from "react";

const Card = ({ emoji, title, description }) => {
  return (
    <>
      <div>
        <div className="bg-gradient-to-br from-green-50 to white  border-green-100 rounded-2xl shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">
            {emoji}
          </h2>
          <h3 className="text-lg font-bold text-green-900 mb-3">{title}</h3>
          <p className="text-green-700 text-sm leading-relaxed max-w-xs mx-auto mb-4">
            {description}
          </p>
        </div>
      </div>
    </>
  );
};

export default Card;
