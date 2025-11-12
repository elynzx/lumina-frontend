import type { LucideIcon } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  icon?: string;
  IconComponent?: LucideIcon;
  variant?: 'primary' | 'secondary';
}

export const IconChooser = ({
  value,
  onChange,
  options,
  placeholder,
  icon,
  IconComponent,
  variant = 'primary'
}: Props) => {
  const variantStyles = {
    primary: 'bg-white border-blue text-blue focus:border-blue',
    secondary: 'border-gray-300 text-gray-700 focus:border-gray-400'
  };

  return (
    <div className="relative">
      <div className={`flex items-center px-3 border rounded-md bg-white ${variantStyles[variant]}`}>
        {IconComponent && (
          <IconComponent
            size={20}
            className="ml-1 shrink-0 text-bgray"
          />
        )}
        {!IconComponent && icon && (
          <img
            src={icon}
            alt={placeholder}
            className="w-6 h-6 ml-3 shrink"
          />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`cursor-pointer flex-1 px-3 py-2 border-none outline-none text-sm bg-transparent ${variantStyles[variant].split(' ')[1]} ${icon ? 'pl-2' : ''}`}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};