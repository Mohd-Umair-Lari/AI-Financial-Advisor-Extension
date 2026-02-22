
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Target, 
  ShieldCheck, 
  AlertCircle, 
  ArrowUpRight,
  Info,
  Sparkles,
  Lightbulb,
  ArrowRight,
  Zap
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from 'recharts';
import { UserData, AIInsight } from '../types';
import { formatCurrency } from '../constants';
import { getFinancialInsights } from '../services/geminiService';
import SankeyChart from './SankeyChart';

interface FinancialReportProps {
  data: UserData;
}

const FinancialReport: React.FC<FinancialReportProps> = ({ data }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const result = await getFinancialInsights(data);
      setInsights(result);
      setLoadingInsights(false);
    };
    fetchInsights();
  }, [data]);

  const income = data.financials["monthly-income"];
  const expenses = data.financials["monthly-expenses"];
  const debt = data.financials.debt;
  const surplus = Math.max(0, income - expenses - debt);

  const cashFlowData = [
    { name: 'Living Expenses', value: expenses, color: '#f43f5e' },
    { name: 'Debt Repayment', value: debt, color: '#f59e0b' },
    { name: 'Investable Surplus', value: surplus, color: '#10b981' },
  ];

  const goalProgress = (data.investments["invest-amt"] / data.Goal["target-amt"]) * 100;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="text-indigo-600" size={24} />
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI-Financial Advisor</h1>
          </div>
          <p className="text-slate-500 font-medium">Personalized Wealth Strategy for {data.Name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</span>
            <span className="text-xs font-semibold text-slate-600">{new Date(data.onboarding.last_updated).toLocaleDateString()}</span>
          </div>
          <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-indigo-200 flex items-center gap-2">
            <ShieldCheck size={18} />
            <span className="font-bold text-sm">Verified Profile</span>
          </div>
        </div>
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Monthly Income" 
          value={formatCurrency(income)} 
          icon={<Wallet className="text-blue-600" />}
          trend="+4.8%"
        />
        <MetricCard 
          title="Total Portfolio" 
          value={formatCurrency(data.investments["invest-amt"])} 
          icon={<TrendingUp className="text-emerald-600" />}
          trend={data.investments["risk-opt"]}
        />
        <MetricCard 
          title="Goal Target" 
          value={formatCurrency(data.Goal["target-amt"])} 
          icon={<Target className="text-purple-600" />}
          subtitle={data.Goal.goal}
        />
        <MetricCard 
          title="Monthly Debt" 
          value={formatCurrency(debt)} 
          icon={<AlertCircle className="text-rose-600" />}
          trend="Active"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visualizations */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Cash Flow Pie Chart Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Zap size={18} className="text-amber-500" />
                Monthly Cash Flow
              </h3>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cashFlowData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {cashFlowData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-around border-t border-slate-50 pt-4">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Savings Rate</p>
                  <p className="text-lg font-bold text-emerald-600">{Math.round((surplus/income)*100)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Debt Ratio</p>
                  <p className="text-lg font-bold text-amber-600">{Math.round((debt/income)*100)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Goal Progress: {data.Goal.goal}</h3>
              <div className="flex-1 flex flex-col justify-center">
                <div className="relative pt-1 mb-8">
                  <div className="flex mb-4 items-center justify-between">
                    <span className="text-xs font-bold inline-block py-1 px-3 uppercase rounded-full text-indigo-600 bg-indigo-50">
                      {Math.round(goalProgress)}% Complete
                    </span>
                    <span className="text-sm font-bold text-slate-400">
                      {formatCurrency(data.Goal["target-amt"])}
                    </span>
                  </div>
                  <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-slate-100">
                    <div 
                      style={{ width: `${Math.min(100, goalProgress)}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-1000"
                    ></div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    At your current investment rate, you are <span className="font-bold text-indigo-600">on track</span> to reach this goal in <span className="font-bold">{data.Goal["target-time"]} months</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sankey Diagram - Secondary Visual */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Flow Analysis (Sankey)</h3>
              <span className="text-xs font-medium text-slate-400">Visualizing Income Distribution</span>
            </div>
            <SankeyChart data={data} />
          </div>
        </div>

        {/* Right Column: AI Advisor Insights */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"></div>
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="p-3 bg-indigo-500/20 rounded-2xl">
                <Lightbulb className="text-indigo-400" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">AI Advisor</h3>
                <p className="text-xs text-slate-400 font-medium">Smart Suggestions & Insights</p>
              </div>
            </div>
            
            {loadingInsights ? (
              <div className="space-y-4 animate-pulse relative z-10">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-28 bg-slate-800/50 rounded-2xl"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 relative z-10">
                {insights.map((insight, idx) => (
                  <div key={idx} className={`group p-5 rounded-2xl border transition-all hover:bg-slate-800/50 ${
                    insight.type === 'positive' ? 'bg-emerald-500/5 border-emerald-500/10' :
                    insight.type === 'warning' ? 'bg-rose-500/5 border-rose-500/10' :
                    insight.type === 'suggestion' ? 'bg-indigo-500/5 border-indigo-500/10' :
                    'bg-blue-500/5 border-blue-500/10'
                  }`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-md ${
                        insight.type === 'positive' ? 'bg-emerald-500/20 text-emerald-400' :
                        insight.type === 'warning' ? 'bg-rose-500/20 text-rose-400' :
                        insight.type === 'suggestion' ? 'bg-indigo-500/20 text-indigo-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {insight.category}
                      </span>
                      <span className={`text-[10px] font-bold ${
                        insight.impact === 'High' ? 'text-rose-400' : 'text-slate-500'
                      }`}>
                        {insight.impact} Impact
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{insight.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{insight.description}</p>
                  </div>
                ))}
              </div>
            )}

            <button className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 relative z-10">
              <Sparkles size={18} />
              Download Full Strategy PDF
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ArrowRight size={16} className="text-indigo-600" />
              Recommended Actions
            </h3>
            <div className="space-y-3">
              <ActionItem label="Increase SIP by 10%" sub="Beat inflation annually" />
              <ActionItem label="Review Term Insurance" sub="Current cover: ₹0" />
              <ActionItem label="Tax Filing (FY 24-25)" sub="Due in 4 months" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend?: string; subtitle?: string }> = ({ title, value, icon, trend, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">{icon}</div>
      {trend && <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-wider">{trend}</span>}
    </div>
    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
    <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</div>
    {subtitle && <p className="text-xs text-slate-500 mt-2 font-semibold flex items-center gap-1">
      <Info size={12} /> {subtitle}
    </p>}
  </div>
);

const ActionItem: React.FC<{ label: string; sub: string }> = ({ label, sub }) => (
  <div className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 cursor-pointer transition-all group">
    <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">{label}</p>
    <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
  </div>
);

export default FinancialReport;
