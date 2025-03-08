
// This is a mock email service
// In a real application, this would connect to a backend API

export const sendFraudReportEmail = (transactionId: string, details: any): Promise<boolean> => {
  console.log(`📧 Email sent: Fraud Report for Transaction ${transactionId}`, details);
  
  // In a real application, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};
