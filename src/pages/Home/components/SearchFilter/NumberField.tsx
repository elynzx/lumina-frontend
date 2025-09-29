interface Props {
  title: string;
  icon: string;
  value: number | "";
  onChange: (value: number | "") => void;
  showBorder?: boolean;
}

export const NumberField = ({ title, icon, value, onChange, showBorder = true }: Props) => (
  <div className={`flex flex-col ${showBorder ? 'border-r border-gray-300 pr-6' : ''}`}>
    <h4 className="text-sm text-center text-gray-700 mb-2">{title}</h4>
    <div className="flex items-center gap-3 mb-2">
      <img src={icon} alt={title} className="w-6 h-6 text-gray-400" />
      <input
        type="number"
        min="1"
        value={value}
        onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : "")}
        className="flex-1 border-none outline-none text-sm w-full"
      />
    </div>
  </div>
);