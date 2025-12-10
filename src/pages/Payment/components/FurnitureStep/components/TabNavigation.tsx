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
          className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === tab.id
              ? 'border-blue text-blue'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="hidden sm:inline">{tab.label}</span>
          <span className="sm:hidden">{tab.id === 'tables' ? 'Mesas' : tab.id === 'chairs' ? 'Sillas' : 'Servicios'}</span>
          {' '}({tab.count})
        </button>
      ))}
    </div>
  );
};