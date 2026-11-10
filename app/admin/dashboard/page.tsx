'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Message } from '@/lib/types';
import { fallbackCertificates } from '@/lib/queries/certificates';
import { fallbackExperiences } from '@/lib/queries/experiences';
import { fallbackSkills } from '@/lib/queries/skills';

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    projects: 0,
    certificates: fallbackCertificates.length,
    experiences: fallbackExperiences.length,
    skills: fallbackSkills.length,
    messages: 0,
    unread: 0,
  });
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          { count: countProjects },
          { count: countCertificates },
          { count: countExperiences },
          { count: countSkills },
          { count: countMessages },
          { count: countUnread },
          { data: latestMessages },
        ] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('certificates').select('*', { count: 'exact', head: true }),
          supabase.from('experiences').select('*', { count: 'exact', head: true }),
          supabase.from('skills').select('*', { count: 'exact', head: true }),
          supabase.from('messages').select('*', { count: 'exact', head: true }),
          supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
          supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(5),
        ]);

        setCounts({
          projects: countProjects ?? 0,
          certificates: (countCertificates && countCertificates > 0) ? countCertificates : fallbackCertificates.length,
          experiences: (countExperiences && countExperiences > 0) ? countExperiences : fallbackExperiences.length,
          skills: (countSkills && countSkills > 0) ? countSkills : fallbackSkills.length,
          messages: countMessages ?? 0,
          unread: countUnread ?? 0,
        });

        if (latestMessages) {
          setRecentMessages(latestMessages as Message[]);
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      {/* ===== STATS CARDS ===== */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <span>Total Proyek</span>
            <h3>{counts.projects}</h3>
          </div>
          <div className="stat-icon">
            <i className="ri-folder-open-line"></i>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span>Total Sertifikat</span>
            <h3>{counts.certificates}</h3>
          </div>
          <div className="stat-icon">
            <i className="ri-award-line"></i>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span>Total Pengalaman</span>
            <h3>{counts.experiences}</h3>
          </div>
          <div className="stat-icon">
            <i className="ri-time-line"></i>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <span>Pesan Masuk</span>
            <h3>
              {counts.messages}{' '}
              {counts.unread > 0 && (
                <small style={{ fontSize: '0.85rem', color: '#ef4444' }}>
                  ({counts.unread} Baru)
                </small>
              )}
            </h3>
          </div>
          <div className="stat-icon">
            <i className="ri-mail-line"></i>
          </div>
        </div>
      </div>

      {/* ===== QUICK INFO & ACTIONS ===== */}
      <div className="content-card">
        <div className="content-card-header">
          <h2 className="content-card-title">
            <i className="ri-flashlight-line"></i> Akses Cepat Kelola Portfolio
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/admin/projects?action=create" className="btn btn-primary btn-sm">
            <i className="ri-add-line"></i> Tambah Proyek
          </Link>
          <Link href="/admin/certificates?action=create" className="btn btn-primary btn-sm">
            <i className="ri-add-line"></i> Tambah Sertifikat
          </Link>
          <Link href="/admin/skills" className="btn btn-outline btn-sm">
            <i className="ri-star-line"></i> Kelola Skills ({counts.skills})
          </Link>
          <Link href="/admin/experiences" className="btn btn-outline btn-sm">
            <i className="ri-time-line"></i> Kelola Pengalaman
          </Link>
          <Link href="/admin/profile" className="btn btn-outline btn-sm">
            <i className="ri-user-settings-line"></i> Edit Profil & Kontak
          </Link>
        </div>
      </div>

      {/* ===== RECENT MESSAGES TABLE ===== */}
      <div className="content-card">
        <div className="content-card-header">
          <h2 className="content-card-title">
            <i className="ri-message-2-line"></i> Pesan Masuk Terbaru
          </h2>
          <Link href="/admin/messages" className="btn btn-outline btn-sm">
            Lihat Semua Pesan <i className="ri-arrow-right-line"></i>
          </Link>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pengirim</th>
                <th>Email</th>
                <th>Pesan Ringkas</th>
                <th>Waktu</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentMessages.length > 0 ? (
                recentMessages.map((msg) => (
                  <tr key={msg.id}>
                    <td className="strong">{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          maxWidth: '260px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {msg.message}
                      </span>
                    </td>
                    <td>{new Date(msg.created_at).toLocaleDateString('id-ID')}</td>
                    <td>
                      {msg.is_read ? (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Dibaca</span>
                      ) : (
                        <span
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#ef4444',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                          }}
                        >
                          Baru
                        </span>
                      )}
                    </td>
                    <td>
                      <Link
                        href={`/admin/messages?action=view&id=${msg.id}`}
                        className="btn-icon btn-icon-edit"
                        title="Buka Pesan"
                      >
                        <i className="ri-eye-line"></i>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    {loading ? 'Memuat data...' : 'Belum ada pesan masuk dari pengunjung website.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
