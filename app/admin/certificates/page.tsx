'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase, getStorageUrl } from '@/lib/supabaseClient';
import { getAuthHeaders } from '@/lib/adminAuth';
import { Certificate } from '@/lib/types';
import { fallbackCertificates } from '@/lib/queries/certificates';

function AdminCertificatesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const action = searchParams.get('action') || 'list';
  const editId = searchParams.get('id');

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    year: '',
    order_index: 0,
    image_file: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('order_index', { ascending: true })
        .order('id', { ascending: false });

      if (!error && data && data.length > 0) {
        setCertificates(data as Certificate[]);
      } else {
        setCertificates(fallbackCertificates);
      }
    } catch {
      setCertificates(fallbackCertificates);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    if (action === 'edit' && editId) {
      const fetchSingle = async () => {
        const { data } = await supabase
          .from('certificates')
          .select('*')
          .eq('id', editId)
          .single();

        if (data) {
          setFormData({
            title: data.title || '',
            issuer: data.issuer || '',
            year: data.year || '',
            order_index: data.order_index || 0,
            image_file: data.image_file || '',
          });
        }
      };
      fetchSingle();
    } else if (action === 'create') {
      setFormData({
        title: '',
        issuer: '',
        year: '',
        order_index: 0,
        image_file: '',
      });
      setSelectedFile(null);
    }
  }, [action, editId]);

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Hapus sertifikat '${title}'?`)) return;

    try {
      const { error } = await supabase.from('certificates').delete().eq('id', id);
      if (error) {
        setErr(`Gagal menghapus sertifikat: ${error.message}`);
      } else {
        setMsg('Sertifikat berhasil dihapus.');
        fetchCertificates();
      }
    } catch {
      setErr('Terjadi kesalahan saat menghapus sertifikat.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    setSubmitting(true);

    try {
      let finalImageFile = formData.image_file;

      if (selectedFile) {
        const uploadForm = new FormData();
        uploadForm.append('file', selectedFile);
        uploadForm.append('bucket', 'certificates');

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: await getAuthHeaders(),
          body: uploadForm,
        });

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.success) {
          setErr(uploadJson.message || 'Gagal mengunggah file sertifikat.');
          setSubmitting(false);
          return;
        }
        finalImageFile = uploadJson.fileName;
      }

      if (action === 'edit' && editId) {
        const { error } = await supabase
          .from('certificates')
          .update({
            title: formData.title.trim(),
            issuer: formData.issuer.trim(),
            year: formData.year.trim(),
            order_index: Number(formData.order_index),
            image_file: finalImageFile || null,
          })
          .eq('id', editId);

        if (error) {
          setErr(`Gagal memperbarui sertifikat: ${error.message}`);
        } else {
          setMsg('Sertifikat berhasil diperbarui.');
          router.push('/admin/certificates');
          fetchCertificates();
        }
      } else {
        const { error } = await supabase.from('certificates').insert({
          title: formData.title.trim(),
          issuer: formData.issuer.trim(),
          year: formData.year.trim(),
          order_index: Number(formData.order_index),
          image_file: finalImageFile || null,
        });

        if (error) {
          setErr(`Gagal menambahkan sertifikat: ${error.message}`);
        } else {
          setMsg('Sertifikat baru berhasil ditambahkan.');
          router.push('/admin/certificates');
          fetchCertificates();
        }
      }
    } catch {
      setErr('Terjadi kesalahan saat menyimpan data sertifikat.');
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
        /* ===== FORM TAMBAH / EDIT SERTIFIKAT ===== */
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">
              <i className="ri-edit-line"></i> {action === 'edit' ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}
            </h2>
            <Link href="/admin/certificates" className="btn btn-outline btn-sm">
              <i className="ri-arrow-left-line"></i> Kembali
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nama Sertifikat *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Contoh: Sertifikat Workshop UI/UX"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Penyelenggara / Penerbit *</label>
                <input
                  type="text"
                  name="issuer"
                  className="form-control"
                  placeholder="Contoh: Universitas PGRI Semarang / BEM FTI"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tahun *</label>
                <input
                  type="text"
                  name="year"
                  className="form-control"
                  placeholder="Contoh: 2024"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
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
              <label className="form-label">File Sertifikat (JPG, PNG, PDF Maks 5MB)</label>
              {formData.image_file && (
                <div style={{ marginBottom: '10px' }}>
                  {formData.image_file.toLowerCase().endsWith('.pdf') ? (
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', display: 'inline-block' }}>
                      <i className="ri-file-pdf-line" style={{ color: '#ef4444', marginRight: '6px' }}></i>
                      <span>{formData.image_file}</span>
                    </div>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={
                        getStorageUrl('certificates', formData.image_file) ||
                        `/assets/uploads/certificates/${encodeURIComponent(formData.image_file)}`
                      }
                      alt="Thumbnail"
                      style={{
                        maxWidth: '160px',
                        height: 'auto',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                  )}
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Biarkan kosong jika tidak ingin mengubah file sertifikat.
                  </p>
                </div>
              )}
              <input
                type="file"
                name="image"
                className="form-control"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
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
              <Link href="/admin/certificates" className="btn btn-outline">
                Batal
              </Link>
            </div>
          </form>
        </div>
      ) : (
        /* ===== DAFTAR SERTIFIKAT ===== */
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">
              <i className="ri-award-line"></i> Daftar Sertifikat & Penghargaan
            </h2>
            <Link href="/admin/certificates?action=create" className="btn btn-primary btn-sm">
              <i className="ri-add-line"></i> Tambah Sertifikat Baru
            </Link>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pratinjau</th>
                  <th>Nama Sertifikat</th>
                  <th>Penyelenggara</th>
                  <th>Tahun</th>
                  <th>Urutan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {certificates.length > 0 ? (
                  certificates.map((cert) => {
                    const certImg =
                      getStorageUrl('certificates', cert.image_file) ||
                      (cert.image_file
                        ? `/assets/uploads/certificates/${encodeURIComponent(cert.image_file)}`
                        : null);

                    const isPdf = cert.image_file?.toLowerCase().endsWith('.pdf');

                    return (
                      <tr key={cert.id}>
                        <td style={{ width: '80px' }}>
                          {isPdf ? (
                            <span style={{ fontSize: '1.4rem', color: '#ef4444' }}>
                              <i className="ri-file-pdf-fill"></i>
                            </span>
                          ) : certImg ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={certImg}
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
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No file</span>
                          )}
                        </td>
                        <td className="strong">{cert.title}</td>
                        <td>{cert.issuer}</td>
                        <td>
                          <span style={{ color: 'var(--accent-mint)' }}>{cert.year}</span>
                        </td>
                        <td>{cert.order_index}</td>
                        <td>
                          <div className="action-buttons">
                            <Link
                              href={`/admin/certificates?action=edit&id=${cert.id}`}
                              className="btn-icon btn-icon-edit"
                              title="Edit"
                            >
                              <i className="ri-pencil-line"></i>
                            </Link>
                            <button
                              onClick={() => handleDelete(cert.id, cert.title)}
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
                    <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      {loading ? 'Memuat data sertifikat...' : 'Belum ada data sertifikat.'}
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


export default function AdminCertificatesPage() {
  return (
    <Suspense fallback={<div className="admin-loading">Memuat halaman...</div>}>
      <AdminCertificatesContent />
    </Suspense>
  );
}
