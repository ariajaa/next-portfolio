'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Message } from '@/lib/types';

function AdminMessagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const action = searchParams.get('action') || 'list';
  const viewId = searchParams.get('id');

  const [messages, setMessages] = useState<Message[]>([]);
  const [viewMessage, setViewMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMessages(data as Message[]);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Handle Detail View
  useEffect(() => {
    if (action === 'view' && viewId) {
      const fetchDetail = async () => {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('id', viewId)
          .single();

        if (!error && data) {
          setViewMessage(data as Message);

          // Auto-mark as read if unread
          if (!data.is_read) {
            await supabase.from('messages').update({ is_read: true }).eq('id', viewId);
            fetchMessages();
          }
        }
      };
      fetchDetail();
    } else {
      setViewMessage(null);
    }
  }, [action, viewId]);

  const handleMarkRead = async (id: number) => {
    try {
      const { error } = await supabase.from('messages').update({ is_read: true }).eq('id', id);
      if (error) {
        setErr(`Gagal menandai pesan: ${error.message}`);
      } else {
        setMsg('Pesan telah ditandai sudah dibaca.');
        fetchMessages();
      }
    } catch {
      setErr('Terjadi kesalahan sistem.');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Hapus pesan dari '${name}'?`)) return;

    try {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) {
        setErr(`Gagal menghapus pesan: ${error.message}`);
      } else {
        setMsg('Pesan berhasil dihapus.');
        if (action === 'view') {
          router.push('/admin/messages');
        }
        fetchMessages();
      }
    } catch {
      setErr('Terjadi kesalahan saat menghapus pesan.');
    }
  };

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

      {action === 'view' && viewMessage ? (
        /* ===== DETAIL PESAN ===== */
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">
              <i className="ri-mail-open-line"></i> Detail Pesan Masuk
            </h2>
            <Link href="/admin/messages" className="btn btn-outline btn-sm">
              <i className="ri-arrow-left-line"></i> Kembali ke Daftar
            </Link>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '16px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '14px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {viewMessage.name}
                </h3>
                <a
                  href={`mailto:${viewMessage.email}`}
                  style={{ color: 'var(--accent-mint)', fontSize: '0.9rem' }}
                >
                  <i className="ri-mail-line"></i> {viewMessage.email}
                </a>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>
                  <i className="ri-time-line"></i> {new Date(viewMessage.created_at).toLocaleString('id-ID')}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  IP: {viewMessage.ip_address || 'N/A'}
                </span>
              </div>
            </div>

            <div
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                marginBottom: '20px',
              }}
            >
              {viewMessage.message}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href={`mailto:${viewMessage.email}?subject=Re:%20Portfolio%20Contact`}
                className="btn btn-primary btn-sm"
              >
                <i className="ri-reply-line"></i> Balas via Email
              </a>
              <button
                onClick={() => handleDelete(viewMessage.id, viewMessage.name)}
                className="btn btn-outline btn-sm"
                style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
              >
                <i className="ri-delete-bin-line"></i> Hapus Pesan
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ===== DAFTAR PESAN ===== */
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">
              <i className="ri-message-3-line"></i> Kotak Masuk Pesan
            </h2>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Pengirim</th>
                  <th>Email</th>
                  <th>Pesan Ringkas</th>
                  <th>Waktu</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {messages.length > 0 ? (
                  messages.map((item) => (
                    <tr key={item.id} style={{ opacity: item.is_read ? 0.75 : 1 }}>
                      <td>
                        {item.is_read ? (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <i className="ri-check-line"></i> Dibaca
                          </span>
                        ) : (
                          <span
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#ef4444',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            Baru
                          </span>
                        )}
                      </td>
                      <td className="strong">{item.name}</td>
                      <td>
                        <a href={`mailto:${item.email}`} style={{ color: 'var(--accent-mint)' }}>
                          {item.email}
                        </a>
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            maxWidth: '240px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.message}
                        </span>
                      </td>
                      <td>{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            href={`/admin/messages?action=view&id=${item.id}`}
                            className="btn-icon btn-icon-edit"
                            title="Buka Pesan"
                          >
                            <i className="ri-mail-open-line"></i>
                          </Link>
                          {!item.is_read && (
                            <button
                              onClick={() => handleMarkRead(item.id)}
                              className="btn-icon"
                              title="Tandai Sudah Dibaca"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-mint)' }}
                            >
                              <i className="ri-checkbox-circle-line"></i>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="btn-icon btn-icon-delete"
                            title="Hapus"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      {loading ? 'Memuat pesan...' : 'Belum ada pesan yang masuk.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


export default function AdminMessagesPage() {
  return (
    <Suspense fallback={<div className="admin-loading">Memuat halaman...</div>}>
      <AdminMessagesContent />
    </Suspense>
  );
}
