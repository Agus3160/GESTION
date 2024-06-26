/* eslint-disable react/jsx-indent */
/* eslint-disable indent */

import SideNav from "@/components/dashboard/SideNav";

// eslint-disable-next-line space-before-function-paren, no-undef
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64 md:sticky">
        <SideNav />
      </div>
      <div className="flex-grow py-6 px-3 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  );
}
