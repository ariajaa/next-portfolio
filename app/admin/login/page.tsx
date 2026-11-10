'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/lib/adminAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginAdmin(username, password);
      if (result.success) {
        router.push('/admin/dashboard');
      } else {
        setError(result.message || 'Username atau password salah.');
      }
    } catch {
      setError('Terjadi kesalahan saat proses login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body">
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              JNS<span>.</span>
            </div>
            <h1>Admin Portal</h1>
            <p>Masuk untuk mengelola portfolio Anda</p>
          </div>

          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                Username / Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                placeholder="Masukkan username atau email admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  aria-pressed={showPassword}
                >
                  {showPassword ? 'Sembunyikan' : 'Lihat'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
            </button>
          </form>

          <div className="login-footer">
            <Link href="/">Kembali ke Portfolio</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
