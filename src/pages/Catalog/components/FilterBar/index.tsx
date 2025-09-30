import { useState, useEffect } from "react";
import { data } from "@/constants/data";
import { Button } from "@/components/atomic/Button";
import { IconSelect } from "@/components/atomic/IconSelect";
import { IconNumberInput } from "@/components/atomic/IconNumberInput";
import capacityIcon from "@/assets/icons/capacity_lineal.svg";
import priceIcon from "@/assets/icons/currency.svg";
import eventIcon from "@/assets/icons/event_tag.svg";


interface Props {
  onFilterChange: (filteredLocales: any[]) => void;
}

export const FilterBar = ({ onFilterChange }: Props) => {
  const [priceRange, setPriceRange] = useState("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [eventType, setEventType] = useState("");

  const priceOptions = [
    { value: "0-100", label: "S/ 0 - S/ 100" },
    { value: "100-200", label: "S/ 100 - S/ 200" },
    { value: "200-300", label: "S/ 200 - S/ 300" },
    { value: "300-500", label: "S/ 300 - S/ 500" },
    { value: "500+", label: "S/ 500+" }
  ];

  const eventTypeOptions = data.tiposEvento.map(tipo => ({
    value: tipo.nombreTipo,
    label: tipo.nombreTipo
  }));

  const applyFilters = () => {
    let filtered = [...data.locales];

    if (priceRange) {
      if (priceRange === "500+") {
        filtered = filtered.filter(local => local.precioHora >= 500);
      } else {
        const [min, max] = priceRange.split("-").map(Number);
        filtered = filtered.filter(local => 
          local.precioHora >= min && local.precioHora <= max
        );
      }
    }

    if (capacity) {
      filtered = filtered.filter(local => local.aforoMaximo >= capacity);
    }

    if (eventType) {
      const selectedEventType = data.tiposEvento.find(tipo => tipo.nombreTipo === eventType);
      if (selectedEventType) {
        const localesConTipoEvento = data.localTipoEvento
          .filter(relacion => relacion.idTipoEvento === selectedEventType.idTipoEvento)
          .map(relacion => relacion.idLocal);
        
        filtered = filtered.filter(local => localesConTipoEvento.includes(local.idLocal));
      }
    }

    onFilterChange(filtered);
  };

  const clearAllFilters = () => {
    setPriceRange("");
    setCapacity("");
    setEventType("");
    onFilterChange(data.locales);
  };

  useEffect(() => {
    applyFilters();
  }, [priceRange, capacity, eventType]);

  return (
    <div className="flex justify-end items-center gap-4 mb-8 p-4 rounded-lg">
      <Button 
        text="Ver Todo" 
        variant="primary" 
        onClick={clearAllFilters}
      />

      <IconSelect
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

      <IconSelect
        value={eventType}
        onChange={setEventType}
        icon={eventIcon}
        options={eventTypeOptions}
        placeholder="Tipo de Evento"
      />
    </div>
  );
};