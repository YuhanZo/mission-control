import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const territoryNames = {
  0: 'All areas',
  1: 'Charlotte Metro',
  2: 'Lake Norman',
  3: 'South Carolina',
  4: 'Triad',
};

const demoProjects = [
  { id: 1, job_number: 24001, project_name: 'Uptown Medical Office Shades', status: 'active', total_contract: 197000, territory_id: 1, territory_name: 'Charlotte Metro', company_name: 'Brookline Builders', project_manager_name: 'Maya Johnson', install_start_date: '2026-05-20', install_end_date: '2026-06-07' },
  { id: 2, job_number: 24002, project_name: 'Crescent South Apartments', status: 'active', total_contract: 340500, territory_id: 1, territory_name: 'Charlotte Metro', company_name: 'Crescent Property Group', project_manager_name: 'Maya Johnson', install_start_date: '2026-06-03', install_end_date: '2026-07-12' },
  { id: 3, job_number: 24003, project_name: 'Lake Norman Hotel Renovation', status: 'pending', total_contract: 226750, territory_id: 2, territory_name: 'Lake Norman', company_name: 'Lakeside Hospitality Partners', project_manager_name: 'Chris Walker', install_start_date: '2026-06-17', install_end_date: '2026-07-02' },
  { id: 4, job_number: 24004, project_name: 'Palmetto Surgical Center', status: 'active', total_contract: 157300, territory_id: 3, territory_name: 'South Carolina', company_name: 'Palmetto Commercial Interiors', project_manager_name: 'Maya Johnson', install_start_date: '2026-05-28', install_end_date: '2026-06-18' },
  { id: 5, job_number: 24005, project_name: 'Riverfront Condo Unit 4B', status: 'completed', total_contract: 30000, territory_id: 1, territory_name: 'Charlotte Metro', company_name: 'Brookline Builders', project_manager_name: 'Maya Johnson', install_start_date: '2026-02-03', install_end_date: '2026-02-05', completion_date: '2026-02-12' },
  { id: 6, job_number: 24006, project_name: 'Triad Multifamily Phase 1', status: 'active', total_contract: 402500, territory_id: 4, territory_name: 'Triad', company_name: 'Triad Multifamily Group', project_manager_name: 'Chris Walker', install_start_date: '2026-07-08', install_end_date: '2026-08-22' },
];

const demoMetrics = [
  { metric_month: '2026-03-01', revenue_earned_to_date: 352000, pipeline_value: 1150000, total_bid_value: 812000, bids_sent: 7 },
  { metric_month: '2026-04-01', revenue_earned_to_date: 618000, pipeline_value: 1498000, total_bid_value: 1245000, bids_sent: 9 },
  { metric_month: '2026-05-01', revenue_earned_to_date: 409400, pipeline_value: 1307500, total_bid_value: 1048000, bids_sent: 8 },
];

