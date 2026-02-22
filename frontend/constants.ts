
import { UserData } from './types';

export const DEFAULT_USER_DATA: UserData = {
  "_id": {
    "$oid": "6998a8cfcf1b460b34615c33"
  },
  "Name": "Aditya Sharma",
  "email": "aditya@example.com",
  "password": "••••••••",
  "Age": "21",
  "employement-status": "Salaried",
  "Goal": {
    "goal": "Luxury Car",
    "target-amt": 2100000,
    "target-time": 24
  },
  "financials": {
    "monthly-income": 150000,
    "monthly-expenses": 45000,
    "debt": 12000,
    "em-fund-opted": true
  },
  "investments": {
    "risk-opt": "Medium",
    "prefered-mode": "Lumpsum",
    "invest-amt": 500000
  },
  "progress": {
    "tenure": 1,
    "start_date": "2024-02-20",
    "auto-adjust": false
  },
  "onboarding": {
    "status": "completed",
    "current_step": null,
    "last_updated": "2024-02-20T18:33:53.678600"
  }
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};
