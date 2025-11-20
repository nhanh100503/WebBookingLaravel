const Error = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mb-6 p-3 bg-[#f5f5dc] border-2 border-[#b98d5d] rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-base">!</span>
        </div>
        <p className="text-[#b98d5d] font-small">{message}</p>
      </div>
    </div>
  );
};

export default Error;