const demoFinance = {
  overview: {
    ytd_revenue: 1379400, ytd_gp_dollars: 358644, ytd_gp_percent: 0.26,
    ytd_np_dollars: 137940, ytd_np_percent: 0.10, ytd_bids_sent: 24,
    ytd_bid_value: 3105000, ytd_installer_hours: 2340,
    total_pipeline: 3457000, total_backlog: 1154250, bill_this_month: 287500,
  },
  monthly: [
    { metric_month: '2026-01-01', revenue: 210000, gp_dollars: 54600, gp_percent: 0.26, np_dollars: 21000, np_percent: 0.10, installer_hours: 420, ppmh: 50, bids_sent: 4, bid_value: 510000, pipeline_value: 980000, hit_rate: 0.42, capture_rate: 0.31 },
    { metric_month: '2026-02-01', revenue: 352000, gp_dollars: 91520, gp_percent: 0.26, np_dollars: 35200, np_percent: 0.10, installer_hours: 680, ppmh: 52, bids_sent: 7, bid_value: 812000, pipeline_value: 1150000, hit_rate: 0.44, capture_rate: 0.33 },
    { metric_month: '2026-03-01', revenue: 409400, gp_dollars: 106444, gp_percent: 0.26, np_dollars: 40940, np_percent: 0.10, installer_hours: 790, ppmh: 52, bids_sent: 8, bid_value: 936000, pipeline_value: 1307500, hit_rate: 0.46, capture_rate: 0.34 },
    { metric_month: '2026-04-01', revenue: 408000, gp_dollars: 106080, gp_percent: 0.26, np_dollars: 40800, np_percent: 0.10, installer_hours: 760, ppmh: 54, bids_sent: 5, bid_value: 847000, pipeline_value: 1498000, hit_rate: 0.44, capture_rate: 0.32 },
  ],
  billing: [
    { project_id: 1, job_number: 24001, project_name: 'Uptown Medical Office Shades', status: 'active', total_contract: 197000, territory_name: 'Charlotte Metro', pm_name: 'Maya Johnson', billing_month: '2026-05-01', total_billed_to_date: 118200, remaining_to_bill: 78800, percent_complete: 0.60, bill_this_month: 39400, accrued_retainage: 11820, revenue_earned_to_date: 118200, under_over_billed: 0, invoice_sent: true },
    { project_id: 2, job_number: 24002, project_name: 'Crescent South Apartments', status: 'active', total_contract: 340500, territory_name: 'Charlotte Metro', pm_name: 'Maya Johnson', billing_month: '2026-05-01', total_billed_to_date: 85125, remaining_to_bill: 255375, percent_complete: 0.25, bill_this_month: 68100, accrued_retainage: 8512, revenue_earned_to_date: 85125, under_over_billed: 0, invoice_sent: false },
    { project_id: 3, job_number: 24003, project_name: 'Lake Norman Hotel Renovation', status: 'pending', total_contract: 226750, territory_name: 'Lake Norman', pm_name: 'Chris Walker', billing_month: null, total_billed_to_date: 0, remaining_to_bill: 226750, percent_complete: 0, bill_this_month: 0, accrued_retainage: 0, revenue_earned_to_date: 0, under_over_billed: 0, invoice_sent: false },
    { project_id: 4, job_number: 24004, project_name: 'Palmetto Surgical Center', status: 'active', total_contract: 157300, territory_name: 'South Carolina', pm_name: 'Maya Johnson', billing_month: '2026-05-01', total_billed_to_date: 94380, remaining_to_bill: 62920, percent_complete: 0.60, bill_this_month: 31460, accrued_retainage: 9438, revenue_earned_to_date: 94380, under_over_billed: -2500, invoice_sent: true },
    { project_id: 6, job_number: 24006, project_name: 'Triad Multifamily Phase 1', status: 'active', total_contract: 402500, territory_name: 'Triad', pm_name: 'Chris Walker', billing_month: '2026-05-01', total_billed_to_date: 80500, remaining_to_bill: 322000, percent_complete: 0.20, bill_this_month: 80500, accrued_retainage: 8050, revenue_earned_to_date: 80500, under_over_billed: 0, invoice_sent: false },
  ],
  payroll: [
    { project_id: 1, job_number: 24001, project_name: 'Uptown Medical Office Shades', status: 'active', payroll_reporting: true, total_contract: 197000, estimated_labor_cost: 49250, estimated_material_cost: 108350, total_estimate: 157600, territory_name: 'Charlotte Metro', pm_name: 'Maya Johnson', actual_cost_recognized: 29700 },
    { project_id: 2, job_number: 24002, project_name: 'Crescent South Apartments', status: 'active', payroll_reporting: true, total_contract: 340500, estimated_labor_cost: 85125, estimated_material_cost: 187275, total_estimate: 272400, territory_name: 'Charlotte Metro', pm_name: 'Maya Johnson', actual_cost_recognized: 21281 },
    { project_id: 3, job_number: 24003, project_name: 'Lake Norman Hotel Renovation', status: 'pending', payroll_reporting: false, total_contract: 226750, estimated_labor_cost: 56688, estimated_material_cost: 124713, total_estimate: 181400, territory_name: 'Lake Norman', pm_name: 'Chris Walker', actual_cost_recognized: 0 },
    { project_id: 4, job_number: 24004, project_name: 'Palmetto Surgical Center', status: 'active', payroll_reporting: true, total_contract: 157300, estimated_labor_cost: 39325, estimated_material_cost: 86515, total_estimate: 125840, territory_name: 'South Carolina', pm_name: 'Maya Johnson', actual_cost_recognized: 23595 },
    { project_id: 5, job_number: 24005, project_name: 'Riverfront Condo Unit 4B', status: 'completed', payroll_reporting: true, total_contract: 30000, estimated_labor_cost: 7500, estimated_material_cost: 16500, total_estimate: 24000, territory_name: 'Charlotte Metro', pm_name: 'Maya Johnson', actual_cost_recognized: 24000 },
    { project_id: 6, job_number: 24006, project_name: 'Triad Multifamily Phase 1', status: 'active', payroll_reporting: false, total_contract: 402500, estimated_labor_cost: 100625, estimated_material_cost: 221375, total_estimate: 322000, territory_name: 'Triad', pm_name: 'Chris Walker', actual_cost_recognized: 20100 },
  ],
  changeOrders: [
    { id: 1, project_id: 1, job_number: 24001, project_name: 'Uptown Medical Office Shades', status: 'active', co_number: 'CO-001', description: 'Additional motorized blinds in conference rooms', amount: 14500, estimated_cost_change: 9425, created_at: '2026-04-12' },
    { id: 2, project_id: 4, job_number: 24004, project_name: 'Palmetto Surgical Center', status: 'active', co_number: 'CO-001', description: 'Upgrade fabric spec on OR suites', amount: 8750, estimated_cost_change: 5688, created_at: '2026-04-28' },
    { id: 3, project_id: 2, job_number: 24002, project_name: 'Crescent South Apartments', status: 'active', co_number: 'CO-001', description: 'Extra unit count – Phase 2 added', amount: 42000, estimated_cost_change: 27300, created_at: '2026-05-02' },
  ],
  bids: [
    { id: 1, project_name: 'Ballantyne Corporate Park Phase 3', bid_date: '2026-05-10', bid_amount: 285000, estimated_gp: 74100, estimated_np: 28500, estimated_hours: 540, bid_status: 'pending', won: false, notes: '', territory_name: 'Charlotte Metro', company_name: 'Brookline Builders' },
    { id: 2, project_name: 'Huntersville Luxury Apartments', bid_date: '2026-05-04', bid_amount: 412000, estimated_gp: 107120, estimated_np: 41200, estimated_hours: 780, bid_status: 'won', won: true, notes: 'Awarded', territory_name: 'Lake Norman', company_name: 'Lakeside Hospitality Partners' },
    { id: 3, project_name: 'Cabarrus County Medical', bid_date: '2026-04-22', bid_amount: 157500, estimated_gp: 40950, estimated_np: 15750, estimated_hours: 298, bid_status: 'lost', won: false, notes: 'Underbid by competitor', territory_name: 'Charlotte Metro', company_name: 'Palmetto Commercial Interiors' },
    { id: 4, project_name: 'SouthPark Office Tower', bid_date: '2026-04-15', bid_amount: 320000, estimated_gp: 83200, estimated_np: 32000, estimated_hours: 605, bid_status: 'pending', won: false, notes: 'Awaiting GC decision', territory_name: 'Charlotte Metro', company_name: 'Crescent Property Group' },
    { id: 5, project_name: 'Triad Distribution Center', bid_date: '2026-04-08', bid_amount: 198000, estimated_gp: 51480, estimated_np: 19800, estimated_hours: 374, bid_status: 'won', won: true, notes: '', territory_name: 'Triad', company_name: 'Triad Multifamily Group' },
  ],
};

const statusLabels = {
  active: 'Active',
  pending: 'Pending',
  completed: 'Completed',
  hold: 'On Hold',
  unassigned: 'Unassigned',
};

function currency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value || 0));
}

function projectContractValue(project) {
  return Number(project.display_contract_value || project.total_contract || project.contract_value || project.original_contract || 0);
}

function monthLabel(value) {
  return new Date(`${String(value).slice(0, 10)}T12:00:00`).toLocaleDateString('en-US', { month: 'short' });
}

