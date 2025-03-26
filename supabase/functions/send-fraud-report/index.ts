
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FraudReportRequest {
  transactionId: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  reportedBy: string;
  reportedAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: FraudReportRequest = await req.json();
    console.log("Received fraud report request:", data);

    if (!data.reportedBy) {
      throw new Error("Missing email address (reportedBy)");
    }

    // Format amount to 2 decimal places
    const formattedAmount = data.amount.toFixed(2);
    
    // Generate the transaction reference (first 8 chars of ID)
    const transactionRef = data.transactionId.substring(0, 8);

    const emailResponse = await resend.emails.send({
      from: "FinSafe Security <security@resend.dev>",
      to: [data.reportedBy],
      subject: `Fraud Report Confirmation - Transaction ${transactionRef}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Fraud Report Confirmation</h1>
          
          <p style="font-size: 16px; line-height: 1.5;">Dear Customer,</p>
          
          <p style="font-size: 16px; line-height: 1.5;">We have received your fraud report for transaction ${transactionRef}.</p>
          
          <div style="background-color: #f8f9fa; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h2 style="font-size: 18px; margin-top: 0;">Transaction Details:</h2>
            <ul style="padding-left: 20px;">
              <li style="margin-bottom: 8px;"><strong>Merchant:</strong> ${data.merchant}</li>
              <li style="margin-bottom: 8px;"><strong>Amount:</strong> $${formattedAmount}</li>
              <li style="margin-bottom: 8px;"><strong>Date:</strong> ${data.date}</li>
              <li style="margin-bottom: 8px;"><strong>Category:</strong> ${data.category}</li>
              <li style="margin-bottom: 8px;"><strong>Description:</strong> ${data.description || 'N/A'}</li>
            </ul>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5;">Our fraud investigation team has been notified and will begin reviewing this transaction immediately. You may be contacted for additional information if needed.</p>
          
          <p style="font-size: 16px; line-height: 1.5;">If you did not report this transaction as fraudulent, please contact our customer service team immediately at 1-800-123-4567.</p>
          
          <p style="font-size: 16px; line-height: 1.5;">Thank you for your vigilance in protecting your financial security.</p>
          
          <p style="font-size: 16px; line-height: 1.5;">Sincerely,<br>The FinSafe Security Team</p>
          
          <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
            <p style="font-size: 12px; color: #777;">This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders 
      },
    });
  } catch (error: any) {
    console.error("Error in send-fraud-report function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
