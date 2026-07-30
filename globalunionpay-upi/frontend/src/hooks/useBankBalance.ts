import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/store';

const BANK_API = 'http://localhost:8090/api';

export function useBankBalance() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const phone = user?.phone?.replace(/\D/g, '').slice(-10);

  const { data, refetch } = useQuery({
    queryKey: ['bankBalance', phone],
    queryFn: async () => {
      const res = await fetch(`${BANK_API}/accounts/check-phone?phone=${phone}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!phone,
    refetchInterval: 10000,
  });

  const balance       = Number(data?.balance ?? data?.initialDeposit ?? 0);
  const accountNumber = data?.accountNumber || '';
  const accountName   = data?.fullName || '';

  async function bankPay(amount: number, note: string): Promise<{ success: boolean; message: string }> {
    if (!accountNumber) return { success: false, message: 'Bank account not found.' };
    if (balance < amount) return { success: false, message: 'Insufficient bank balance.' };

    const res = await fetch(`${BANK_API}/transactions/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountNumber,
        accountHolder: accountName,
        amount,
        note,
      }),
    });

    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: ['bankBalance', phone] });
      return { success: true, message: 'Payment successful' };
    }
    const err = await res.json().catch(() => ({}));
    return { success: false, message: err.error || 'Payment failed.' };
  }

  async function bankTransfer(toPhone: string, amount: number, note: string): Promise<{ success: boolean; message: string; receiverName?: string }> {
    if (!accountNumber) return { success: false, message: 'Your bank account not found.' };
    if (balance < amount) return { success: false, message: 'Insufficient bank balance.' };

    // lookup receiver account — try multiple phone formats
    const toPhone10 = toPhone.replace(/\D/g, '').slice(-10);
    let receiver = null;
    for (const fmt of [toPhone10, `+91${toPhone10}`, `91${toPhone10}`, `0${toPhone10}`]) {
      const r = await fetch(`${BANK_API}/accounts/check-phone?phone=${fmt}`);
      if (r.ok) { receiver = await r.json(); break; }
    }
    if (!receiver) return { success: false, message: 'Receiver phone not registered in bank.' };

    const res = await fetch(`${BANK_API}/transactions/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromAccount: accountNumber,
        toAccount: receiver.accountNumber,
        amount,
        note: note || 'UPI Transfer',
      }),
    });

    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: ['bankBalance', phone] });
      return { success: true, message: 'Transfer successful', receiverName: receiver.fullName };
    }
    const err = await res.json().catch(() => ({}));
    return { success: false, message: err.error || 'Transfer failed.' };
  }

  return { balance, accountNumber, accountName, refetch, raw: data, bankPay, bankTransfer };
}
