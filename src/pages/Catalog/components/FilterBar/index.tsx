import { useState, useEffect } from "react";
import { Button } from "@/components/atomic/Button";
import { IconChooser } from "@/components/atomic/IconChooser";
import { IconNumberInput } from "@/components/atomic/IconNumberInput";
import capacityIcon from "@/assets/icons/capacity_lineal.svg";
import priceIcon from "@/assets/icons/currency.svg";
import eventIcon from "@/assets/icons/event_tag.svg";
import type { EventType } from "@/api/interfaces";


interface Props {
  eventTypes: EventType[];
  onFilterChange: (params: Record<string, any>) => void;
}

export const FilterBar = ({ eventTypes }: Props) => {
  const [priceRange, setPriceRange] = useState("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [eventTypeId, setEventTypeId] = useState<number | "">("");

  const priceOptions = [
    { value: "0-100", label: "S/ 0 - S/ 100" },
    { value: "100-200", label: "S/ 100 - S/ 200" },
    { value: "200-300", label: "S/ 200 - S/ 300" },
    { value: "300-500", label: "S/ 300 - S/ 500" },
    { value: "500+", label: "S/ 500+" }
  ];

  const eventTypeOptions = eventTypes.map(tipo => ({
    value: tipo.eventTypeId,
    label: tipo.eventTypeName
  }));

  const handleFilter = () => {
    console.log('filtered')
    const params: Record<string, any> = {};
    if (priceRange) {
      if (priceRange === "500+") {
        params.minPrice = 500;
      } else {
        const [min, max] = priceRange.split("-").map(Number);
        params.minPrice = min;
        params.maxPrice = max;
      }
    }
    if (capacity) params.minCapacity = capacity;
    if (eventTypeId) params.eventTypeId = eventTypeId;
  };

  const clearAllFilters = () => {
    setPriceRange("");
    setCapacity("");
    setEventTypeId("");
  };

  useEffect(() => {
    handleFilter();
  }, [priceRange, capacity, eventTypeId]);

  return (
    <div className="flex justify-end items-center gap-4 mb-8 p-4 rounded-lg">
      <Button
        text="Ver Todo"
        variant="primary"
        onClick={clearAllFilters}
      />

      <IconChooser
        value={priceRange}
        onChange={setPriceRange}
        icon={priceIcon}
        options={priceOptions}
        placeholder="Precio por hora"
      />

      <IconNumberInput
        value={capacity}
        onChange={setCapacity}
        icon={capacityIcon}
        placeholder="Capacidad"
        min={1}
      />

      <IconChooser
        value={eventTypeId}
        onChange={setEventTypeId}
        icon={eventIcon}
        options={eventTypeOptions}
        placeholder="Tipo de Evento"
      />
    </div>
  );
};