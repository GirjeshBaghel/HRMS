import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axios';

const Attendance = () => {
    const queryClient = useQueryClient();
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('PRESENT');
    const [viewHistoryId, setViewHistoryId] = useState('');
    const [message, setMessage] = useState('');

    // Fetch Employees for dropdowns
    const { data: employees } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const { data } = await api.get('/employees');
            return data;
        },
        initialData: []
    });

    // Fetch Attendance History
    const { data: attendanceHistory, isLoading: isLoadingHistory } = useQuery({
        queryKey: ['attendance', viewHistoryId],
        queryFn: async () => {
            if (!viewHistoryId) return [];
            const { data } = await api.get(`/attendance/${viewHistoryId}`);
            return data;
        },
        enabled: !!viewHistoryId,
        initialData: []
    });

    // Mark Attendance Mutation
    const markMutation = useMutation({
        mutationFn: async (data) => {
            return await api.post('/attendance', data);
        },
        onSuccess: () => {
            setMessage('Attendance marked successfully!');
            setTimeout(() => setMessage(''), 3000);
            if (viewHistoryId === selectedEmployeeId) {
                queryClient.invalidateQueries(['attendance', viewHistoryId]);
            }
        },
        onError: (err) => {
            setMessage(`Error: ${err.response?.data?.detail || 'Failed to mark attendance'}`);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedEmployeeId) return;
        markMutation.mutate({
            employee_id: parseInt(selectedEmployeeId),
            date: date,
            status: status
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Attendance Management</h2>
                <p className="text-slate-500">Track and manage employee attendance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mark Attendance Form */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-600" />
                        Mark Attendance
                    </h3>

                    {message && (
                        <div className={`mb-4 p-3 text-sm rounded-lg border ${message.includes('Error') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee</label>
                            <select
                                required
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                value={selectedEmployeeId}
                                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                            >
                                <option value="">Choose an employee...</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.employee_id})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setStatus('PRESENT')}
                                    className={`flex-1 py-2 px-3 rounded-lg border font-medium flex items-center justify-center gap-2 transition-all ${status === 'PRESENT' ? 'bg-green-50 border-green-200 text-green-700 ring-1 ring-green-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <CheckCircle className="w-4 h-4" /> Present
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatus('ABSENT')}
                                    className={`flex-1 py-2 px-3 rounded-lg border font-medium flex items-center justify-center gap-2 transition-all ${status === 'ABSENT' ? 'bg-red-50 border-red-200 text-red-700 ring-1 ring-red-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <XCircle className="w-4 h-4" /> Absent
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={markMutation.isPending || !selectedEmployeeId}
                            className="w-full bg-primary-600 text-white font-medium py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {markMutation.isPending ? 'Saving...' : 'Submit Attendance'}
                        </button>
                    </form>
                </div>

                {/* Attendance History */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">Attendance History</h3>
                        <select
                            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            value={viewHistoryId}
                            onChange={(e) => setViewHistoryId(e.target.value)}
                        >
                            <option value="">Select Employee to View</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                    </div>

                    {!viewHistoryId ? (
                        <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-lg bg-slate-50">
                            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Select an employee above to view their attendance records</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden">
                            {isLoadingHistory ? (
                                <p className="text-center py-8 text-slate-500">Loading records...</p>
                            ) : attendanceHistory.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg">No attendance records found for this employee.</div>
                            ) : (
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Day</th>
                                            <th className="px-4 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {attendanceHistory.map((record) => (
                                            <tr key={record.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 font-medium text-slate-900">{record.date}</td>
                                                <td className="px-4 py-3 text-slate-500">
                                                    {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {record.status === 'PRESENT' ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                            Present
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                            Absent
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Attendance;
