'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Skill } from '@/lib/types';
import { fallbackSkills } from '@/lib/queries/skills';

const CATEGORIES = [
  'Programming',
  'Frontend',
  'Mobile',
  'Backend',
  'Database',
  'Tools',
  'AI',
];

function AdminSkillsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const action = searchParams.get('action') || 'list';
  const editId = searchParams.get('id');

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming',
    icon_class: 'ri-checkbox-circle-line',
    order_index: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('order_index', { ascending: true })
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        setSkills(data as Skill[]);
      } else {
        setSkills(fallbackSkills);
      }
    } catch {
      setSkills(fallbackSkills);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (action === 'edit' && editId) {
      const fetchSingle = async () => {
        const { data } = await supabase
          .from('skills')
          .select('*')
          .eq('id', editId)
          .single();

        if (data) {
          setFormData({
            name: data.name || '',
            category: data.category || 'Design & Creative',
            icon_class: data.icon_class || 'ri-checkbox-circle-line',
            order_index: data.order_index || 0,
          });
        }
      };
      fetchSingle();
    } else if (action === 'create') {
      setFormData({
        name: '',
        category: 'Design & Creative',
        icon_class: 'ri-checkbox-circle-line',
        order_index: 0,
      });
    }
  }, [action, editId]);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Hapus keahlian '${name}'?`)) return;

    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) {
        setErr(`Gagal menghapus skill: ${error.message}`);
      } else {
        setMsg('Skill berhasil dihapus.');
        fetchSkills();
      }
    } catch {
      setErr('Terjadi kesalahan saat menghapus skill.');
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
          .from('skills')
          .update({
            name: formData.name.trim(),
            category: formData.category,
            icon_class: formData.icon_class.trim(),
            order_index: Number(formData.order_index),
          })
          .eq('id', editId);

        if (error) {
          setErr(`Gagal memperbarui skill: ${error.message}`);
        } else {
          setMsg('Skill berhasil diperbarui.');
          router.push('/admin/skills');
          fetchSkills();
        }
      } else {
        const { error } = await supabase.from('skills').insert({
          name: formData.name.trim(),
          category: formData.category,
          icon_class: formData.icon_class.trim(),
          order_index: Number(formData.order_index),
        });

        if (error) {
          setErr(`Gagal menambahkan skill: ${error.message}`);
        } else {
          setMsg('Skill baru berhasil ditambahkan.');
          router.push('/admin/skills');
          fetchSkills();
        }
      }
    } catch {
      setErr('Terjadi kesalahan saat menyimpan data skill.');
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
        /* ===== FORM TAMBAH / EDIT SKILL ===== */
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">
              <i className="ri-edit-line"></i> {action === 'edit' ? 'Edit Skill' : 'Tambah Skill Baru'}
            </h2>
            <Link href="/admin/skills" className="btn btn-outline btn-sm">
              <i className="ri-arrow-left-line"></i> Kembali
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nama Skill / Keahlian *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Contoh: Figma, Canva, Teamwork"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Remix Icon Class</label>
                <input
                  type="text"
                  name="icon_class"
                  className="form-control"
                  placeholder="ri-pencil-ruler-2-line"
                  value={formData.icon_class}
                  onChange={(e) => setFormData({ ...formData, icon_class: e.target.value })}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  Gunakan class ikon dari Remix Icon (contoh: ri-pencil-ruler-2-line, ri-palette-line, ri-team-line).
                </small>
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
              <Link href="/admin/skills" className="btn btn-outline">
                Batal
              </Link>
            </div>
          </form>
        </div>
      ) : (
        /* ===== DAFTAR SKILLS ===== */
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">
              <i className="ri-star-line"></i> Daftar Kemampuan & Keahlian
            </h2>
            <Link href="/admin/skills?action=create" className="btn btn-primary btn-sm">
              <i className="ri-add-line"></i> Tambah Skill Baru
            </Link>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ikon</th>
                  <th>Nama Keahlian</th>
                  <th>Kategori</th>
                  <th>Urutan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {skills.length > 0 ? (
                  skills.map((s) => (
                    <tr key={s.id}>
                      <td style={{ width: '50px' }}>
                        <i
                          className={s.icon_class || 'ri-checkbox-circle-line'}
                          style={{ fontSize: '1.4rem', color: 'var(--accent-mint)' }}
                        ></i>
                      </td>
                      <td className="strong">{s.name}</td>
                      <td>
                        <span
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                          }}
                        >
                          {s.category}
                        </span>
                      </td>
                      <td>{s.order_index}</td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            href={`/admin/skills?action=edit&id=${s.id}`}
                            className="btn-icon btn-icon-edit"
                            title="Edit"
                          >
                            <i className="ri-pencil-line"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(s.id, s.name)}
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
                    <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      {loading ? 'Memuat data skills...' : 'Belum ada data skill.'}
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


export default function AdminSkillsPage() {
  return (
    <Suspense fallback={<div className="admin-loading">Memuat halaman...</div>}>
      <AdminSkillsContent />
    </Suspense>
  );
}
