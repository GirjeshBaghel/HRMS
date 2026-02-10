import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, LogOut } from 'lucide-react';
import clsx from 'clsx';

const SidebarItem = ({ to, icon: Icon, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group',
                isActive
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            )
        }
    >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{children}</span>
    </NavLink>
);

const Layout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                            H
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">HRMS Lite</h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <SidebarItem to="/dashboard" icon={LayoutDashboard}>Dashboard</SidebarItem>
                    <SidebarItem to="/employees" icon={Users}>Employees</SidebarItem>
                    <SidebarItem to="/attendance" icon={CalendarCheck}>Attendance</SidebarItem>
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>

                    <div className="flex items-center gap-3 px-3 py-2 text-slate-500">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <span className="text-xs font-bold">AD</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">Admin User</p>
                            <p className="text-xs text-slate-400">admin@hrms.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
