"use client";

import { useQuery } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getReservationsByDate, getRooms } from "../api";
import { useReservationDateStore } from "../store";
import { RoomTimeline } from "./RoomTimeline";

export function ReservationStatusView() {
  const { selectedDateISO, nextDay, prevDay, today } = useReservationDateStore();

  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
    staleTime: 5 * 60 * 1000,
  });

  const { data: reservations = [], isLoading: reservationsLoading } = useQuery({
    queryKey: ["reservations", selectedDateISO],
    queryFn: () => getReservationsByDate(selectedDateISO),
  });

  const dateLabel = format(new Date(selectedDateISO), "yyyy-MM-dd (EEE)");

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">예약 현황</div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={prevDay}>이전</Button>
          <Button variant="secondary" onClick={today}>오늘</Button>
          <Button variant="secondary" onClick={nextDay}>다음</Button>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">{dateLabel}</div>
      <Separator />
      {(roomsLoading || reservationsLoading) && (
        <div className="text-sm text-muted-foreground">불러오는 중...</div>
      )}
      <div className="space-y-3">
        {rooms.map((room) => (
          <RoomTimeline
            key={room.id}
            room={room}
            dateISO={selectedDateISO}
            reservations={reservations}
          />
        ))}
      </div>
    </div>
  );
}


