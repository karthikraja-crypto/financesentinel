
import { supabase } from "@/integrations/supabase/client";

export const sendFraudReportEmail = async (transactionId: string, details: any): Promise<boolean> => {
  try {
    console.log(`📧 Sending fraud report email for Transaction ${transactionId}`, details);
    
    // Call the Supabase Edge Function to send the email
    const { data, error } = await supabase.functions.invoke('send-fraud-report', {
      body: {
        transactionId,
        ...details
      }
    });
    
    if (error) {
      console.error('Error sending fraud report email:', error);
      throw new Error(error.message);
    }
    
    console.log('📧 Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Failed to send fraud report email:', error);
    throw error;
  }
};
