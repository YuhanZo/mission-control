import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers]   = useState(null);
  const [roles, setRoles]   = useState([]);
  const [form, setForm]     = useState({ name: '', email: '', password: '', role_id: '', phone: '' });
  const [error, setError]   = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.users(), api.roles()])
      .then(([ud, rd]) => { setUsers(ud.users); setRoles(rd.roles); })
      .catch(() => navigate('/login'));
  }, [navigate]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const { user } = await api.createUser(form);
      setUsers(prev => [...prev, { ...user, role_name: roles.find(r => r.id === Number(form.role_id))?.name || null }]);
      setForm({ name: '', email: '', password: '', role_id: '', phone: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!users) return <div className="loading">Loading…</div>;

  return (
    <div>
      <nav className="navbar">
        <span className="brand">
          James Blinds <span className="brand-sub">Mission Control</span>
        </span>
        <div className="nav-right">
          <Link to="/dashboard" className="btn btn-ghost">Dashboard</Link>
          <Link to="/projects"  className="btn btn-ghost">Projects</Link>
        </div>
      </nav>

      <main className="container">
        <h2>Team Members</h2>

        <form className="create-form" onSubmit={handleCreate}>
          <h3>Add New Member</h3>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role_id" value={form.role_id} onChange={handleChange}>
                <option value="">— No role —</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Adding…' : 'Add Member'}
          </button>
        </form>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="5" className="empty">No team members yet.</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || '—'}</td>
                  <td><span className="badge badge-role">{u.role_name || '—'}</span></td>
                  <td><span className={`badge badge-status badge-${u.active ? 'active' : 'pending'}`}>{u.active ? 'active' : 'inactive'}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
