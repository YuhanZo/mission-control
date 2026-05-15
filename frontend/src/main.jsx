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

function FinancialDashboard({ dashboard }) {
  const finance = buildFinanceModel(dashboard);
  return (
    <div className="finance-dashboard">
      <div className="finance-kicker">2026 Pacing - Top-line Goals</div>
      <section className="pacing-grid">
        {finance.pacing.map((item) => <PacingGauge item={item} key={item.label} />)}
      </section>
      <LineChart model={finance} />
      <section className="finance-bottom-grid">
        <FinancialSide dashboard={dashboard} />
        <BarChart title="Bid Dollars Sent" subtitle="monthly estimating activity" data={dashboard.monthlyMetrics || demoMetrics} valueKey="total_bid_value" />
      </section>
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
