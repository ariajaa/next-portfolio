'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getAdminSession, logoutAdmin, AdminUser } from '@/lib/adminAuth';
import { supabase } from '@/lib/supabaseClient';
import '@/styles/admin.css';

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/projects': 'Projects',
  '/admin/skills': 'Skills',
  '/admin/experiences': 'Experience',
  '/admin/certificates': 'Certificates',
  '/admin/messages': 'Pesan Masuk',
  '/admin/profile': 'Profil & Kontak',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const isLoginPage = pathname === '/admin/login';
  const pageTitle = PAGE_TITLES[pathname] ?? 'Admin Panel';

  useEffect(() => {
    if (isLoginPage) {
      setSessionChecked(true);
      return;
    }

    let cancelled = false;

    getAdminSession().then((user) => {
      if (cancelled) return;
      if (!user) {
        router.replace('/admin/login');
        return;
      }
      setAdminUser(user);
      setSessionChecked(true);
    });

    return () => {
      cancelled = true;
    };
  }, [pathname, isLoginPage, router]);

  useEffect(() => {
    if (isLoginPage) return;

    const fetchUnread = async () => {
      try {
        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false);

        if (!error && typeof count === 'number') {
          setUnreadCount(count);
        }
      } catch {
        // Hitungan gagal dimuat: badge dibiarkan kosong.
      }
    };

    fetchUnread();
  }, [isLoginPage]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await logoutAdmin();
    router.replace('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!sessionChecked) {
    return <div className="admin-loading">Memeriksa sesi admin...</div>;
  }

  return (
    <div className="admin-layout">
      <aside
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        id="adminSidebar"
        aria-label="Navigasi admin"
      >
        <div className="sidebar-header">
          <Link href="/admin/dashboard" className="sidebar-logo">
            JNS<span>.</span>
          </Link>
          <span className="sidebar-label">Admin Panel</span>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <span className="sidebar-section-title">Utama</span>
            <ul>
              <li>
                <Link
                  href="/admin/dashboard"
                  className={`sidebar-link ${pathname === '/admin/dashboard' ? 'active' : ''}`}
                >
                  <span>Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <span className="sidebar-section-title">Manajemen Konten</span>
            <ul>
              <li>
                <Link
                  href="/admin/projects"
                  className={`sidebar-link ${pathname.startsWith('/admin/projects') ? 'active' : ''}`}
                >
                  <span>Projects</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/skills"
                  className={`sidebar-link ${pathname.startsWith('/admin/skills') ? 'active' : ''}`}
                >
                  <span>Skills</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/experiences"
                  className={`sidebar-link ${pathname.startsWith('/admin/experiences') ? 'active' : ''}`}
                >
                  <span>Experience</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/certificates"
                  className={`sidebar-link ${pathname.startsWith('/admin/certificates') ? 'active' : ''}`}
                >
                  <span>Certificates</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <span className="sidebar-section-title">Komunikasi</span>
            <ul>
              <li>
                <Link
                  href="/admin/messages"
                  className={`sidebar-link ${pathname.startsWith('/admin/messages') ? 'active' : ''}`}
                >
                  <span>Pesan Masuk</span>
                  {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <span className="sidebar-section-title">Pengaturan</span>
            <ul>
              <li>
                <Link
                  href="/admin/profile"
                  className={`sidebar-link ${pathname.startsWith('/admin/profile') ? 'active' : ''}`}
                >
                  <span>Profil &amp; Kontak</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <Link href="/" target="_blank" className="sidebar-link">
            <span>Lihat Portfolio</span>
          </Link>
          <button type="button" onClick={handleLogout} className="sidebar-link logout-link">
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Tutup navigasi admin"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="sidebar-toggle"
              aria-label="Buka navigasi admin"
              aria-expanded={sidebarOpen}
              aria-controls="adminSidebar"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              Menu
            </button>
            <h1 className="admin-page-title">{pageTitle}</h1>
          </div>
          <div className="topbar-right">
            <span className="admin-user-info">
              <span>{adminUser?.full_name || 'Juniari Nur Shofa'}</span>
            </span>
          </div>
        </header>

        <div className="admin-content" id="main" tabIndex={-1}>{children}</div>
      </div>
    </div>
  );
}
