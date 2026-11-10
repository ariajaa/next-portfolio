'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Experience } from '@/lib/types';
import { fallbackExperiences } from '@/lib/queries/experiences';

const EXP_TYPES = ['Organisasi', 'Pekerjaan', 'Pendidikan'];

function AdminExperiencesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const action = searchParams.get('action') || 'list';
  const editId = searchParams.get('id');

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const [formData, setFormData] = useState({
    role: '',
    organization: '',
    period: '',
    type: 'Organisasi',
    description: '',
    order_index: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('order_index', { ascending: true })
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        setExperiences(data as Experience[]);
      } else {
        setExperiences(fallbackExperiences);
      }
    } catch {
      setExperiences(fallbackExperiences);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    if (action === 'edit' && editId) {
      const fetchSingle = async () => {
        const { data } = await supabase
          .from('experiences')
          .select('*')
          .eq('id', editId)
          .single();

        if (data) {
          setFormData({
            role: data.role || '',
            organization: data.organization || '',
            period: data.period || '',
            type: data.type || 'Organisasi',
            description: data.description || '',
            order_index: data.order_index || 0,
          });
        }
      };
      fetchSingle();
    } else if (action === 'create') {
      setFormData({
        role: '',
        organization: '',
        period: '',
        type: 'Organisasi',
        description: '',
        order_index: 0,
      });
    }
  }, [action, editId]);

  const handleDelete = async (id: number, role: string) => {
    if (!window.confirm(`Hapus pengalaman '${role}'?`)) return;

    try {
      const { error } = await supabase.from('experiences').delete().eq('id', id);
      if (error) {
        setErr(`Gagal menghapus pengalaman: ${error.message}`);
      } else {
        setMsg('Pengalaman berhasil dihapus.');
        fetchExperiences();
      }
    } catch {
      setErr('Terjadi kesalahan saat menghapus pengalaman.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    setSubmitting(true);

    try {
      if (action === 'edit' && editId) {
        const { error } = await supabase
          .from('experiences')
          .update({
            role: formData.role.trim(),
            organization: formData.organization.trim(),
            period: formData.period.trim(),
            type: formData.type,
            description: formData.description.trim(),
            order_index: Number(formData.order_index),
          })
          .eq('id', editId);

        if (error) {
          setErr(`Gagal memperbarui pengalaman: ${error.message}`);
        } else {
          setMsg('Pengalaman berhasil diperbarui.');
          router.push('/admin/experiences');
          fetchExperiences();
        }
      } else {
        const { error } = await supabase.from('experiences').insert({
          role: formData.role.trim(),
          organization: formData.organization.trim(),
          period: formData.period.trim(),
          type: formData.type,
          description: formData.description.trim(),
          order_index: Number(formData.order_index),
        });

        if (error) {
          setErr(`Gagal menambahkan pengalaman: ${error.message}`);
        } else {
          setMsg('Pengalaman baru berhasil ditambahkan.');
          router.push('/admin/experiences');
          fetchExperiences();
        }
      }
    } catch {
      setErr('Terjadi kesalahan saat menyimpan data pengalaman.');
    } finally {
      setSubmitting(false);
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

      {action === 'create' || action === 'edit' ? (
        /* ===== FORM TAMBAH / EDIT PENGALAMAN ===== */
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">
              <i className="ri-edit-line"></i> {action === 'edit' ? 'Edit Pengalaman' : 'Tambah Pengalaman Baru'}
            </h2>
            <Link href="/admin/experiences" className="btn btn-outline btn-sm">
              <i className="ri-arrow-left-line"></i> Kembali
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Posisi / Peran *</label>
                <input
                  type="text"
                  name="role"
                  className="form-control"
                  placeholder="Contoh: Anggota Aktif / Staf Operasional"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lembaga / Organisasi / Perusahaan *</label>
                <input
                  type="text"
                  name="organization"
                  className="form-control"
                  placeholder="Contoh: BEM Fakultas Teknik dan Informatika"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Periode / Tahun *</label>
                <input
                  type="text"
                  name="period"
                  className="form-control"
                  placeholder="Contoh: 2023 - Sekarang"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tipe Pengalaman</label>
                <select
                  name="type"
                  className="form-control"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  {EXP_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Urutan Tampil</label>
                <input
                  type="number"
                  name="order_index"
                  className="form-control"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) })}
                  min={0}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Deskripsi Pengalaman</label>
              <textarea
                name="description"
                className="form-control"
                rows={4}
                placeholder="Jelaskan peran, tanggung jawab, dan kontribusi Anda..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <i className="ri-loader-4-line ri-spin"></i> Menyimpan...
                  </>
                ) : (
                  <>
                    <i className="ri-save-line"></i> Simpan
                  </>
                )}
              </button>
              <Link href="/admin/experiences" className="btn btn-outline">
                Batal
              </Link>
            </div>
          </form>
        </div>
      ) : (
        /* ===== DAFTAR PENGALAMAN ===== */
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">
              <i className="ri-time-line"></i> Daftar Pengalaman & Karir
            </h2>
            <Link href="/admin/experiences?action=create" className="btn btn-primary btn-sm">
              <i className="ri-add-line"></i> Tambah Pengalaman Baru
            </Link>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Posisi / Peran</th>
                  <th>Lembaga / Organisasi</th>
                  <th>Periode</th>
                  <th>Tipe</th>
                  <th>Urutan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {experiences.length > 0 ? (
                  experiences.map((exp) => (
                    <tr key={exp.id}>
                      <td className="strong">{exp.role}</td>
                      <td>{exp.organization}</td>
                      <td>{exp.period}</td>
                      <td>
                        <span
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                          }}
                        >
                          {exp.type}
                        </span>
                      </td>
                      <td>{exp.order_index}</td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            href={`/admin/experiences?action=edit&id=${exp.id}`}
                            className="btn-icon btn-icon-edit"
                            title="Edit"
                          >
                            <i className="ri-pencil-line"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(exp.id, exp.role)}
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
                      {loading ? 'Memuat data pengalaman...' : 'Belum ada data pengalaman.'}
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


export default function AdminExperiencesPage() {
  return (
    <Suspense fallback={<div className="admin-loading">Memuat halaman...</div>}>
      <AdminExperiencesContent />
    </Suspense>
  );
}
