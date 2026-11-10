'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Certificate } from '../lib/types';
import { getStorageUrl } from '../lib/supabaseClient';

interface CertificatesSectionProps {
  certificates: Certificate[];
}

interface ActiveModalData {
  imgUrl: string;
  credentialUrl: string | null;
  title: string;
  issuer: string;
  year: string;
  isPdf: boolean;
}

export default function CertificatesSection({ certificates }: CertificatesSectionProps) {
  const [modalData, setModalData] = useState<ActiveModalData | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openModal = (cert: Certificate, imgUrl: string) => {
    triggerRef.current = document.activeElement as HTMLButtonElement;
    setModalData({
      imgUrl,
      credentialUrl: cert.credential_url,
      title: cert.title,
      issuer: cert.issuer,
      year: cert.year,
      isPdf: cert.image_file?.toLowerCase().endsWith('.pdf') || false,
    });
  };

  const closeModal = () => setModalData(null);

  useEffect(() => {
    if (!modalData) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const focusables = panel
      ? Array.from(
          panel.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])'
          )
        )
      : [];
    focusables[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setModalData(null);
        return;
      }
      if (event.key !== 'Tab' || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [modalData]);

  return (
    <>
      <section className="section" id="certificates">
        <div className="shell">
          <header className="section-head" data-reveal>
            <p className="section-label">Credentials</p>
            <div className="section-head-main">
              <h2>Sertifikasi &amp; Penghargaan</h2>
              <p className="section-sub">
                Kredensial dan pencapaian resmi yang telah diraih. Klik kartu untuk melihat gambar sertifikat.
              </p>
            </div>
          </header>

          {certificates && certificates.length > 0 ? (
            <div className="cert-grid">
              {certificates.map((cert) => {
                const certImg =
                  getStorageUrl('certificates', cert.image_file) ||
                  (cert.image_file
                    ? `/assets/uploads/certificates/${cert.image_file}`
                    : '/assets/images/cert-placeholder.png');

                const isPdf = cert.image_file?.toLowerCase().endsWith('.pdf');
                const actionLabel = isPdf ? 'Buka Dokumen' : 'Perbesar';

                return (
                  <button
                    key={cert.id}
                    type="button"
                    className="cert"
                    data-reveal
                    aria-haspopup="dialog"
                    aria-label={`${actionLabel}: ${cert.title}`}
                    onClick={() => openModal(cert, certImg)}
                  >
                    <span className="cert-plate">
                      {isPdf ? (
                        <span className="cert-pdf">
                          <strong>PDF</strong>
                          <span>Dokumen PDF</span>
                        </span>
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={certImg} alt={cert.title} loading="lazy" />
                      )}
                    </span>

                    <span className="cert-meta">
                      <span>{cert.year}</span>
                      <span>{actionLabel}</span>
                    </span>

                    <span className="cert-title">{cert.title}</span>
                    <span className="cert-issuer">{cert.issuer}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="empty-state" data-reveal>
              <h3>Belum Ada Sertifikat Ditambahkan</h3>
              <p>
                Ruang galeri ini disediakan untuk sertifikat kompetensi dan penghargaan Juniari Nur Shofa. Sertifikat dapat diunggah melalui Dashboard Admin kapan saja.
              </p>
            </div>
          )}
        </div>
      </section>

      {modalData && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
          onClick={closeModal}
        >
          <div className="modal-panel" ref={panelRef} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              aria-label="Tutup Pratinjau"
              onClick={closeModal}
            >
              ×
            </button>

            <div className="modal-media">
              {modalData.isPdf ? (
                <iframe src={modalData.imgUrl} title={modalData.title} />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={modalData.imgUrl} alt={modalData.title} />
              )}
            </div>

            <div className="modal-caption">
              <h3 id="cert-modal-title">{modalData.title}</h3>
              <p>
                {modalData.issuer} • {modalData.year}
              </p>
              <div className="modal-links">
                {modalData.credentialUrl && modalData.credentialUrl !== modalData.imgUrl && (
                  <a
                    href={modalData.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-plain"
                  >
                    Buka PDF
                  </a>
                )}
                <a
                  href={modalData.imgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="link-plain"
                >
                  Download File
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
