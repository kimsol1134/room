"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import type { MeetingRoom, Reservation } from "../api";

type Props = {
  room: MeetingRoom;
  dateISO: string;
  reservations: Reservation[];
};

const HOURS = Array.from({ length: 10 }, (_, i) => 9 + i); // 09:00 - 18:00

export function RoomTimeline({ room, dateISO, reservations }: Props) {
  const router = useRouter();
  const date = new Date(dateISO);

  function isBooked(hour: number): Reservation | undefined {
    const start = new Date(date);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    return reservations.find(
      (r) =>
        r.room_id === room.id &&
        new Date(r.start_time) < end &&
        new Date(r.end_time) > start
    );
  }

  function handleClick(hour: number) {
    const start = new Date(date);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);
    router.push(
      `/reserve?room_id=${room.id}&start=${encodeURIComponent(
        start.toISOString()
      )}&end=${encodeURIComponent(end.toISOString())}`
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{room.name}</CardTitle>
        <div className="text-xs text-muted-foreground">
          {room.location} · {room.capacity}명
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {HOURS.map((h) => {
            const booking = isBooked(h);
            const label = `${format(new Date().setHours(h, 0, 0, 0), "HH:mm")}`;
            return (
              <Button
                key={h}
                size="sm"
                variant={booking ? "secondary" : "default"}
                disabled={!!booking}
                onClick={() => handleClick(h)}
                className="w-full"
                title={booking ? `예약됨: ${booking.user_name}` : "예약 가능"}
              >
                {label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}


