import React, { ReactNode, useEffect, useState } from 'react';

import Head from 'next/head';
import HeadNav from './HeadNav';
import { NextComponentType } from 'next';
import SideBar from './SideBar';
import authStore from '@store/adminAuthStore';
import { useRouter } from 'next/router';

const Layout = ({ children }: any) => {
  const { token } = authStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token || token == '') {
      router.push('/employee-login');
    }
  }, []);
  return (
    <>
      <div className="overflow-hidden">
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="md:pl-64 flex flex-col bg-gray-100">
          <HeadNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;
