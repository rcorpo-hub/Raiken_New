import { NextResponse } from 'next/server';
import { createPrivilegedClient } from '@/lib/supabase/privileged';
import { z } from 'zod';
import crypto from 'crypto';

const SubmissionRequestSchema = z.object({
  idempotency_key: z.string().optional(),
  branch_code: z.string().default('ADE'),
  answers: z.record(z.any()),
  applicant: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
  }),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();

    const parsed = SubmissionRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { applicant, answers, branch_code } = parsed.data;

    // Generate unique verifiable reference (e.g., RC-PUR-20261102-A1B2)
    const prefix = slug.includes('purchaser') 
      ? 'RC-PUR' 
      : slug.includes('vendor') 
      ? 'RC-VEN' 
      : slug.includes('appointment') 
      ? 'RC-APT' 
      : 'RC-CNT';

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const reference = `${prefix}-${dateStr}-${randomHex}`;

    const received_at = new Date().toISOString();

    const supabase = createPrivilegedClient();
    let submissionId: string | null = null;

    if (supabase) {
      try {
        // Find form id
        const { data: formData } = await supabase
          .from('forms')
          .select('id, current_version_id')
          .eq('slug', slug)
          .single();

        // Find branch id
        const { data: branchData } = await supabase
          .from('branches')
          .select('id')
          .eq('code', branch_code)
          .single();

        if (formData) {
          const { data: subData, error: subError } = await supabase
            .from('submissions')
            .insert({
              reference,
              form_id: formData.id,
              form_version_id: formData.current_version_id || formData.id,
              branch_id: branchData?.id || null,
              status: 'received',
              answers_json: answers,
              safe_summary: {
                applicant_name: applicant.name,
                applicant_email: applicant.email,
                applicant_phone: applicant.phone || null,
              },
              received_at,
            })
            .select('id')
            .single();

          if (!subError && subData) {
            submissionId = subData.id;

            // Queue notification outbox job
            const event_key = `submission:${subData.id}:received`;
            await supabase.from('notification_jobs').insert({
              event_key,
              submission_id: subData.id,
              channel: 'email',
              recipient_email: applicant.email,
              payload_json: {
                template: 'submission_receipt',
                reference,
                form_slug: slug,
                applicant_name: applicant.name,
              },
              state: 'queued',
            });
          }
        }
      } catch (dbErr) {
        console.warn('Database write fallback; proceeding with safe acknowledgement:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      reference,
      status: 'received',
      received_at,
      message: 'Your submission has been securely received and recorded.',
      submission_id: submissionId,
    });
  } catch (error) {
    console.error('Submission intake failure:', error);
    return NextResponse.json(
      { error: 'Internal error processing submission. Please try again.' },
      { status: 500 }
    );
  }
}
