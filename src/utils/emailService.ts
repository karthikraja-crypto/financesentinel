
// This is a mock email service
// In a real application, this would connect to a backend API

export const sendFraudReportEmail = (transactionId: string, details: any): Promise<boolean> => {
  const recipientEmail = details.reportedBy || 'user@example.com';
  
  console.log(`📧 SENDING EMAIL to ${recipientEmail}: Fraud Report for Transaction ${transactionId}`, details);
  
  // In a real application, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Log the email that would be sent
      const emailContent = `
Email Subject: Fraud Report Confirmation - Transaction ${transactionId.substring(0, 8)}
To: ${recipientEmail}
From: security@finsafe.com

Dear Customer,

We have received your fraud report for transaction ${transactionId.substring(0, 8)}.

Transaction Details:
- Merchant: ${details.merchant}
- Amount: $${details.amount.toFixed(2)}
- Date: ${details.date}
- Category: ${details.category}

Our fraud investigation team has been notified and will begin reviewing this transaction immediately. You may be contacted for additional information if needed.

If you did not report this transaction as fraudulent, please contact our customer service team immediately at 1-800-123-4567.

Thank you for your vigilance in protecting your financial security.

Sincerely,
The FinSafe Security Team
      `;
      
      console.log(`📧 EMAIL SENT SUCCESSFULLY:`);
      console.log(emailContent);
      
      // Alert the user that in a real application, an email would be sent
      alert(`In a real application, an email would be sent to ${recipientEmail}.\n\nSince this is a demo, check your browser console to see the email content.`);
      
      resolve(true);
    }, 1000);
  });
};
