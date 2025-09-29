import { useState } from "react";
import { IconSelect } from "@/components/atomic/IconSelect";
import { Input } from "@/components/atomic/Input";
import { data } from "@/constants/data";

export const SummaryForm = () => {
    const [eventType, setEventType] = useState("");
    const eventTypeOptions = data.tiposEvento.map(tipo => ({
        value: tipo.nombreTipo,
        label: tipo.nombreTipo
    }));
    
    return (
        <div className="flex flex-col gap-3">
            <IconSelect
                value={eventType}
                onChange={setEventType}
                options={eventTypeOptions}
                placeholder="Tipo de Evento"
            />
            <div className="flex gap-4">
                <Input
                    name="date"
                    placeholder="DD/MM/AA"
                    value=""
                    onChange={() => {}}
                    label="Fecha"
                    type="date"
                />
                <Input
                    name="quantity"
                    value=""
                    onChange={() => {}}
                    label="Personas (max 120)"
                />
            </div>
            <div className="flex gap-4">
                <Input
                    name="initTime"
                    value=""
                    onChange={() => {}}
                    label="Hora de inicio"
                />
                <Input
                    name="endTime"
                    value=""
                    onChange={() => {}}
                    label="Hora fin"
                />
            </div>
        </div>
    )
};