
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyCenter } from 'd3-sankey';
import { UserData } from '../types';

interface SankeyChartProps {
  data: UserData;
}

const SankeyChart: React.FC<SankeyChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 160, bottom: 20, left: 10 };

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', 'auto');

    svg.selectAll('*').remove();

    const income = data.financials["monthly-income"];
    const expenses = data.financials["monthly-expenses"];
    const debt = data.financials.debt;
    const investment = data.investments["invest-amt"] / 12; // Monthly equivalent for flow
    const savings = Math.max(0, income - expenses - debt - (data.investments["invest-amt"] > 0 ? (data.investments["invest-amt"] / 60) : 0)); // Simplified monthly flow

    const sankeyData = {
      nodes: [
        { name: 'Monthly Income', category: 'source' },
        { name: 'Expenses', category: 'expense' },
        { name: 'Debt Repayment', category: 'debt' },
        { name: 'Investments', category: 'investment' },
        { name: 'Surplus Savings', category: 'savings' }
      ],
      links: [
        { source: 0, target: 1, value: expenses },
        { source: 0, target: 2, value: debt },
        { source: 0, target: 3, value: investment > 0 ? investment : 1 },
        { source: 0, target: 4, value: Math.max(1, income - expenses - debt - investment) }
      ]
    };

    const generator = sankey<any, any>()
      .nodeWidth(20)
      .nodePadding(40)
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
      .nodeAlign(sankeyCenter);

    const { nodes, links } = generator(sankeyData);

    const color = d3.scaleOrdinal()
      .domain(['source', 'expense', 'debt', 'investment', 'savings'])
      .range(['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#6366f1']);

    // Links
    svg.append('g')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('class', 'sankey-link')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d: any) => color(d.source.category) as string)
      .attr('stroke-width', (d: any) => Math.max(1, d.width));

    // Nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'sankey-node');

    node.append('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('fill', (d: any) => color(d.category) as string)
      .attr('rx', 4);

    node.append('text')
      .attr('x', (d: any) => d.x1 + 10)
      .attr('y', (d: any) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'start')
      .text((d: any) => `${d.name} (₹${d3.format(",.0f")(d.value)})`)
      .filter((d: any) => d.x0 < width / 2)
      .attr('x', (d: any) => d.x0 - 10)
      .attr('text-anchor', 'end');

  }, [data]);

  return (
    <div className="w-full overflow-x-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Cash Flow Analysis</h3>
      <svg ref={svgRef}></svg>
      <p className="text-xs text-slate-500 mt-4 italic">*Investment flow is calculated as a monthly equivalent of your total portfolio allocation.</p>
    </div>
  );
};

export default SankeyChart;
