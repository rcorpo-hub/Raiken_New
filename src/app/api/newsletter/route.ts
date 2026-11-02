import { NextResponse } from 'next/server';
import { createPrivilegedClient } from '@/lib/supabase/privileged';
import { z } from 'zod';

const NewsletterSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = NewsletterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const { email } = result.data;
    const normalised_email = email.trim().toLowerCase();

    const supabase = createPrivilegedClient();
    if (supabase) {
      await supabase
        .from('newsletter_subscriptions')
        .upsert(
          { email, normalised_email, status: 'subscribed', source: 'website' },
          { onConflict: 'normalised_email' }
        );
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
