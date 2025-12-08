import type { LucideIcon } from 'lucide-react';

interface DetailItemProps {
  label: string;
  value: string | number;
  IconComponent?: LucideIcon;
  isBold?: boolean;
}

export const DetailItem = ({ label, value, IconComponent, isBold = false }: DetailItemProps) => {
  return IconComponent ? (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-500">{label}</p>
      <div className="flex gap-2">
        <IconComponent size={18} className="text-blue" />
        <p className={`ml-1 text-sm ${isBold ? "font-bold" : "font-medium"}`}>
          {value}
        </p>
      </div>
    </div>
  ) : (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-sm ${isBold ? "font-bold" : "font-medium"}`}>
        {value}
      </p>
    </div>
  );
};