function shortDate(value) {
  if (!value) return 'Not scheduled';
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function getAreaName(id, fallback) {
  return territoryNames[id || 0] || fallback || 'Unassigned area';
}

function buildDashboard(projects, metrics = demoMetrics, areaId = 0) {
  const scoped = areaId ? projects.filter((project) => Number(project.territory_id) === Number(areaId)) : projects;
  const total = scoped.reduce((sum, project) => sum + projectContractValue(project), 0);
  const open = scoped.filter((project) => project.status !== 'completed');
  const completed = scoped.filter((project) => project.status === 'completed');
  const byStatus = Object.values(scoped.reduce((acc, project) => {
    const key = project.status || 'unassigned';
    acc[key] ||= { status: key, project_count: 0, contract_value: 0 };
    acc[key].project_count += 1;
    acc[key].contract_value += projectContractValue(project);
    return acc;
  }, {})).sort((a, b) => b.contract_value - a.contract_value);
  const byTerritory = Object.values(scoped.reduce((acc, project) => {
    const key = project.territory_id || 0;
    acc[key] ||= { territory_id: key, territory_name: project.territory_name, project_count: 0, contract_value: 0 };
    acc[key].project_count += 1;
    acc[key].contract_value += projectContractValue(project);
    return acc;
  }, {})).sort((a, b) => b.contract_value - a.contract_value);

  return {
    summary: {
      total_projects: scoped.length,
      open_projects: open.length,
      total_contract_value: total,
      open_contract_value: open.reduce((sum, project) => sum + projectContractValue(project), 0),
      completed_contract_value: completed.reduce((sum, project) => sum + projectContractValue(project), 0),
      average_project_value: scoped.length ? total / scoped.length : 0,
    },
    byStatus,
    byTerritory,
    recentProjects: scoped.slice(0, 12),
    projects: scoped,
    monthlyMetrics: metrics,
    bidSummary: [],
  };
}

function normalizeDashboard(apiDashboard, areaId) {
  const projects = apiDashboard?.projects?.length ? apiDashboard.projects : apiDashboard?.recentProjects || demoProjects;
  return {
    ...buildDashboard(projects, apiDashboard?.monthlyMetrics?.length ? apiDashboard.monthlyMetrics : demoMetrics, areaId),
    ...apiDashboard,
    projects,
    recentProjects: apiDashboard?.recentProjects?.length ? apiDashboard.recentProjects : projects.slice(0, 12),
    monthlyMetrics: apiDashboard?.monthlyMetrics?.length ? apiDashboard.monthlyMetrics : demoMetrics,
  };
}

function StatCard({ label, value, note }) {
  return (
    <section className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </section>
  );
}

function BarChart({ title, subtitle, data, valueKey, projectedKey }) {
  const max = Math.max(...data.flatMap((item) => [Number(item[valueKey] || 0), Number(item[projectedKey] || 0)]), 1);
  return (
    <section className="panel chart-panel">
      <div className="panel-head">
        <h2>{title}</h2>
        <span>{subtitle}</span>
      </div>
      <div className="bar-chart">
        {data.map((item) => (
          <div className="bar-column" key={`${title}-${item.metric_month || item.bid_month}`}>
            <div className="bar-stack">
              {projectedKey && <span className="bar projected" style={{ height: `${(Number(item[projectedKey] || 0) / max) * 100}%` }} title={`Projected ${currency(item[projectedKey])}`} />}
              <span className="bar actual" style={{ height: `${(Number(item[valueKey] || 0) / max) * 100}%` }} title={currency(item[valueKey])} />
            </div>
            <strong>{monthLabel(item.metric_month || item.bid_month)}</strong>
            <small>{currency(item[valueKey])}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function compactMoney(value) {
  const number = Number(value || 0);
  if (Math.abs(number) >= 1000000) return `$${(number / 1000000).toFixed(2)}M`;
  if (Math.abs(number) >= 1000) return `$${(number / 1000).toFixed(0)}K`;
  return currency(number);
}

function sumValues(items, key) {
  return items.reduce((sum, item) => sum + Number(item[key] || 0), 0);
}

function formatRatio(value) {
  if (value === null || value === undefined || value === '') return '-';
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return '-';
  return `${(parsed * 100).toFixed(1)}%`;
}

function buildPerformanceModel(dashboard) {
  const metrics = dashboard.monthlyMetrics?.length ? dashboard.monthlyMetrics : demoMetrics;
  const latest = metrics[metrics.length - 1] || {};
  return [
    {
      label: 'Hit Rate',
      value: formatRatio(latest.hit_rate),
      note: 'Closed opportunity velocity',
    },
    {
      label: 'Capture Rate',
      value: formatRatio(latest.capture_rate),
      note: 'Sales capture efficiency',
    },
    {
      label: 'Installer Hours',
      value: `${Number(latest.installer_hours || 0).toFixed(0)}`,
      note: 'Latest reporting month',
    },
    {
      label: 'Profit / MH',
      value: currency(latest.profit_per_man_hour),
      note: 'Installation productivity',
    },
  ];
}

function buildFinanceModel(dashboard) {
  const metrics = dashboard.monthlyMetrics?.length ? dashboard.monthlyMetrics : demoMetrics;
  const projects = dashboard.projects || [];
  const revenueGoal = 9500000;
  const bidGoal = 130960000;
  const contractGoal = 12000000;
  const ytdRevenue = sumValues(metrics, 'total_won_value');
  const ytdBids = sumValues(metrics, 'total_bid_value');
  const ytdContracts = projects
    .filter((project) => project.status === 'completed' || project.status === 'active')
    .reduce((sum, project) => sum + projectContractValue(project), 0);
  const monthlyActual = metrics.map((metric) => ({
    label: monthLabel(metric.metric_month),
    rawDate: metric.metric_month,
    accrued: Number(metric.total_won_value || 0),
    pipeline: Number(metric.pipeline_value || 0),
    backlog: Number(metric.pipeline_value || 0) * 0.68,
  }));
  const lastActual = monthlyActual[monthlyActual.length - 1] || { accrued: 0, pipeline: 0, backlog: 0 };
  const remainingMonths = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const projected = remainingMonths.map((label, index) => ({
    label,
    rawDate: `2026-${String(index + 6).padStart(2, '0')}-01`,
    projectedRevenue: lastActual.accrued + ((revenueGoal - lastActual.accrued) / remainingMonths.length) * (index + 1),
  }));

  return {
    revenueGoal,
    bidGoal,
    contractGoal,
    pacing: [
      { label: 'Accrued Revenue', actual: ytdRevenue, goal: revenueGoal, color: 'teal' },
      { label: 'Total Bid $', actual: ytdBids, goal: bidGoal, color: 'green' },
      { label: 'Contract $ Wins', actual: ytdContracts, goal: contractGoal, color: 'yellow' },
    ],
    chart: {
      labels: [...monthlyActual.map((item) => item.label), ...projected.map((item) => item.label)],
      backlog: monthlyActual.map((item) => item.backlog),
      pipeline: monthlyActual.map((item) => item.pipeline),
      accruedActual: monthlyActual.map((item) => item.accrued),
      accruedProjected: [...Array(monthlyActual.length - 1).fill(null), lastActual.accrued, ...projected.map((item) => item.projectedRevenue)],
      goal: [...Array(monthlyActual.length + projected.length).fill(revenueGoal)],
    },
  };
}

function PacingGauge({ item }) {
  const percent = Math.max(0, Math.min(100, (Number(item.actual || 0) / Number(item.goal || 1)) * 100));
  const angle = -180 + (percent / 100) * 180;
  return (
    <section className={`pacing-card finance-${item.color}`}>
      <h3>{item.label}</h3>
      <div className="gauge" style={{ '--angle': `${angle}deg` }}>
        <div className="gauge-arc" />
        <div className="gauge-fill" />
        <div className="gauge-center">
          <strong>{percent.toFixed(1)}%</strong>
        </div>
      </div>
      <div className="pacing-meta">
        <div><span>YTD actual</span><strong>{compactMoney(item.actual)}</strong></div>
        <div><span>2026 goal</span><strong>{compactMoney(item.goal)}</strong></div>
        <div><span>% pacing</span><strong>{percent.toFixed(1)}%</strong></div>
      </div>
    </section>
  );
}

function LineChart({ model }) {
  const width = 1000;
  const height = 360;
  const padding = { top: 24, right: 28, bottom: 52, left: 68 };
  const series = [
    { key: 'backlog', label: 'Backlog', color: '#10e0c0', dashed: false },
    { key: 'pipeline', label: 'Pipeline (LOI)', color: '#ff62c7', dashed: false },
    { key: 'accruedActual', label: 'Accrued Revenue (Actual)', color: '#ffe100', dashed: false },
    { key: 'accruedProjected', label: 'Accrued Revenue (Projected)', color: '#39ff14', dashed: true },
    { key: 'goal', label: '2026 Revenue Goal', color: '#777', dashed: true },
  ];
  const allValues = series.flatMap((item) => model.chart[item.key]).filter((value) => value !== null && value !== undefined);
  const maxValue = Math.max(...allValues, 1);
  const minValue = 0;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const x = (index) => padding.left + (index / Math.max(model.chart.labels.length - 1, 1)) * plotWidth;
  const y = (value) => padding.top + (1 - (Number(value) - minValue) / (maxValue - minValue)) * plotHeight;
  const pathFor = (values) => values.reduce((path, value, index) => {
    if (value === null || value === undefined) return path;
    const command = path ? 'L' : 'M';
    return `${path} ${command} ${x(index).toFixed(1)} ${y(value).toFixed(1)}`;
  }, '');
  const ticks = [0, .25, .5, .75, 1].map((ratio) => maxValue * ratio);

  return (
    <section className="finance-chart-card">
      <div className="finance-kicker">Backlog, Pipeline & Revenue Trajectory</div>
      <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Revenue trajectory line chart">
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={padding.left} x2={width - padding.right} y1={y(tick)} y2={y(tick)} className="grid-line" />
            <text x={padding.left - 10} y={y(tick) + 4} textAnchor="end" className="axis-label">{compactMoney(tick)}</text>
          </g>
        ))}
        {model.chart.labels.map((label, index) => (
          <g key={label}>
            <line x1={x(index)} x2={x(index)} y1={padding.top} y2={height - padding.bottom} className="grid-line vertical" />
            <text x={x(index)} y={height - 18} textAnchor="middle" className="axis-label">{label}</text>
          </g>
        ))}
        {series.map((item) => (
          <path key={item.key} d={pathFor(model.chart[item.key])} fill="none" stroke={item.color} strokeWidth="3" strokeDasharray={item.dashed ? '8 7' : '0'} />
        ))}
        {series.slice(0, 4).flatMap((item) => model.chart[item.key].map((value, index) => value === null || value === undefined ? null : (
          <circle key={`${item.key}-${index}`} cx={x(index)} cy={y(value)} r="5" fill={item.color} />
        )))}
      </svg>
      <div className="chart-legend">
        {series.map((item) => <span key={item.key}><i style={{ background: item.color }} />{item.label}</span>)}
      </div>
    </section>
  );
}

function MultiSeriesChart({ title, series, labels }) {
  const width = 960;
  const height = 280;
  const pad = { top: 16, right: 24, bottom: 40, left: 66 };
  const allValues = series.flatMap((s) => s.values).filter((v) => v != null && !Number.isNaN(Number(v)));
  const maxVal = Math.max(...allValues, 1);
  const pw = width - pad.left - pad.right;
  const ph = height - pad.top - pad.bottom;
  const cx = (i) => pad.left + (i / Math.max(labels.length - 1, 1)) * pw;
  const cy = (v) => pad.top + (1 - Number(v) / maxVal) * ph;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((r) => maxVal * r);
  const makePath = (values) => values.reduce((p, v, i) => {
    if (v == null) return p;
    return `${p}${p ? ' L' : 'M'} ${cx(i).toFixed(1)} ${cy(v).toFixed(1)}`;
  }, '');

  return (
    <section className="pacing-card fin-chart-wide">
      <div className="fin-panel-head">
        <h2>{title}</h2>
        <div className="chart-legend" style={{ borderTop: 0, paddingTop: 0, marginTop: 0 }}>
          {series.map((s) => <span key={s.label}><i style={{ background: s.color }} />{s.label}</span>)}
        </div>
      </div>
      <div style={{ padding: '0 18px 18px' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', width: '100%' }}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={width - pad.right} y1={cy(t)} y2={cy(t)} stroke="#e6ebef" strokeWidth="1" />
              <text x={pad.left - 8} y={cy(t) + 4} textAnchor="end" fill="#6f7a84" fontSize="11">{compactMoney(t)}</text>
            </g>
          ))}
          {labels.map((label, i) => (
            <g key={label}>
              <line x1={cx(i)} x2={cx(i)} y1={pad.top} y2={height - pad.bottom} stroke="#eef2f4" strokeWidth="1" />
              <text x={cx(i)} y={height - 8} textAnchor="middle" fill="#6f7a84" fontSize="11">{label}</text>
            </g>
          ))}
          {series.map((s) => (
            <path key={s.label} d={makePath(s.values)} fill="none" stroke={s.color} strokeWidth="2.5" strokeDasharray={s.dashed ? '7 5' : '0'} />
          ))}
          {series.map((s) => s.values.map((v, i) => v == null ? null : (
            <circle key={`${s.label}-${i}`} cx={cx(i)} cy={cy(v)} r="4" fill={s.color} />
          )))}
        </svg>
      </div>
    </section>
  );
}

function FinKpiCard({ label, value, sub, color }) {
  return (
    <div className="fin-kpi-card" style={{ '--kpi-color': color || 'var(--brand)' }}>
      <span>{label}</span>
      <strong>{value}</strong>
      {sub && <small>{sub}</small>}
    </div>
  );
}

function ProgressBar({ pct, color }) {
  const w = Math.min(100, Math.max(0, pct * 100));
  return (
    <div className="fin-progress-track">
      <div className="fin-progress-fill" style={{ width: `${w}%`, background: color || 'var(--brand)' }} />
    </div>
  );
}

function MonthlyMetricsTable({ monthly }) {
  return (
    <section className="panel">
      <div className="panel-head"><h2>Monthly KPIs</h2><span>{monthly.length} months</span></div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Revenue</th>
              <th>Gross Profit</th>
              <th>GP %</th>
              <th>Net Profit</th>
              <th>NP %</th>
              <th>Inst. Hours</th>
              <th>$/MH</th>
              <th>Hit Rate</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map((row) => (
              <tr key={row.metric_month}>
                <td><strong>{monthLabel(row.metric_month)} {new Date(`${row.metric_month}T12:00:00`).getFullYear()}</strong></td>
                <td>{currency(row.revenue)}</td>
                <td>{currency(row.gp_dollars)}</td>
                <td><span className={`badge ${Number(row.gp_percent) >= 0.25 ? 'badge-completed' : 'badge-pending'}`}>{formatRatio(row.gp_percent)}</span></td>
                <td>{currency(row.np_dollars)}</td>
                <td><span className={`badge ${Number(row.np_percent) >= 0.08 ? 'badge-completed' : 'badge-pending'}`}>{formatRatio(row.np_percent)}</span></td>
                <td>{Number(row.installer_hours || 0).toFixed(0)}</td>
                <td>{currency(row.ppmh)}</td>
                <td>{formatRatio(row.hit_rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FinanceOverview({ data, dashboard }) {
  const ov = data.overview;
  const monthly = data.monthly || [];
  const finance = buildFinanceModel(dashboard);
  const labels = monthly.map((m) => monthLabel(m.metric_month));
  const chartSeries = [
    { label: 'Revenue', color: '#214f6f', values: monthly.map((m) => Number(m.revenue)) },
    { label: 'Gross Profit', color: '#2f8f5b', values: monthly.map((m) => Number(m.gp_dollars)) },
    { label: 'Net Profit', color: '#d99b2b', values: monthly.map((m) => Number(m.np_dollars)) },
    { label: 'Pipeline', color: '#ff62c7', dashed: true, values: monthly.map((m) => Number(m.pipeline_value)) },
  ];

  return (
    <>
      <div className="fin-kpi-grid">
        <FinKpiCard label="YTD Revenue" value={compactMoney(ov.ytd_revenue)} sub="Accrued to date" color="var(--brand)" />
        <FinKpiCard label="YTD Gross Profit" value={compactMoney(ov.ytd_gp_dollars)} sub={formatRatio(ov.ytd_gp_percent) + ' margin'} color="var(--green)" />
        <FinKpiCard label="YTD Net Profit" value={compactMoney(ov.ytd_np_dollars)} sub={formatRatio(ov.ytd_np_percent) + ' margin'} color="#2980b9" />
        <FinKpiCard label="Total Backlog" value={compactMoney(ov.total_backlog)} sub="Remaining to bill" color="var(--orange)" />
        <FinKpiCard label="Bill This Month" value={compactMoney(ov.bill_this_month)} sub="Current billing cycle" color="#8e44ad" />
        <FinKpiCard label="Pipeline" value={compactMoney(ov.total_pipeline)} sub={`${ov.ytd_bids_sent} bids sent YTD`} color="var(--gold)" />
      </div>
      <div className="finance-kicker">2026 Pacing — Top-line Goals</div>
      <section className="pacing-grid">
        {finance.pacing.map((item) => <PacingGauge item={item} key={item.label} />)}
      </section>
      {monthly.length > 0 && (
        <MultiSeriesChart title="Revenue · Gross Profit · Net Profit by Month" series={chartSeries} labels={labels} />
      )}
      <MonthlyMetricsTable monthly={monthly} />
    </>
  );
}

function PayrollView({ data }) {
  const rows = data.payroll || [];
  const totalLabor    = sumValues(rows, 'estimated_labor_cost');
  const totalMaterial = sumValues(rows, 'estimated_material_cost');
  const totalEstimate = sumValues(rows, 'total_estimate');
  const totalContract = sumValues(rows, 'total_contract');
  const totalCostRec  = sumValues(rows, 'actual_cost_recognized');

  return (
    <>
      <div className="fin-kpi-grid" style={{ gridTemplateColumns: 'repeat(5, minmax(0,1fr))' }}>
        <FinKpiCard label="Total Est. Labor" value={compactMoney(totalLabor)} sub={`${totalContract ? ((totalLabor / totalContract) * 100).toFixed(1) : 0}% of contract`} color="var(--brand)" />
        <FinKpiCard label="Total Est. Material" value={compactMoney(totalMaterial)} sub={`${totalContract ? ((totalMaterial / totalContract) * 100).toFixed(1) : 0}% of contract`} color="var(--orange)" />
        <FinKpiCard label="Total Estimate" value={compactMoney(totalEstimate)} sub="Labor + material" color="var(--green)" />
        <FinKpiCard label="Total Contract" value={compactMoney(totalContract)} sub="Signed value" color="#8e44ad" />
        <FinKpiCard label="Cost Recognized" value={compactMoney(totalCostRec)} sub="QBO cost to date" color="var(--gold)" />
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Payroll &amp; Labor Detail</h2><span>{rows.length} projects</span></div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Project</th>
                <th>Territory</th>
                <th>PM</th>
                <th>Payroll</th>
                <th>Est. Labor</th>
                <th>Est. Material</th>
                <th>Total Est.</th>
                <th>Contract</th>
                <th>Est. Margin</th>
                <th>Cost Rec.</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const margin = Number(row.total_contract) - Number(row.total_estimate);
                const marginPct = Number(row.total_contract) ? margin / Number(row.total_contract) : 0;
                return (
                  <tr key={row.project_id}>
                    <td>{row.job_number || '-'}</td>
                    <td>
                      <strong>{row.project_name}</strong>
                      <small><span className={`badge badge-${row.status}`}>{statusLabels[row.status] || row.status}</span></small>
                    </td>
                    <td>{row.territory_name || '-'}</td>
                    <td>{row.pm_name || '-'}</td>
                    <td>{row.payroll_reporting ? <span className="badge badge-completed">Active</span> : <span className="badge" style={{ background: '#eee', color: '#888' }}>Off</span>}</td>
                    <td>{currency(row.estimated_labor_cost)}</td>
                    <td>{currency(row.estimated_material_cost)}</td>
                    <td>{currency(row.total_estimate)}</td>
                    <td><strong>{currency(row.total_contract)}</strong></td>
                    <td>
                      <strong style={{ color: margin >= 0 ? 'var(--green)' : 'var(--red)' }}>{currency(margin)}</strong>
                      <small>{formatRatio(marginPct)}</small>
                    </td>
                    <td>{currency(row.actual_cost_recognized)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function BillingView({ data }) {
  const rows = data.billing || [];
  const totalBilled    = sumValues(rows, 'total_billed_to_date');
  const totalRemaining = sumValues(rows, 'remaining_to_bill');
  const totalThisMonth = sumValues(rows, 'bill_this_month');
  const totalRetainage = sumValues(rows, 'accrued_retainage');

  return (
    <>
      <div className="fin-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <FinKpiCard label="Billed to Date" value={compactMoney(totalBilled)} sub="Across all active jobs" color="var(--brand)" />
        <FinKpiCard label="Remaining to Bill" value={compactMoney(totalRemaining)} sub="Future revenue" color="var(--orange)" />
        <FinKpiCard label="Bill This Month" value={compactMoney(totalThisMonth)} sub="Current cycle" color="var(--green)" />
        <FinKpiCard label="Accrued Retainage" value={compactMoney(totalRetainage)} sub="Held by clients" color="#8e44ad" />
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Billing Status by Project</h2><span>{rows.length} projects</span></div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Project</th>
                <th>Territory / PM</th>
                <th>% Complete</th>
                <th>Billed to Date</th>
                <th>Remaining</th>
                <th>This Month</th>
                <th>Retainage</th>
                <th>Under/Over</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const pct = Number(row.percent_complete || 0);
                const underOver = Number(row.under_over_billed || 0);
                return (
                  <tr key={row.project_id}>
                    <td>{row.job_number || '-'}</td>
                    <td>
                      <strong>{row.project_name}</strong>
                      <small><span className={`badge badge-${row.status}`}>{statusLabels[row.status] || row.status}</span></small>
                    </td>
                    <td>
                      <strong>{row.territory_name || '-'}</strong>
                      <small>{row.pm_name || '-'}</small>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ProgressBar pct={pct} color={pct >= 0.75 ? 'var(--green)' : pct >= 0.4 ? 'var(--gold)' : 'var(--brand)'} />
                        <small style={{ whiteSpace: 'nowrap' }}>{(pct * 100).toFixed(0)}%</small>
                      </div>
                    </td>
                    <td>{currency(row.total_billed_to_date)}</td>
                    <td>{currency(row.remaining_to_bill)}</td>
                    <td><strong>{currency(row.bill_this_month)}</strong></td>
                    <td>{currency(row.accrued_retainage)}</td>
                    <td style={{ color: underOver < 0 ? 'var(--red)' : underOver > 0 ? 'var(--green)' : 'var(--muted)' }}>
                      {underOver === 0 ? '—' : currency(underOver)}
                    </td>
                    <td>{row.invoice_sent ? <span className="badge badge-completed">Sent</span> : <span className="badge badge-pending">Pending</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function BidsView({ data }) {
  const rows = data.bids || [];
  const totalValue = sumValues(rows, 'bid_amount');
  const wonRows    = rows.filter((r) => r.won || r.bid_status === 'won');
  const wonValue   = sumValues(wonRows, 'bid_amount');
  const winRate    = rows.length ? wonRows.length / rows.length : 0;
  const avgGpPct   = rows.length ? rows.reduce((s, r) => s + (Number(r.bid_amount) ? Number(r.estimated_gp) / Number(r.bid_amount) : 0), 0) / rows.length : 0;

  const bidStatusColor = { won: 'badge-completed', lost: 'badge-active', pending: 'badge-pending' };

  return (
    <>
      <div className="fin-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        <FinKpiCard label="Total Bid Value" value={compactMoney(totalValue)} sub={`${rows.length} bids`} color="var(--brand)" />
        <FinKpiCard label="Won Value" value={compactMoney(wonValue)} sub={`${wonRows.length} projects awarded`} color="var(--green)" />
        <FinKpiCard label="Win Rate" value={formatRatio(winRate)} sub="By count" color="var(--gold)" />
        <FinKpiCard label="Avg Est. GP%" value={formatRatio(avgGpPct)} sub="Across all bids" color="#8e44ad" />
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Bid Pipeline</h2><span>{rows.length} bids</span></div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Company</th>
                <th>Territory</th>
                <th>Bid Amount</th>
                <th>Est. GP</th>
                <th>GP %</th>
                <th>Est. NP</th>
                <th>NP %</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const gpPct = Number(row.bid_amount) ? Number(row.estimated_gp) / Number(row.bid_amount) : 0;
                const npPct = Number(row.bid_amount) ? Number(row.estimated_np) / Number(row.bid_amount) : 0;
                return (
                  <tr key={row.id}>
                    <td>{shortDate(row.bid_date)}</td>
                    <td><strong>{row.project_name}</strong></td>
                    <td>{row.company_name || '-'}</td>
                    <td>{row.territory_name || '-'}</td>
                    <td><strong>{currency(row.bid_amount)}</strong></td>
                    <td>{currency(row.estimated_gp)}</td>
                    <td><span className={`badge ${gpPct >= 0.25 ? 'badge-completed' : 'badge-pending'}`}>{formatRatio(gpPct)}</span></td>
                    <td>{currency(row.estimated_np)}</td>
                    <td><span className={`badge ${npPct >= 0.08 ? 'badge-completed' : 'badge-pending'}`}>{formatRatio(npPct)}</span></td>
                    <td>{Number(row.estimated_hours || 0).toFixed(0)}</td>
                    <td><span className={`badge ${bidStatusColor[row.bid_status] || 'badge-pending'}`}>{row.bid_status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function ChangeOrdersView({ data }) {
  const rows = data.changeOrders || [];
  const totalAmount   = sumValues(rows, 'amount');
  const totalCostImpact = sumValues(rows, 'estimated_cost_change');
  const gpImpact      = totalAmount - totalCostImpact;

  return (
    <>
      <div className="fin-kpi-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
        <FinKpiCard label="Total CO Value" value={compactMoney(totalAmount)} sub={`${rows.length} change orders`} color="var(--brand)" />
        <FinKpiCard label="Est. Cost Impact" value={compactMoney(totalCostImpact)} sub="Additional costs" color="var(--orange)" />
        <FinKpiCard label="Est. GP Impact" value={compactMoney(gpImpact)} sub={totalAmount ? formatRatio(gpImpact / totalAmount) + ' added margin' : '—'} color="var(--green)" />
      </div>
      <section className="panel">
        <div className="panel-head"><h2>Change Orders</h2><span>{rows.length} total</span></div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Job</th>
                <th>Project</th>
                <th>CO #</th>
                <th>Description</th>
                <th>CO Amount</th>
                <th>Est. Cost Change</th>
                <th>GP Impact</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const gpImpactRow = Number(row.amount) - Number(row.estimated_cost_change);
                return (
                  <tr key={row.id}>
                    <td>{shortDate(row.created_at)}</td>
                    <td>{row.job_number || '-'}</td>
                    <td>
                      <strong>{row.project_name}</strong>
                      <small><span className={`badge badge-${row.status}`}>{statusLabels[row.status] || row.status}</span></small>
                    </td>
                    <td>{row.co_number || '-'}</td>
                    <td style={{ maxWidth: 240 }}>{row.description || '-'}</td>
                    <td><strong>{currency(row.amount)}</strong></td>
                    <td>{currency(row.estimated_cost_change)}</td>
                    <td style={{ color: gpImpactRow >= 0 ? 'var(--green)' : 'var(--red)' }}><strong>{currency(gpImpactRow)}</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function FinancialDashboard({ dashboard }) {
  const [finTab, setFinTab] = useState('overview');
  const [finData, setFinData] = useState(null);
  const [loadingFin, setLoadingFin] = useState(false);

  useEffect(() => {
    setLoadingFin(true);
    fetch('/api/finance', { credentials: 'include' })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((body) => setFinData(body))
      .catch(() => {})
      .finally(() => setLoadingFin(false));
  }, []);

  const data = finData || demoFinance;
  const finTabs = [
    ['overview', 'Overview'],
    ['payroll', 'Payroll & Labor'],
    ['billing', 'Billing'],
    ['bids', 'Bid Pipeline'],
    ['changes', 'Change Orders'],
  ];

  return (
    <div className="finance-dashboard">
      <div className="fin-tab-bar">
        {finTabs.map(([id, label]) => (
          <button key={id} type="button" className={finTab === id ? 'fin-tab fin-tab-active' : 'fin-tab'} onClick={() => setFinTab(id)}>{label}</button>
        ))}
        {loadingFin && <span className="fin-loading">Loading live data…</span>}
        {!finData && !loadingFin && <span className="fin-loading">Demo data</span>}
      </div>
      {finTab === 'overview' && <FinanceOverview data={data} dashboard={dashboard} />}
      {finTab === 'payroll'  && <PayrollView data={data} />}
      {finTab === 'billing'  && <BillingView data={data} />}
      {finTab === 'bids'     && <BidsView data={data} />}
      {finTab === 'changes'  && <ChangeOrdersView data={data} />}
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('maya.pm@jamesblinds.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Unable to log in.');
      onLogin(body.user);
    } catch (err) {
      setError(`${err.message} Showing demo dashboard data.`);
      onLogin({ id: 'demo', name: 'Project Manager', email, role: 'project_manager', territoryId: 1, demo: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-hero">
        <p>James Blinds</p>
        <h1>Mission Control</h1>
        <span>Role-aware operations dashboard for projects, calendars, financials, and bid activity.</span>
      </section>
      <form className="login-panel" onSubmit={submit}>
        <p>Secure sign in</p>
        <h2>Open your dashboard</h2>
        <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <div className="error">{error}</div>}
        <button disabled={loading} type="submit">{loading ? 'Signing in...' : 'Log in'}</button>
      </form>
    </main>
  );
}

function DashboardHome({ dashboard }) {
  const summary = dashboard.summary;
  const metrics = dashboard.monthlyMetrics || demoMetrics;
  const bidData = dashboard.bidSummary?.length
    ? dashboard.bidSummary.map((item) => ({ ...item, metric_month: item.bid_month, total_bid_value: item.bid_dollars }))
    : metrics;
  const performanceMetrics = buildPerformanceModel(dashboard);

  return (
    <>
      <section className="stats-grid">
        <StatCard label="Open Contract Value" value={currency(summary.open_contract_value)} note={`${summary.open_projects} active or pending jobs`} />
        <StatCard label="Total Pipeline" value={currency(summary.total_contract_value)} note={`${summary.total_projects} projects in view`} />
        <StatCard label="Completed Revenue" value={currency(summary.completed_contract_value)} note="Closed work in this area" />
        <StatCard label="Average Job" value={currency(summary.average_project_value)} note="Typical contract value" />
      </section>
      <section className="stats-grid performance-grid">
        {performanceMetrics.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} note={item.note} />
        ))}
      </section>
      <section className="charts-grid">
        <BarChart title="Revenue Over Year" subtitle="earned vs projected pipeline" data={metrics} valueKey="total_won_value" projectedKey="pipeline_value" />
        <BarChart title="Bid Dollars Sent" subtitle="monthly estimating activity" data={bidData} valueKey="total_bid_value" />
      </section>
      <section className="content-grid">
        <ProjectTable projects={dashboard.recentProjects || []} compact />
        <FinancialSide dashboard={dashboard} />
      </section>
    </>
  );
}

function ProjectTable({ projects, compact = false }) {
  return (
    <section className="panel table-panel">
      <div className="panel-head">
        <h2>{compact ? 'Current Projects' : 'All Projects'}</h2>
        <span>{projects.length} shown</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Job</th>
            <th>Project</th>
            <th>Area</th>
            <th>Status</th>
            <th>Install</th>
            <th>Contract</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.job_number || '-'}</td>
              <td><strong>{project.project_name}</strong><small>{project.company_name || project.project_manager_name || 'No company assigned'}</small></td>
              <td>{getAreaName(project.territory_id, project.territory_name)}</td>
              <td><span className={`badge badge-${project.status || 'unassigned'}`}>{statusLabels[project.status] || project.status || 'Unassigned'}</span></td>
              <td>{shortDate(project.install_start_date)}</td>
              <td>{currency(projectContractValue(project))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function FinancialSide({ dashboard }) {
  const max = Math.max(...(dashboard.byTerritory || []).map((area) => Number(area.contract_value)), 1);
  return (
    <div className="side-stack">
      <section className="panel">
        <div className="panel-head"><h2>Area Financials</h2><span>Contract value by territory</span></div>
        <div className="area-list">
          {(dashboard.byTerritory || []).map((area) => (
            <div className="area-row" key={area.territory_id}>
              <div><strong>{getAreaName(area.territory_id, area.territory_name)}</strong><small>{area.project_count} projects</small></div>
              <div className="bar-track"><span style={{ width: `${(Number(area.contract_value) / max) * 100}%` }} /></div>
              <strong>{currency(area.contract_value)}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="panel-head"><h2>Status Money</h2><span>Where value sits</span></div>
        <div className="status-list">
          {(dashboard.byStatus || []).map((item) => (
            <div className="status-row" key={item.status}>
              <span className={`badge badge-${item.status}`}>{statusLabels[item.status] || item.status}</span>
              <strong>{currency(item.contract_value)}</strong>
              <small>{item.project_count} jobs</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CalendarView({ projects }) {
  const [anchor, setAnchor] = useState(new Date('2026-05-01T12:00:00'));
  const monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(1 - monthStart.getDay());
  const days = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
  const events = projects.flatMap((project) => [
    project.install_start_date && { date: project.install_start_date, type: 'Install Start', project },
    project.install_end_date && { date: project.install_end_date, type: 'Install End', project },
    project.completion_date && { date: project.completion_date, type: 'Complete', project },
  ].filter(Boolean));

  return (
    <section className="calendar-layout">
      <div className="panel calendar-board">
        <div className="panel-head">
          <h2>{anchor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <div className="calendar-actions">
            <button type="button" onClick={() => setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1))}>Prev</button>
            <button type="button" onClick={() => setAnchor(new Date('2026-05-01T12:00:00'))}>Today</button>
            <button type="button" onClick={() => setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1))}>Next</button>
          </div>
        </div>
        <div className="weekdays">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}</div>
        <div className="calendar-grid">
          {days.map((day) => {
            const key = isoDate(day);
            const dayEvents = events.filter((event) => event.date === key);
            return (
              <div className={day.getMonth() === anchor.getMonth() ? 'day' : 'day muted-day'} key={key}>
                <strong>{day.getDate()}</strong>
                {dayEvents.slice(0, 3).map((event) => (
                  <span className={`calendar-event event-${event.type.replaceAll(' ', '-').toLowerCase()}`} key={`${event.type}-${event.project.id}`}>
                    {event.type}: {event.project.job_number || event.project.project_name}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <section className="panel agenda-panel">
        <div className="panel-head"><h2>Calendar List</h2><span>{events.length} milestones</span></div>
        <div className="agenda-list">
          {events.sort((a, b) => a.date.localeCompare(b.date)).map((event) => (
            <div className="agenda-item" key={`${event.date}-${event.type}-${event.project.id}`}>
              <span className="badge badge-active">{event.type}</span>
              <div><strong>{event.project.project_name}</strong><small>{shortDate(event.date)} - {getAreaName(event.project.territory_id, event.project.territory_name)}</small></div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function ProjectManagerDashboard({ user }) {
  const [activeView, setActiveView] = useState('dashboard');
  const [areaId, setAreaId] = useState(user.territoryId || 0);
  const [apiDashboard, setApiDashboard] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const dashboard = normalizeDashboard(apiDashboard, areaId);
  const views = [
    ['dashboard', 'Dashboard'],
    ['projects', 'Projects'],
    ['calendar', 'Calendar'],
    ['financials', 'Financials'],
  ];

  async function refreshFromApi() {
    setLoadingApi(true);
    try {
      const response = await fetch('/api/dashboard', { credentials: 'include' });
      if (!response.ok) return;
      const body = await response.json();
      setApiDashboard(body.dashboards?.projectManager || null);
    } finally {
      setLoadingApi(false);
    }
  }

  useEffect(() => {
    if (!user.demo) refreshFromApi();
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><strong>James Blinds</strong><span>Mission Control</span></div>
        {views.map(([id, label]) => <button className={activeView === id ? 'nav-active' : ''} key={id} onClick={() => setActiveView(id)} type="button">{label}</button>)}
        <div className="user-card"><strong>{user.name}</strong><span>{user.role?.replace('_', ' ') || 'project manager'}</span></div>
      </aside>

      <main className="dashboard">
        <header className="page-head">
          <div><p>{getAreaName(areaId)}</p><h1>{views.find(([id]) => id === activeView)?.[1]}</h1></div>
          <div className="actions">
            <select value={areaId} onChange={(event) => setAreaId(Number(event.target.value))}>
              <option value="0">All areas</option>
              <option value="1">Charlotte Metro</option>
              <option value="2">Lake Norman</option>
              <option value="3">South Carolina</option>
              <option value="4">Triad</option>
            </select>
            <button onClick={refreshFromApi} type="button">{loadingApi ? 'Refreshing...' : 'Refresh API'}</button>
          </div>
        </header>

        {activeView === 'dashboard' && <DashboardHome dashboard={dashboard} />}
        {activeView === 'projects' && <ProjectTable projects={dashboard.projects || []} />}
        {activeView === 'calendar' && <CalendarView projects={dashboard.projects || []} />}
        {activeView === 'financials' && <FinancialDashboard dashboard={dashboard} />}
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  if (!user) return <LoginScreen onLogin={setUser} />;
  return <ProjectManagerDashboard user={user} />;
}

createRoot(document.getElementById('root')).render(<App />);
