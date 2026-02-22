
export interface UserData {
  _id: {
    $oid: string;
  };
  Name: string;
  email: string;
  password?: string;
  Age: string;
  "employement-status": string;
  Goal: {
    goal: string;
    "target-amt": number;
    "target-time": number;
  };
  financials: {
    "monthly-income": number;
    "monthly-expenses": number;
    debt: number;
    "em-fund-opted": boolean;
  };
  investments: {
    "risk-opt": string;
    "prefered-mode": string;
    "invest-amt": number;
  };
  progress: {
    tenure: number;
    start_date: string;
    "auto-adjust": boolean;
  };
  onboarding: {
    status: string;
    current_step: string | null;
    last_updated: string;
  };
}

export interface AIInsight {
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'info' | 'suggestion';
  category: 'Goal' | 'Tax' | 'Savings' | 'Investment' | 'Debt';
  impact: 'High' | 'Medium' | 'Low';
}
