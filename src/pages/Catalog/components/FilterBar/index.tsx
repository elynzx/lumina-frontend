import { useFilterStore } from "@/store/useFilterStore"
import { Button } from "@/components/atomic/Button";
import { IconChooser } from "@/components/atomic/IconChooser";
import capacityIcon from "@/assets/icons/capacity_lineal.svg";
import priceIcon from "@/assets/icons/currency.svg";
import eventIcon from "@/assets/icons/event_tag.svg";
import { memo, useCallback } from "react";
import type { EventType } from "@/api/interfaces";

interface Props {
  eventTypes: EventType[];
}

export const FilterBar = memo(({ eventTypes }: Props) => {
  const priceRange = useFilterStore((state) => state.priceRange);
  const minCapacity = useFilterStore((state) => state.minCapacity);
  const maxCapacity = useFilterStore((state) => state.maxCapacity);
  const eventTypeId = useFilterStore((state) => state.eventTypeId);

  const setFilters = useFilterStore((state) => state.setFilters);
  const clearFilters = useFilterStore((state) => state.clearFilters);

  const parseRange = useCallback((str: string) => {
    if (str === "any") return null;
    const [min, max] = str.split("-");
    return {
      min: Number(min),
      max: max === "inf" ? Infinity : Number(max),
    };

  }, []);

  const getRangeString = useCallback((range: { min: number; max: number } | null) => {
    if (!range) return "any";
    if (range.max === Infinity) return `${range.min}-inf`;
    return `${range.min}-${range.max}`;
  }, []);

  const priceOptions = [
    { label: "S/ 0 - 100", value: "0-100" },
    { label: "S/ 100 - 200", value: "100-200" },
    { label: "S/ 200 - 300", value: "200-300" },
    { label: "S/ 300 - 500", value: "300-500" },
    { label: "S/ 500+", value: "500-inf" },
  ];

  const capacityOptions = [
    { label: "50-100 personas", value: "50-100" },
    { label: "100-200 personas", value: "100-200" },
    { label: "200+ personas", value: "200-inf" },
  ];

  const eventTypeOptions = eventTypes.map((t) => ({
    value: t.eventTypeId.toString(),
    label: t.eventTypeName,
  }));

  const handlePriceChange = useCallback((value: string) => {
    setFilters({ priceRange: value === "any" ? null : parseRange(value) });
  }, [setFilters, parseRange]);

  const handleCapacityChange = useCallback((value: string) => {
    if (value === "any") {
      setFilters({ minCapacity: null, maxCapacity: null });
      return;
    }

    const [min, max] = value.split("-").map((v) => (v === "inf" ? null : parseInt(v, 10)));
    console.log("🔄 Actualizando capacidad mínima y máxima:", { min, max });
    setFilters({ minCapacity: min, maxCapacity: max }); // Aseguramos que ambos valores se envíen al estado global
  }, [setFilters]);

  const handleEventTypeChange = useCallback((value: string) => {
    setFilters({ eventTypeId: value ? parseInt(value, 10) : null });
  }, [setFilters]);

  return (
    <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-stretch sm:items-center gap-3 sm:gap-4 mb-8 p-4 rounded-lg">
      <Button
        text="Ver Todo"
        variant="primary"
        onClick={clearFilters}
      />

      <IconChooser
        value={getRangeString(priceRange)}
        onChange={handlePriceChange}
        icon={priceIcon}
        options={priceOptions}
        placeholder="Precio por hora"
      />

      <IconChooser
        value={minCapacity && maxCapacity ? `${minCapacity}-${maxCapacity || 'inf'}` : "any"}
        onChange={handleCapacityChange}
        icon={capacityIcon}
        options={capacityOptions}
        placeholder="Capacidad"
      />

      <IconChooser
        value={eventTypeId?.toString() || ''}
        onChange={handleEventTypeChange}
        icon={eventIcon}
        options={eventTypeOptions}
        placeholder="Tipo de Evento"
      />
    </div>
  );
});