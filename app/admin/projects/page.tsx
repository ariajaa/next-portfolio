'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase, getStorageUrl } from '@/lib/supabaseClient';
import { getAuthHeaders } from '@/lib/adminAuth';
import { Project } from '@/lib/types';

function AdminProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const action = searchParams.get('action') || 'list';
  const editId = searchParams.get('id');

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    tech_stack: '',
    description: '',
    demo_url: '',
    github_url: '',
    order_index: 0,
    image_file: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true })
        .order('id', { ascending: false });

      if (!error && data) {
        setProjects(data as Project[]);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // If in edit mode, fetch single project
  useEffect(() => {
    if (action === 'edit' && editId) {
      const fetchSingle = async () => {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', editId)
          .single();

        if (!error && data) {
          setFormData({
            title: data.title || '',
            tech_stack: data.tech_stack || '',
            description: data.description || '',
            demo_url: data.demo_url || '',
            github_url: data.github_url || '',
            order_index: data.order_index || 0,
            image_file: data.image_file || '',
          });
        }
      };
      fetchSingle();
    } else if (action === 'create') {
      setFormData({
        title: '',
        tech_stack: '',
        description: '',
        demo_url: '',
        github_url: '',
        order_index: 0,
        image_file: '',
      });
      setSelectedFile(null);
    }
  }, [action, editId]);

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Hapus proyek '${title}'?`)) return;

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        setErr(`Gagal menghapus proyek: ${error.message}`);
      } else {
        setMsg('Proyek berhasil dihapus.');
        fetchProjects();
      }
    } catch {
      setErr('Terjadi kesalahan saat menghapus proyek.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    setSubmitting(true);

    try {
      let finalImageFile = formData.image_file;

      // Handle image upload if a new file is chosen
      if (selectedFile) {
        const uploadForm = new FormData();
        uploadForm.append('file', selectedFile);
        uploadForm.append('bucket', 'projects');

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: await getAuthHeaders(),
          body: uploadForm,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.success) {
          setErr(uploadJson.message || 'Gagal mengunggah gambar proyek.');
          setSubmitting(false);
          return;
        }
        finalImageFile = uploadJson.fileName;
      }

      if (action === 'edit' && editId) {
        // Update
        const { error } = await supabase
          .from('projects')
          .update({
            title: formData.title.trim(),
            tech_stack: formData.tech_stack.trim(),
            description: formData.description.trim(),
            demo_url: formData.demo_url.trim() || null,
            github_url: formData.github_url.trim() || null,
            order_index: Number(formData.order_index),
            image_file: finalImageFile || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editId);

        if (error) {
          setErr(`Gagal memperbarui proyek: ${error.message}`);
        } else {
          setMsg('Proyek berhasil diperbarui.');
          router.push('/admin/projects');
          fetchProjects();
        }
      } else {
        // Create
        const { error } = await supabase.from('projects').insert({
          title: formData.title.trim(),
          tech_stack: formData.tech_stack.trim(),
          description: formData.description.trim(),
          demo_url: formData.demo_url.trim() || null,
          github_url: formData.github_url.trim() || null,
          order_index: Number(formData.order_index),
          image_file: finalImageFile || null,
        });

        if (error) {
          setErr(`Gagal menambahkan proyek: ${error.message}`);
        } else {
          setMsg('Proyek baru berhasil ditambahkan.');
          router.push('/admin/projects');
          fetchProjects();
        }
      }
    } catch {
      setErr('Terjadi kesalahan sistem saat menyimpan proyek.');
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
        /* ===== FORM TAMBAH / EDIT PROYEK ===== */
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">
              <i className="ri-edit-line"></i> {action === 'edit' ? 'Edit Proyek' : 'Tambah Proyek Baru'}
            </h2>
            <Link href="/admin/projects" className="btn btn-outline btn-sm">
              <i className="ri-arrow-left-line"></i> Kembali ke Daftar
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Judul Proyek *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Contoh: Redesign UI Website Kampus"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Teknologi yang Digunakan *</label>
                <input
                  type="text"
                  name="tech_stack"
                  className="form-control"
                  placeholder="Contoh: Figma, HTML5, CSS3, JavaScript"
                  value={formData.tech_stack}
                  onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Deskripsi Proyek</label>
              <textarea
                name="description"
                className="form-control"
                rows={4}
                placeholder="Jelaskan mengenai tujuan, fitur, dan peran Anda dalam proyek ini..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tautan Live Demo (Opsional)</label>
                <input
                  type="url"
                  name="demo_url"
                  className="form-control"
                  placeholder="https://..."
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tautan Repository / Source Code (Opsional)</label>
                <input
                  type="url"
                  name="github_url"
                  className="form-control"
                  placeholder="https://github.com/..."
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                />
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
              <label className="form-label">Gambar Proyek (JPG, PNG, WebP, Maks 5MB)</label>
              {formData.image_file && (
                <div style={{ marginBottom: '10px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getStorageUrl('projects', formData.image_file) || ''}
                    alt="Thumbnail"
                    style={{
                      maxWidth: '160px',
                      height: 'auto',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                    }}
                  />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Biarkan kosong jika tidak ingin mengubah gambar.
                  </p>
                </div>
              )}
              <input
                type="file"
                name="image"
                className="form-control"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <i className="ri-loader-4-line ri-spin"></i> Menyimpan...
                  </>
                ) : (
                  <>
                    <i className="ri-save-line"></i> Simpan Proyek
                  </>
                )}
              </button>
              <Link href="/admin/projects" className="btn btn-outline">
                Batal
              </Link>
            </div>
          </form>
        </div>
      ) : (
        /* ===== DAFTAR PROYEK ===== */
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">
              <i className="ri-folder-open-line"></i> Daftar Proyek Portofolio
            </h2>
            <Link href="/admin/projects?action=create" className="btn btn-primary btn-sm">
              <i className="ri-add-line"></i> Tambah Proyek Baru
            </Link>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Gambar</th>
                  <th>Judul Proyek</th>
                  <th>Teknologi</th>
                  <th>Tautan</th>
                  <th>Urutan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {projects.length > 0 ? (
                  projects.map((item) => {
                    const imgUrl = getStorageUrl('projects', item.image_file);

                    return (
                      <tr key={item.id}>
                        <td style={{ width: '80px' }}>
                          {imgUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={imgUrl}
                              alt="Thumb"
                              style={{
                                width: '60px',
                                height: '40px',
                                objectFit: 'cover',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No image</span>
                          )}
                        </td>
                        <td className="strong">{item.title}</td>
                        <td>
                          <span style={{ color: 'var(--accent-mint)', fontSize: '0.85rem' }}>
                            {item.tech_stack}
                          </span>
                        </td>
                        <td>
                          {item.demo_url && (
                            <a
                              href={item.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--accent-mint)', marginRight: '6px' }}
                              title="Demo"
                            >
                              <i className="ri-external-link-line"></i>
                            </a>
                          )}
                          {item.github_url && (
                            <a
                              href={item.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--text-secondary)' }}
                              title="Repo"
                            >
                              <i className="ri-github-line"></i>
                            </a>
                          )}
                        </td>
                        <td>{item.order_index}</td>
                        <td>
                          <div className="action-buttons">
                            <Link
                              href={`/admin/projects?action=edit&id=${item.id}`}
                              className="btn-icon btn-icon-edit"
                              title="Edit"
                            >
                              <i className="ri-pencil-line"></i>
                            </Link>
                            <button
                              onClick={() => handleDelete(item.id, item.title)}
                              className="btn-icon btn-icon-delete"
                              title="Hapus"
                              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                      <i
                        className="ri-folder-add-line"
                        style={{ fontSize: '2rem', display: 'block', marginBottom: '8px', color: 'var(--accent-mint)' }}
                      ></i>
                      {loading
                        ? 'Memuat data proyek...'
                        : 'Belum ada proyek yang ditambahkan. Klik tombol "Tambah Proyek Baru" di atas untuk menambahkan portofolio Anda.'}
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


export default function AdminProjectsPage() {
  return (
    <Suspense fallback={<div className="admin-loading">Memuat halaman...</div>}>
      <AdminProjectsContent />
    </Suspense>
  );
}
