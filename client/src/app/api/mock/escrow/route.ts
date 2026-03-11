import { NextResponse } from 'next/server';

type EscrowState = 'Pending' | 'Locked' | 'Released' | 'Refunded';

export interface EscrowTransaction {
  id: string;
  buyer: string;
  seller: string;
  amount: number;
  tokenType: string;
  state: EscrowState;
  createdAt: string;
}

// In-memory store for mock transactions
const transactions = new Map<string, EscrowTransaction>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    switch (action) {
      case 'DEPOSIT': {
        const id = `tx_${Math.random().toString(36).substr(2, 9)}`;
        const newTx: EscrowTransaction = {
          id,
          buyer: payload.buyer,
          seller: payload.seller,
          amount: payload.amount,
          tokenType: payload.tokenType || 'SDA',
          state: 'Pending',
          createdAt: new Date().toISOString()
        };
        transactions.set(id, newTx);
        return NextResponse.json({ success: true, transaction: newTx, event: 'EscrowCreated' });
      }

      case 'LOCK': {
        const tx = transactions.get(payload.id);
        if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        if (tx.state !== 'Pending') return NextResponse.json({ error: 'Invalid state transition' }, { status: 400 });
        
        tx.state = 'Locked';
        transactions.set(payload.id, tx);
        return NextResponse.json({ success: true, transaction: tx, event: 'EscrowLocked' });
      }

      case 'RELEASE': {
        const tx = transactions.get(payload.id);
        if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        if (tx.state !== 'Locked') return NextResponse.json({ error: 'Invalid state transition' }, { status: 400 });
        
        tx.state = 'Released';
        transactions.set(payload.id, tx);
        return NextResponse.json({ success: true, transaction: tx, event: 'EscrowReleased' });
      }

      case 'REFUND': {
        const tx = transactions.get(payload.id);
        if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        if (tx.state === 'Released' || tx.state === 'Refunded') return NextResponse.json({ error: 'Invalid state transition' }, { status: 400 });
        
        tx.state = 'Refunded';
        transactions.set(payload.id, tx);
        return NextResponse.json({ success: true, transaction: tx, event: 'EscrowRefunded' });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const tx = transactions.get(id);
    if (!tx) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(tx);
  }

  // Return all as array
  return NextResponse.json(Array.from(transactions.values()));
}
