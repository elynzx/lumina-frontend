interface TabNavigationProps {
  activeTab: 'tables' | 'chairs' | 'services';
  onTabChange: (tab: 'tables' | 'chairs' | 'services') => void;
  tableCount: number;
  chairCount: number;
  serviceCount: number;
}

export const TabNavigation = ({
  activeTab,
  onTabChange,
  tableCount,
  chairCount,
  serviceCount
}: TabNavigationProps) => {
  const tabs = [
    { id: 'tables' as const, label: 'Mesas', count: tableCount },
    { id: 'chairs' as const, label: 'Sillas', count: chairCount },
    { id: 'services' as const, label: 'Servicios Adicionales', count: serviceCount }
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === tab.id
              ? 'border-blue text-blue'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
};