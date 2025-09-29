interface Props {
  value: number | "";
  onChange: (value: number | "") => void;
  placeholder: string;
  icon?: string;
  min?: number;
}

export const IconNumberInput = ({ 
  value, 
  onChange, 
  placeholder, 
  icon,
  min = 1,
}: Props) => {

  return (
    <div className="relative">
      <div className="flex items-center border rounded-md bg-white border-blue text-blue focus:border-blue-600">
        {icon && (
          <img 
            src={icon} 
            alt={placeholder} 
            className="w-5 h-5 ml-3 flex-shrink-0" 
          />
        )}
        <input
          type="number"
          min={min}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : "")}
          className={`flex-1 px-3 w-36 py-2 border-none outline-none text-sm bg-transparent ${icon ? 'pl-2' : ''}`}
        />
      </div>
    </div>
  );
};