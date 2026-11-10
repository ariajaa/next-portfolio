'use client';

import React, { useState, useRef } from 'react';
import { Profile } from '../lib/types';

interface ContactSectionProps {
  profile: Profile;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const cleanWhatsapp = profile.whatsapp.replace(/[^0-9]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setStatusMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setStatus('success');
        setStatusMessage(result.message || 'Pesan Anda berhasil dikirim! Terima kasih telah menghubungi.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setStatusMessage(result.message || 'Gagal mengirim pesan. Silakan coba beberapa saat lagi.');
      }
    } catch {
      setStatus('error');
      setStatusMessage('Terjadi gangguan koneksi jaringan. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const dismissStatus = () => {
    setStatus('idle');
    setStatusMessage('');
  };

  return (
    <section className="section" id="contact">
      <div className="shell">
        <header className="section-head" data-reveal>
          <p className="section-label">Get In Touch</p>
          <div className="section-head-main">
            <h2>Hubungi Saya</h2>
            <p className="section-sub">
              Tertarik untuk berkolaborasi, diskusi proyek, atau memiliki pertanyaan? Jangan ragu mengirim pesan.
            </p>
          </div>
        </header>

        <div className="contact-grid">
          <div className="contact-intro" data-reveal>
            <h3>Mari Terhubung!</h3>
            <p>
              Saya terbuka untuk kesempatan kerja sama, proyek kolaboratif, maupun diskusi seputar teknologi dan desain. Hubungi melalui kanal berikut:
            </p>

            <dl className="contact-list">
              <div>
                <dt>Email Resmi</dt>
                <dd>
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </dd>
              </div>
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a href={`https://wa.me/${cleanWhatsapp}`} target="_blank" rel="noopener noreferrer">
                    +{profile.whatsapp}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Lokasi</dt>
                <dd>{profile.domicile}</dd>
              </div>
            </dl>
          </div>

          <div className="contact-form" data-reveal>
            <div
              className="alert-slot"
              role="status"
              aria-live="polite"
            >
              {status !== 'idle' && (
                <div className={`alert alert-${status}`}>
                  <span className="alert-icon" aria-hidden="true">
                    {status === 'success' ? '✓' : '!'}
                  </span>
                  <div className="alert-body">
                    <strong>{status === 'success' ? 'Terima kasih!' : 'Terjadi Kesalahan'}</strong>
                    <p>{statusMessage}</p>
                  </div>
                  <div className="alert-actions">
                    <button type="button" className="link-plain" onClick={dismissStatus}>
                      Tutup
                    </button>
                    {status === 'error' && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="link-plain"
                      >
                        Email Langsung
                      </a>
                    )}
                    {status === 'success' && (
                      <a
                        href={`https://wa.me/${cleanWhatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-plain"
                      >
                        Lanjut ke WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name">Nama Lengkap</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Masukkan nama lengkap Anda"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="field">
                <label htmlFor="email">Alamat Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="nama@email.com"
                  required
                  maxLength={100}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="field">
                <label htmlFor="message">Pesan</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tuliskan pesan Anda di sini..."
                  required
                  maxLength={3000}
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  disabled={loading}
                ></textarea>
              </div>

              <button type="submit" className="btn-solid" disabled={loading}>
                {loading && <span className="btn-spinner" aria-hidden="true" />}
                {loading ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
              <p className="form-status" aria-live="off">
                Data yang dikirim akan disimpan ke database. Jika layanan belum aktif, tombol akan menawarkan opsi email/WhatsApp.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}