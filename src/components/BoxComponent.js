import React from 'react';

export default function BoxComponent({ title , children }) {
  return (
    <div
      className="bg-white px-6 py-6 w-5/6 md:w-[60%] lg:w-1/4 xl:w-1/4 mx-auto rounded-lg"
    >
      <h2 className="mb-6 text-3xl font-bold text-center text-gray-800 ">
        {title}
      </h2>
      {children}
    </div>
  );
}
