const FieldRequired = ({ label, required, children, error, isEmpty }) => {
  const hasError = error && isEmpty;
  return (
    //make the field with higher height 
    <div>
      <label className={`block text-base font-medium mb-2 ${hasError ? 'text-[#c02b0b]' : 'text-black'}`}>
        {label}
        {required && (
          <span className="text-[#c02b0b] font-bold italic ml-1">(必須)</span>
        )}
      </label>
      {children}
      {hasError && (
        <div className="mt-1 p-3 border border-[#c02b0b]">
          <p className="text-base text-blue-600">このフィールドは必須です。</p>
        </div>
      )}
    </div>
  );
};

export default FieldRequired;

