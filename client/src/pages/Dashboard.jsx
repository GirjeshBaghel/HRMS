import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import api from '../api/axios';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const { data: employees } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const { data } = await api.get('/employees');
            return data;
        },
        initialData: []
    });

    const { data: todayAttendance } = useQuery({
        queryKey: ['attendance-today'],
        queryFn: async () => {
            const today = new Date().toISOString().split('T')[0];
            const { data } = await api.get(`/attendance?date=${today}`);
            return data;
        },
        initialData: []
    });

    const presentCount = todayAttendance.filter(a => a.status === 'PRESENT').length;
    const absentCount = todayAttendance.filter(a => a.status === 'ABSENT').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
                <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Employees"
                    value={employees.length}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Present Today"
                    value={presentCount}
                    icon={UserCheck}
                    color="bg-green-500"
                />
                <StatCard
                    title="Absent Today"
                    value={absentCount}
                    icon={UserX}
                    color="bg-red-500"
                />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                        onClick={() => navigate('/employees')}
                        className="p-4 border border-dashed border-slate-300 rounded-lg text-center text-slate-500 hover:bg-slate-50 hover:border-primary-500 hover:text-primary-600 transition-all cursor-pointer"
                    >
                        Add New Employee
                    </div>
                    <div
                        onClick={() => navigate('/attendance')}
                        className="p-4 border border-dashed border-slate-300 rounded-lg text-center text-slate-500 hover:bg-slate-50 hover:border-primary-500 hover:text-primary-600 transition-all cursor-pointer"
                    >
                        Mark Attendance
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
