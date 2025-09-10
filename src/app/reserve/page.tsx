'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createReservation } from '@/features/reservations/api';
import { normalizePhone } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  user_name: z.string().min(1, '이름을 입력하세요'),
  user_phone: z
    .string()
    .min(8, '휴대폰 번호를 입력하세요')
    .max(20, '번호가 너무 깁니다'),
  password: z
    .string()
    .regex(/^\d{4}$/, '4자리 숫자 비밀번호를 입력하세요'),
});

type FormValues = z.infer<typeof schema>;

export default function ReservePage() {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const roomId = Number(params.get('room_id'));
  const start = params.get('start') ?? '';
  const end = params.get('end') ?? '';

  const timeLabel = useMemo(() => {
    if (!start || !end) return '';
    const s = new Date(start);
    const e = new Date(end);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${s.getMonth() + 1}/${s.getDate()} ${pad(s.getHours())}:00 ~ ${pad(e.getHours())}:00`;
  }, [start, end]);

  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      if (!roomId || !start || !end) {
        toast({ description: '예약 정보가 올바르지 않습니다.' });
        return;
      }
      await createReservation({
        room_id: roomId,
        user_name: values.user_name,
        user_phone: normalizePhone(values.user_phone),
        password: values.password,
        start_time: start,
        end_time: end,
      });
      toast({ description: '예약이 완료되었습니다.' });
      router.push('/');
    } catch (e: any) {
      toast({ description: e?.message ?? '예약 중 오류가 발생했습니다.' });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>회의실 예약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">{timeLabel}</div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user_name">예약자명</Label>
              <Input id="user_name" {...form.register('user_name')} placeholder="홍길동" />
              {form.formState.errors.user_name && (
                <p className="text-xs text-red-500">{form.formState.errors.user_name.message}</p>
              )}
            </div>
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
            <Button type="submit" className="w-full">예약하기</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


