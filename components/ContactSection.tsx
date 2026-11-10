'use client';

import React, { useState } from 'react';
import { Profile } from '../lib/types';

interface ContactSectionProps {
  profile: Profile;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const cleanWhatsapp = profile.whatsapp.replace(/[^0-9]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setFeedback({
          type: 'success',
          text: result.message || 'Pesan Anda berhasil dikirim! Terima kasih telah menghubungi.',
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFeedback({
          type: 'error',
          text: result.message || 'Gagal mengirim pesan. Silakan coba beberapa saat lagi.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        text: 'Terjadi gangguan koneksi jaringan. Coba lagi nanti.',
      });
    } finally {
      setLoading(false);
    }
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
            {feedback && (
              <div
                className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}
                role="status"
                aria-live="polite"
              >
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
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
                ></textarea>
              </div>

              <button type="submit" className="btn-solid" disabled={loading}>
                {loading ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
