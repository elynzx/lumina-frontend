interface Props {
  title: string;
  icon: string;
  value: string;
  onChange: (value: string) => void;
  options: { id: string; name: string }[];
  placeholder: string;
  showBorder?: boolean;
}

export const Dropdown = ({
  title,
  icon,
  value,
  onChange,
  options,
  placeholder,
  showBorder = true
}: Props) => (
  <div className={`flex flex-col ${showBorder ? 'border-r border-gray-300 pr-6' : ''}`}>
    <h4 className="text-sm text-center text-gray-700 mb-2">{title}</h4>
    <div className="flex items-center gap-3 mb-2">
      <img src={icon} alt={title} className="w-6 h-6 text-gray-400" />
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 border-none outline-none text-sm bg-transparent"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);