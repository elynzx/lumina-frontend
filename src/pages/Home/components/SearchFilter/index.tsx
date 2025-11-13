import { useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "@/assets/icons/search_blue.svg";
import peopleIcon from "@/assets/icons/capacity_blue.svg";
import locationIcon from "@/assets/icons/location_blue.svg";
import { Dropdown } from "./Dropdown";
import { NumberField } from "./NumberField";
import { Button } from "@/components/atomic/Button";
import { useEventTypes, useDistricts } from "@/hooks/api";

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

  const handleEventTypeChange = (value: string) => {
    setEventTypeId(value);
  };

  const handleDistrictChange = (value: string) => {
    setDistrictId(value);
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();

    if (eventTypeId !== "" && eventTypeId !== undefined && eventTypeId !== null) {
      searchParams.set("eventTypeId", eventTypeId);
    }
    if (capacityCount !== "" && capacityCount !== undefined && capacityCount !== null) {
      searchParams.set("minCapacity", capacityCount.toString());
    }
    if (districtId !== "" && districtId !== undefined && districtId !== null) {
      searchParams.set("districtId", districtId);
    }

    navigate(`/catalogo?${searchParams.toString()}`);
    console.log("Filtros enviados:", { eventTypeId, districtId, capacityCount });
    console.log("URL generada:", `/catalogo?${searchParams.toString()}`);
  };

  const isLoading = eventTypesLoading || districtsLoading;

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg grid grid-cols-4 gap-6 max-w-4xl mx-auto">
      <Dropdown
        title={SearchFilterContent.titles.eventType}
        icon={searchIcon}
        value={eventTypeId}
        onChange={handleEventTypeChange}
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
        onChange={handleDistrictChange}
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