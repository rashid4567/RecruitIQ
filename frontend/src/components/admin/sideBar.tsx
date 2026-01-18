import { authService } from '@/services/auth/auth.service';

import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutGrid,
  FileText,
  Users,
  UsersRound,
  Users2,
  CheckCircle2,
  Mail,
  MailIcon,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
  exact?: boolean;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    { icon: LayoutGrid, label: 'Dashboard', href: '/admin/dashboard', exact: true },
    { icon: FileText, label: 'Activity Logs', href: '/admin/activity-logs' },
    { icon: Users, label: 'Recruiter Management', href: '/admin/recruiters' },
    { icon: UsersRound, label: 'Candidate Management', href: '/admin/candidates' },
    { icon: Users2, label: 'Subscribers', href: '/admin/subscribers' },
    { icon: CheckCircle2, label: 'Plans Overview', href: '/admin/plans' },
    { icon: Mail, label: 'Email Template Management', href: '/admin/email-templates' },
    { icon: MailIcon, label: 'Email Logs', href: '/admin/email-logs' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  const isActive = (item: MenuItem) => {
    if (item.exact) {
      return location.pathname === item.href;
    }
    return location.pathname.startsWith(item.href);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const handleLogout =async () => {
    await authService.logout()
    console.log('Logging out...');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300 sticky top-0`}>
      {/* Logo and Toggle */}
      <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
        <div 
          className={`flex items-center gap-2 ${collapsed ? 'justify-center w-full' : ''} cursor-pointer`}
          onClick={() => handleNavigation('/admin/dashboard')}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-gray-900 truncate">RecruitIQ Admin</span>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg 
              className={`w-5 h-5 text-gray-500 transform transition-transform ${collapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          
          return (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all mb-1 group w-full text-left ${
                active
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <div className={`relative ${collapsed ? '' : ''}`}>
                <Icon 
                  size={20} 
                  className={`${active ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-700'}`} 
                />
                {active && !collapsed && (
                  <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-full"></div>
                )}
              </div>
              {!collapsed && (
                <span className={`text-sm font-medium truncate ${active ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              )}
              {collapsed && active && (
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-gray-200 px-3 py-4">
        {!collapsed ? (
          <>
            {/* User Profile */}
            <div className="px-3 py-3 mb-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">admin@recruitiq.com</p>
                </div>
              </div>
            </div>
            
            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-colors w-full group"
            >
              <LogOut size={20} className="text-gray-500 group-hover:text-red-600" />
              <span className="text-sm font-medium">Log Out</span>
            </Button>
          </>
        ) : (
          // Collapsed version
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Expand sidebar"
            >
              <svg 
                className="w-5 h-5 text-gray-500 transform rotate-180" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="p-3 text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-colors group"
              title="Log Out"
            >
              <LogOut size={20} className="text-gray-500 group-hover:text-red-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}