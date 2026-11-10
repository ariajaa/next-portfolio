'use client';

import React, { useState, useEffect } from 'react';
import { supabase, getStorageUrl } from '@/lib/supabaseClient';
import { getAuthHeaders } from '@/lib/adminAuth';
import { fallbackProfile } from '@/lib/queries/profile';
import { Profile } from '@/lib/types';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingSecurity, setSubmittingSecurity] = useState(false);

  // Profile upload files
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Security form state
  const [securityData, setSecurityData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .single();

      if (!error && data) {
        setProfile(data as Profile);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    setSubmittingProfile(true);

    try {
      let finalPhoto = profile.photo_file;
      let finalCv = profile.cv_file;

      // Handle photo upload
      if (photoFile) {
        const photoForm = new FormData();
        photoForm.append('file', photoFile);
        photoForm.append('bucket', 'profile');

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: await getAuthHeaders(),
          body: photoForm,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.success) {
          setErr(uploadJson.message || 'Gagal mengunggah foto profil.');
          setSubmittingProfile(false);
          return;
        }
        finalPhoto = uploadJson.fileName;
      }

      // Handle CV upload
      if (cvFile) {
        const cvForm = new FormData();
        cvForm.append('file', cvFile);
        cvForm.append('bucket', 'files');

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: await getAuthHeaders(),
          body: cvForm,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.success) {
          setErr(uploadJson.message || 'Gagal mengunggah file CV.');
          setSubmittingProfile(false);
          return;
        }
        finalCv = uploadJson.fileName;
      }

      const { error } = await supabase
        .from('profile')
        .update({
          full_name: profile.full_name.trim(),
          role_title: profile.role_title.trim(),
          hero_subtitle: profile.hero_subtitle.trim(),
          about_description: profile.about_description.trim(),
          education: profile.education.trim(),
          domicile: profile.domicile.trim(),
          interests: profile.interests.trim(),
          email: profile.email.trim(),
          whatsapp: profile.whatsapp.trim(),
          photo_file: finalPhoto,
          cv_file: finalCv,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id || 1);

      if (error) {
        setErr(`Gagal memperbarui profil: ${error.message}`);
      } else {
        setMsg('Profil dan informasi kontak berhasil diperbarui.');
        fetchProfileData();
      }
    } catch {
      setErr('Terjadi kesalahan sistem saat menyimpan profil.');
    } finally {
      setSubmittingProfile(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setErr('');

    if (securityData.newPassword.length < 6) {
      setErr('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      setErr('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setSubmittingSecurity(true);

    try {
      // Update password via Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: securityData.newPassword,
      });

      if (error) {
        setErr(`Gagal mengubah kata sandi: ${error.message}`);
      } else {
        setMsg('Kata sandi admin berhasil diperbarui.');
        setSecurityData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch {
      setErr('Terjadi kesalahan saat memperbarui kata sandi.');
    } finally {
      setSubmittingSecurity(false);
    }
  };

  const currentPhotoUrl =
    getStorageUrl('profile', profile.photo_file) ||
    '/assets/uploads/profile/WhatsApp%20Image%202026-11-04%20at%2001.19.34.jpeg';

  return (
    <div>
      {msg && (
        <div className="alert alert-success">
          <i className="ri-checkbox-circle-line"></i> {msg}
        </div>
      )}

      {err && (
        <div className="alert alert-error">
          <i className="ri-error-warning-line"></i> {err}
        </div>
      )}

      {/* FORM 1: DATA PROFIL & KONTAK */}
      <div className="content-card">
        <div className="content-card-header">
          <h2 className="content-card-title">
            <i className="ri-user-settings-line"></i> Pengaturan Profil & Kontak
          </h2>
        </div>

        <form onSubmit={handleProfileSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nama Lengkap *</label>
              <input
                type="text"
                name="full_name"
                className="form-control"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Peran / Role Title *</label>
              <input
                type="text"
                name="role_title"
                className="form-control"
                value={profile.role_title}
                onChange={(e) => setProfile({ ...profile, role_title: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Subtitle Hero Section *</label>
            <textarea
              name="hero_subtitle"
              className="form-control"
              rows={3}
              value={profile.hero_subtitle}
              onChange={(e) => setProfile({ ...profile, hero_subtitle: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi Tentang Saya *</label>
            <textarea
              name="about_description"
              className="form-control"
              rows={4}
              value={profile.about_description}
              onChange={(e) => setProfile({ ...profile, about_description: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Riwayat Pendidikan *</label>
              <input
                type="text"
                name="education"
                className="form-control"
                value={profile.education}
                onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Domisili *</label>
              <input
                type="text"
                name="domicile"
                className="form-control"
                value={profile.domicile}
                onChange={(e) => setProfile({ ...profile, domicile: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Minat & Ketertarikan *</label>
            <input
              type="text"
              name="interests"
              className="form-control"
              value={profile.interests}
              onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Resmi *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nomor WhatsApp (Contoh: 6281234567890) *</label>
              <input
                type="text"
                name="whatsapp"
                className="form-control"
                value={profile.whatsapp}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Foto Profil (JPG / PNG)</label>
              {currentPhotoUrl && (
                <div style={{ marginBottom: '10px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentPhotoUrl}
                    alt="Foto Profil"
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--accent-mint)',
                    }}
                  />
                </div>
              )}
              <input
                type="file"
                name="photo"
                className="form-control"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                Biarkan kosong jika tidak ingin mengubah foto profil.
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Dokumen CV (PDF)</label>
              {profile.cv_file && (
                <div style={{ marginBottom: '10px', fontSize: '0.85rem', color: 'var(--accent-mint)' }}>
                  <i className="ri-file-pdf-line"></i> File saat ini: {profile.cv_file}
                </div>
              )}
              <input
                type="file"
                name="cv"
                className="form-control"
                accept="application/pdf"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                Biarkan kosong jika tidak ingin mengubah file CV.
              </small>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <button type="submit" className="btn btn-primary" disabled={submittingProfile}>
              {submittingProfile ? (
                <>
                  <i className="ri-loader-4-line ri-spin"></i> Menyimpan...
                </>
              ) : (
                <>
                  <i className="ri-save-line"></i> Simpan Perubahan Profil
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* FORM 2: KEAMANAN AKUN ADMIN */}
      <div className="content-card">
        <div className="content-card-header">
          <h2 className="content-card-title">
            <i className="ri-shield-keyhole-line"></i> Keamanan & Kata Sandi Admin
          </h2>
        </div>

        <form onSubmit={handleSecuritySubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Kata Sandi Baru</label>
              <input
                type="password"
                className="form-control"
                placeholder="Minimal 6 karakter"
                value={securityData.newPassword}
                onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Konfirmasi Kata Sandi Baru</label>
              <input
                type="password"
                className="form-control"
                placeholder="Ulangi kata sandi baru"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary" disabled={submittingSecurity}>
              {submittingSecurity ? (
                <>
                  <i className="ri-loader-4-line ri-spin"></i> Memperbarui...
                </>
              ) : (
                <>
                  <i className="ri-lock-password-line"></i> Perbarui Kata Sandi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
