import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { data } from "@/constants/data";
import searchIcon from "@/assets/icons/search_blue.svg";
import peopleIcon from "@/assets/icons/capacity_blue.svg";
import locationIcon from "@/assets/icons/location_blue.svg";
import { Button } from "@/components/atomic/Button";

const SearchFilterContent = {
  titles: {
    eventType: "Tipo de evento",
    guestCount: "Total de invitados",
    district: "Distrito"
  },
  placeholders: {
    eventType: "Seleccionar",
    district: "Seleccionar"
  }
};

interface DropdownProps {
  title: string;
  icon: string;
  value: string;
  onChange: (value: string) => void;
  options: { id: number; name: string }[];
  placeholder: string;
  showBorder?: boolean;
}

const Dropdown = ({
  title,
  icon,
  value,
  onChange,
  options,
  placeholder,
  showBorder = true
}: DropdownProps) => (
  <div className={`flex flex-col ${showBorder ? 'border-r border-gray-300 pr-6' : ''}`}>
    <h4 className="text-sm text-center text-gray-700 mb-2">{title}</h4>
    <div className="flex items-center gap-3 mb-2">
      <img src={icon} alt={title} className="w-6 h-6 text-gray-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 border-none outline-none text-sm bg-transparent"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

interface NumberFieldProps {
  title: string;
  icon: string;
  value: number | "";
  onChange: (value: number | "") => void;
  showBorder?: boolean;
}

const NumberField = ({ title, icon, value, onChange, showBorder = true }: NumberFieldProps) => (
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

export const SearchFilter = () => {
  const navigate = useNavigate();
  const [eventType, setEventType] = useState("");
  const [capacityCount, setCapacityCount] = useState<number | "">("");
  const [district, setDistrict] = useState("");

  const eventTypeOptions = data.tiposEvento.map(tipo => ({
    id: tipo.idTipoEvento,
    name: tipo.nombreTipo
  }));

  const districtOptions = data.distritos.map(distrito => ({
    id: distrito.idDistrito,
    name: distrito.nombreDistrito
  }));

  const filterVenues = () => {
    let filteredVenues = [...data.locales];

    if (eventType) {
      const selectedEventType = data.tiposEvento.find(tipo => tipo.nombreTipo === eventType);
      if (selectedEventType) {
        const EventTypeVenues = data.localTipoEvento
          .filter(relacion => relacion.idTipoEvento === selectedEventType.idTipoEvento)
          .map(relacion => relacion.idLocal);

        filteredVenues = filteredVenues.filter(local =>
          EventTypeVenues.includes(local.idLocal)
        );
      }
    }

    if (capacityCount) {
      filteredVenues = filteredVenues.filter(local =>
        local.aforoMaximo >= capacityCount
      );
    }

    if (district) {
      const selectedDistrict = data.distritos.find(d => d.nombreDistrito === district);
      if (selectedDistrict) {
        filteredVenues = filteredVenues.filter(local =>
          local.idDistrito === selectedDistrict.idDistrito
        );
      }
    }

    return filteredVenues;
  };

  
  const handleSearch = () => {
    const filteredResults = filterVenues();

    const searchParams = new URLSearchParams();

    if (eventType) searchParams.set('tipoEvento', eventType);
    if (capacityCount) searchParams.set('aforo', capacityCount.toString());
    if (district) searchParams.set('distrito', district);

    // Agregar IDs de locales filtrados
    const localIds = filteredResults.map(local => local.idLocal).join(',');
    if (localIds) searchParams.set('locales', localIds);

    console.log(`Encontrados ${filteredResults.length} locales que coinciden con los filtros`);

    // Navegar a catálogo con parámetros
    navigate(`/catalogo?${searchParams.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg grid grid-cols-4 gap-6 max-w-4xl mx-auto">
      <Dropdown
        title={SearchFilterContent.titles.eventType}
        icon={searchIcon}
        value={eventType}
        onChange={setEventType}
        options={eventTypeOptions}
        placeholder={SearchFilterContent.placeholders.eventType}
      />

      <NumberField
        title={SearchFilterContent.titles.guestCount}
        icon={peopleIcon}
        value={capacityCount}
        onChange={setCapacityCount}
      />

      <Dropdown
        title={SearchFilterContent.titles.district}
        icon={locationIcon}
        value={district}
        onChange={setDistrict}
        options={districtOptions}
        placeholder={SearchFilterContent.placeholders.district}
      />

      <div className="flex flex-col justify-center items-center">
        <Button variant="tertiary" text="Buscar" onClick={handleSearch} />
      </div>
    </div>
  );
};





/* export const SearchFilter = () => {
  const [eventType, setEventType] = useState("");
  const [guestCount, setGuestCount] = useState<number | "">("");
  const [district, setDistrict] = useState("");

  const eventTypeOptions = data.tiposEvento.map(tipo => ({
    id: tipo.idTipoEvento,
    name: tipo.nombreTipo
  }));

  const districtOptions = data.distritos.map(distrito => ({
    id: distrito.idDistrito,
    name: distrito.nombreDistrito
  }));

  const handleSearch = () => {
    const searchParams = {
      eventType: eventType.trim(),
      guestCount: guestCount || null,
      district
    };

    console.log("Buscar con filtros:", searchParams);
    // lógica de navegación a Catálogo con filtros
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg grid grid-cols-4 gap-6 max-w-4xl mx-auto">
      <Dropdown
        title={SearchFilterContent.titles.eventType}
        icon={searchIcon}
        value={eventType}
        onChange={setEventType}
        options={eventTypeOptions}
        placeholder={SearchFilterContent.placeholders.eventType}
      />

      <NumberField
        title={SearchFilterContent.titles.guestCount}
        icon={peopleIcon}
        value={guestCount}
        onChange={setGuestCount}
      />

      <Dropdown
        title={SearchFilterContent.titles.district}
        icon={locationIcon}
        value={district}
        onChange={setDistrict}
        options={districtOptions}
        placeholder={SearchFilterContent.placeholders.district}
      />

      <div className="flex flex-col justify-center items-center">
        <Button variant="tertiary" text="Buscar" onClick={handleSearch} />
      </div>
    </div>
  );
}; */