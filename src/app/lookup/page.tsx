'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { findReservation } from '@/features/reservations/api';
import { normalizePhone } from '@/lib/utils';

const schema = z.object({
  user_phone: z.string().min(8, '휴대폰 번호를 입력하세요'),
  password: z.string().regex(/^\d{4}$/, '4자리 숫자 비밀번호를 입력하세요'),
});

type FormValues = z.infer<typeof schema>;

export default function LookupPage() {
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const onSubmit = async (values: FormValues) => {
    const data = await findReservation(normalizePhone(values.user_phone), values.password);
    setResults(data);
    setSearched(true);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>예약 조회</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user_phone">휴대폰 번호</Label>
              <Input id="user_phone" {...form.register('user_phone')} placeholder="010-1234-5678" />
              {form.formState.errors.user_phone && (
                <p className="text-xs text-red-500">{form.formState.errors.user_phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">4자리 비밀번호</Label>
              <Input id="password" type="password" maxLength={4} inputMode="numeric" {...form.register('password')} placeholder="****" />
              {form.formState.errors.password && (
                <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">조회하기</Button>
          </form>

          <div className="mt-6 space-y-2">
            {searched && results.length === 0 && (
              <p className="text-sm text-muted-foreground">예약 내역을 찾을 수 없습니다.</p>
            )}
            {results.map((r) => {
              const s = new Date(r.start_time);
              const e = new Date(r.end_time);
              const pad = (n: number) => String(n).padStart(2, '0');
              const label = `${s.getMonth() + 1}/${s.getDate()} ${pad(s.getHours())}:00 ~ ${pad(e.getHours())}:00`;
              return (
                <div key={r.id} className="border rounded-md p-3">
                  <div className="text-sm font-semibold">회의실: {r.room?.name}</div>
                  <div className="text-sm">일시: {label}</div>
                  <div className="text-sm">위치: {r.room?.location ?? '-'}</div>
                  <div className="text-xs text-muted-foreground">예약자: {r.user_name} · 전화: {r.user_phone}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


