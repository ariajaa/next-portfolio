'use client';

import React, { useState, useRef } from 'react';
import { Comment, Profile } from '../lib/types';

interface ContactSectionProps {
  profile: Profile;
  comments: Comment[];
  commentsEnabled: boolean;
}

type IconName = 'instagram' | 'github' | 'whatsapp' | 'mail' | 'pin' | 'arrow';

const ICONS: Record<IconName, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  github: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.35 4.7-4.58 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
    />
  ),
  whatsapp: (
    <>
      <path d="M21 11.5A8.5 8.5 0 0 1 8.4 19L3 21l2.1-5.3A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8.8 8.6c.3-.6.6-.6.9-.6h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.2-.2.3 0 .6.4.6 1 1.2 1.7 1.6.3.2.5.1.6 0l.5-.6c.2-.2.4-.2.6-.1l1.5.7c.2.1.4.2.4.4 0 .3-.1 1-.5 1.3-.4.4-.9.6-1.6.5-1.9-.3-3.6-1.6-4.6-3.4-.4-.7-.6-1.4-.5-2 0-.5.2-1 .3-1.2Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  arrow: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
};

function Icon({ name }: { name: IconName }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function relativeTime(iso: string) {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatWhatsapp(value: string) {
  const digits = value.replace(/[^0-9]/g, '');
  const local = digits.startsWith('62') ? digits.slice(2) : digits;
  const grouped = local.replace(/^(\d{3})(\d{3,4})(\d{3,})/, '$1-$2-$3');
  return `+${digits.startsWith('62') ? '62 ' : ''}${grouped}`;
}

export default function ContactSection({ profile, comments, commentsEnabled }: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const [commentList, setCommentList] = useState<Comment[]>(comments);
  const [commentForm, setCommentForm] = useState({ name: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [commentSending, setCommentSending] = useState(false);
  const [commentStatus, setCommentStatus] = useState('');
  const [commentFailed, setCommentFailed] = useState(false);

  const cleanWhatsapp = profile.whatsapp.replace(/[^0-9]/g, '');

  const socials = [
    {
      label: 'Instagram',
      handle: '@junnajaa_',
      href: 'https://www.instagram.com/junnajaa_/',
      icon: 'instagram' as const,
    },
    { label: 'GitHub', handle: 'ariajaa', href: 'https://github.com/ariajaa', icon: 'github' as const },
    {
      label: 'WhatsApp',
      handle: formatWhatsapp(profile.whatsapp),
      href: `https://wa.me/${cleanWhatsapp}`,
      icon: 'whatsapp' as const,
    },
    { label: 'Email', handle: profile.email, href: `mailto:${profile.email}`, icon: 'mail' as const },
  ];

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

  const clearPhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview(null);
  };

  const onPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setCommentFailed(false);
    setCommentStatus('');

    if (file && file.size > 5 * 1024 * 1024) {
      event.target.value = '';
      clearPhoto();
      setCommentFailed(true);
      setCommentStatus('Ukuran foto maksimal 5 MB.');
      return;
    }

    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentSending(true);
    setCommentStatus('');
    setCommentFailed(false);

    try {
      const body = new FormData();
      body.append('name', commentForm.name);
      body.append('message', commentForm.message);
      body.append('website', honeypot);
      if (photo) body.append('photo', photo);

      const res = await fetch('/api/comments', { method: 'POST', body });
      const result = await res.json();

      if (res.ok && result.success && result.comment) {
        setCommentList((current) => [result.comment as Comment, ...current]);
        setCommentForm({ name: '', message: '' });
        clearPhoto();
        setCommentStatus('Komentar terkirim. Terima kasih sudah mampir.');
      } else {
        setCommentFailed(true);
        setCommentStatus(result.message || 'Komentar gagal dikirim. Coba lagi nanti.');
      }
    } catch {
      setCommentFailed(true);
      setCommentStatus('Terjadi gangguan koneksi jaringan. Coba lagi nanti.');
    } finally {
      setCommentSending(false);
    }
  };

  return (
    <section className="section" id="contact">
      <div className="shell">
        <header className="section-head">
          <p className="section-label">Get In Touch</p>
          <div className="section-head-main">
            <h2>Hubungi Saya</h2>
            <p className="section-sub">
              Tertarik untuk berkolaborasi, diskusi proyek, atau memiliki pertanyaan? Jangan ragu mengirim pesan.
            </p>
          </div>
        </header>

        <div className="contact-grid">
          <div className="contact-intro">
            <h3>Mari Terhubung!</h3>
            <p>
              Saya terbuka untuk kesempatan kerja sama, proyek kolaboratif, maupun diskusi seputar teknologi dan
              desain.
            </p>

            <div className="alert-slot" role="status" aria-live="polite">
              {status !== 'idle' && (
                <div className={`alert alert-${status}`}>
                  <span className="alert-icon" aria-hidden="true">
                    {status === 'success' ? '✓' : '!'}
                  </span>
                  <div className="alert-body">
                    <strong>{status === 'success' ? 'Terima kasih!' : 'Terjadi Kesalahan'}</strong>
                    <p>{statusMessage}</p>
                    <div className="alert-actions">
                      <button type="button" className="link-plain" onClick={dismissStatus}>
                        Tutup
                      </button>
                      {status === 'error' && (
                        <>
                          <a href={`mailto:${profile.email}`} className="link-plain">
                            Email Langsung
                          </a>
                          <a
                            href={`https://wa.me/${cleanWhatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-plain"
                          >
                            WhatsApp
                          </a>
                        </>
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
                </div>
              )}
            </div>

            <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
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
                Data yang dikirim akan disimpan ke database. Jika layanan belum aktif, tombol akan menawarkan opsi
                email/WhatsApp.
              </p>
            </form>

            <div className="find-me">
              <p className="find-me-label">Find Me</p>
              <ul className="social-list">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      className="social-card"
                      href={social.href}
                      target={social.icon === 'mail' ? undefined : '_blank'}
                      rel={social.icon === 'mail' ? undefined : 'noopener noreferrer'}
                    >
                      <span className="social-icon">
                        <Icon name={social.icon} />
                      </span>
                      <span className="social-meta">
                        <span className="social-name">{social.label}</span>
                        <span className="social-handle">{social.handle}</span>
                      </span>
                      <Icon name="arrow" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="social-place">
                <Icon name="pin" />
                {profile.domicile}
              </p>
            </div>
          </div>

          <div className="comments" aria-labelledby="comments-heading">
            <div className="comments-head">
              <h3 id="comments-heading">Komentar</h3>
              {commentList.length > 0 && <span className="comment-count">{commentList.length}</span>}
            </div>

            {commentsEnabled ? (
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <div className="field">
                  <label htmlFor="comment-name">Nama</label>
                  <input
                    type="text"
                    id="comment-name"
                    name="name"
                    placeholder="Masukkan nama kamu"
                    required
                    minLength={2}
                    maxLength={50}
                    value={commentForm.name}
                    onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                    disabled={commentSending}
                  />
                </div>

                <div className="field">
                  <label htmlFor="comment-message">Komentar</label>
                  <textarea
                    id="comment-message"
                    name="message"
                    placeholder="Tulis komentar kamu di sini..."
                    required
                    minLength={2}
                    maxLength={500}
                    rows={4}
                    value={commentForm.message}
                    onChange={(e) => setCommentForm({ ...commentForm, message: e.target.value })}
                    disabled={commentSending}
                  ></textarea>
                </div>

                <div className="field">
                  <label htmlFor="comment-photo">Foto Profil (opsional)</label>
                  <div className="file-control">
                    <span className="file-trigger">Pilih foto</span>
                    <span className="file-name">{photo ? photo.name : 'Tidak ada berkas dipilih'}</span>
                    <input
                      id="comment-photo"
                      type="file"
                      name="photo"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={onPhotoChange}
                      disabled={commentSending}
                    />
                  </div>
                  <p className="upload-note">Ukuran file maksimal 5 MB. Format JPG, PNG, atau WebP.</p>
                  {photoPreview && (
                    <div className="upload-preview">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photoPreview} alt="Pratinjau foto profil" width={48} height={48} />
                      <span>{photo?.name}</span>
                      <button type="button" className="link-plain" onClick={clearPhoto}>
                        Batalkan
                      </button>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  name="website"
                  className="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />

                <button type="submit" className="btn-solid" disabled={commentSending}>
                  {commentSending && <span className="btn-spinner" aria-hidden="true" />}
                  {commentSending ? 'Mengirim...' : 'Kirim Komentar'}
                </button>
                <p
                  className={`comment-status${commentFailed ? ' is-error' : ''}`}
                  role="status"
                  aria-live="polite"
                >
                  {commentStatus || 'Komentar tampil setelah terkirim dan tidak dapat dihapus sendiri.'}
                </p>
              </form>
            ) : (
              <p className="comments-off">
                Kolom komentar aktif setelah kredensial Supabase diisi. Sementara itu, silakan gunakan email
                atau WhatsApp.
              </p>
            )}

            {commentList.length > 0 ? (
              <div className="comment-list" tabIndex={0} aria-label="Daftar komentar">
                {commentList.map((comment) => (
                  <article key={comment.id} className="comment">
                    {comment.photo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        className="comment-avatar"
                        src={comment.photo_url}
                        alt={`Foto ${comment.name}`}
                        width={40}
                        height={40}
                        loading="lazy"
                      />
                    ) : (
                      <span className="comment-avatar comment-avatar-initial" aria-hidden="true">
                        {initials(comment.name)}
                      </span>
                    )}
                    <div className="comment-body">
                      <div className="comment-head">
                        <strong>{comment.name}</strong>
                        <time dateTime={comment.created_at}>{relativeTime(comment.created_at)}</time>
                      </div>
                      <p>{comment.message}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : commentsEnabled ? (
              <div className="comment-empty">
                <Icon name="mail" />
                <p>Belum ada komentar. Ruang ini terbuka untuk pesan singkat dari pengunjung.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
