import React from 'react';

export default function PrimaryButton({
  label,
  type = 'button',
  color = 'blue',
  onClick,
}) {
  const baseClasses = 'w-full px-4 py-2 mb-4 font-bold text-white rounded';

  let colorClasses = '';
  if (color === 'red') {
    colorClasses = 'bg-red-500 hover:bg-red-700';
  } else if (color === 'green') {
    colorClasses = 'bg-green-500 hover:bg-green-700';
  } else {
    colorClasses = 'bg-blue-500 hover:bg-blue-700';
  }

  return (
    <div>
      <button
        type={type}
        onClick={onClick}
        className={`${baseClasses} ${colorClasses}`}
      >
        {label}
      </button>
    </div>
  );
}
