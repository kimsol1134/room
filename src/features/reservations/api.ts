"use client";

import { createClient } from "@/lib/supabase/client";
import { normalizePhone } from "@/lib/utils";

export type MeetingRoom = {
  id: number;
  name: string;
  location: string | null;
  capacity: number;
  created_at: string;
};

export type Reservation = {
  id: number;
  room_id: number;
  user_name: string;
  user_phone: string;
  password: string;
  start_time: string; // ISO string
  end_time: string; // ISO string
  created_at: string;
};

export type CreateReservationInput = {
  room_id: number;
  user_name: string;
  user_phone: string;
  password: string;
  start_time: string; // ISO string
  end_time: string; // ISO string
};

export type ReservationLookupItem = {
  id: number;
  start_time: string;
  end_time: string;
  user_name: string;
  user_phone: string;
  room: { id: number; name: string; location: string | null; capacity: number };
};

const supabase = createClient();

export async function getRooms(): Promise<MeetingRoom[]> {
  const { data, error } = await supabase
    .from("meeting_rooms")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getReservationsByDate(dateISO: string): Promise<Reservation[]> {
  const date = new Date(dateISO);
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .gte("start_time", start.toISOString())
    .lt("start_time", end.toISOString());

  if (error) throw error;
  return data ?? [];
}

export async function createReservation(input: CreateReservationInput): Promise<Reservation> {
  // naive overlap check to prevent double booking of same hour
  const normalizedPhone = normalizePhone(input.user_phone);
  const { data: overlap, error: overlapError } = await supabase
    .from("reservations")
    .select("*")
    .eq("room_id", input.room_id)
    .lt("start_time", input.end_time)
    .gt("end_time", input.start_time)
    .limit(1);

  if (overlapError) throw overlapError;
  if (overlap && overlap.length > 0) {
    throw new Error("이미 해당 시간대에 예약이 존재합니다.");
  }

  const { data, error } = await supabase
    .from("reservations")
    .insert({
      ...input,
      user_phone: normalizedPhone,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as Reservation;
}

export async function findReservation(user_phone: string, password: string): Promise<ReservationLookupItem[]> {
  const normalizedPhone = normalizePhone(user_phone);
  const { data, error } = await supabase
    .from("reservations")
    .select(
      "id, start_time, end_time, user_name, user_phone, room:meeting_rooms(id, name, location, capacity)"
    )
    .eq("user_phone", normalizedPhone)
    .eq("password", password)
    .order("start_time", { ascending: false });

  if (error) throw error;
  return (data as unknown as ReservationLookupItem[]) ?? [];
}


