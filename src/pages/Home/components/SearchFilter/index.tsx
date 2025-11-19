import { useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "@/assets/icons/search_blue.svg";
import peopleIcon from "@/assets/icons/capacity_blue.svg";
import locationIcon from "@/assets/icons/location_blue.svg";
import { Dropdown } from "./Dropdown";
import { NumberField } from "./NumberField";
import { Button } from "@/components/atomic/Button";
import { useEventTypes, useDistricts } from "@/hooks/api";
import { useFilterStore } from "@/store/useFilterStore";

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

export const SearchFilter = () => {
  const navigate = useNavigate();
  const { setFilters, clearFilters } = useFilterStore();
  const [eventTypeId, setEventTypeId] = useState<string>("");
  const [districtId, setDistrictId] = useState<string>("");
  const [capacityCount, setCapacityCount] = useState<number | "">("");

  const { eventTypes, loading: eventTypesLoading } = useEventTypes();
  const { districts, loading: districtsLoading } = useDistricts();

  const eventTypeOptions = eventTypes.map(eventType => ({
    id: eventType.eventTypeId.toString(),
    name: eventType.eventTypeName
  }));
  const districtOptions = districts.map(district => ({
    id: district.districtId.toString(),
    name: district.districtName
  }));

  const calculateMaxCapacity = (minCapacity: number): number | null => {
    if (minCapacity >= 200) return null; // Sin límite superior para valores altos
    if (minCapacity >= 100) return 200;
    if (minCapacity >= 50) return 100;
    return 50; // Por defecto, rango bajo
  };

  const handleSearch = () => {
    clearFilters();

    const minCapacity = capacityCount !== "" ? Number(capacityCount) : null;
    const maxCapacity = minCapacity !== null ? calculateMaxCapacity(minCapacity) : null;

    setFilters({
      eventTypeId: eventTypeId ? Number(eventTypeId) : null,
      districtId: districtId ? Number(districtId) : null,
      minCapacity,
      maxCapacity, // Agregado para enviar el rango
      priceRange: null, // Mantener como null si no se usa
    });

    navigate("/catalogo");
    console.log("Filtros enviados:", { eventTypeId, districtId, minCapacity, maxCapacity });
  };

  const isLoading = eventTypesLoading || districtsLoading;

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg grid grid-cols-4 gap-6 max-w-4xl mx-auto">
      <Dropdown
        title={SearchFilterContent.titles.eventType}
        icon={searchIcon}
        value={eventTypeId}
        onChange={setEventTypeId}
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
        value={districtId}
        onChange={setDistrictId}
        options={districtOptions}
        placeholder={SearchFilterContent.placeholders.district}
      />

      <div className="flex flex-col justify-center items-center">
        <Button
          variant="tertiary"
          text={isLoading ? "Cargando..." : "Buscar "}
          onClick={handleSearch}
          disabled={isLoading} />
      </div>
    </div>
  );
};