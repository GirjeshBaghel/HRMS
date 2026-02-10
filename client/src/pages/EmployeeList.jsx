import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Search, User, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axios';

const EmployeeList = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        name: '',
        employee_id: '',
        email: '',
        department: ''
    });
    const [error, setError] = useState('');
    const [listError, setListError] = useState('');
    const [listSuccess, setListSuccess] = useState('');

    // Fetch Employees
    const { data: employees, isLoading } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            const { data } = await api.get('/employees');
            return data;
        },
        initialData: []
    });

    // Create Employee Mutation
    const createMutation = useMutation({
        mutationFn: async (newEmp) => {
            return await api.post('/employees', newEmp);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
            setIsModalOpen(false);
            setNewEmployee({ name: '', employee_id: '', email: '', department: '' });
            setError('');
        },
        onError: (err) => {
            setError(err.response?.data?.detail || 'Failed to create employee');
        }
    });

    // Delete Employee Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await api.delete(`/employees/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
            setListSuccess('Employee deleted successfully');
            setTimeout(() => setListSuccess(''), 3000);
            setListError('');
        },
        onError: (err) => {
            setListError(`Failed to delete employee: ${err.response?.data?.detail || err.message}`);
            setTimeout(() => setListError(''), 5000);
            setListSuccess('');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(newEmployee);
    };

    const departments = ['Engineering', 'HR', 'Sales', 'Marketing', 'Design', 'Finance'];

    if (isLoading) return <div className="text-center p-10">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Employees</h2>
                    <p className="text-slate-500">Manage your team members</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Employee
                </button>
            </div>

            {/* Employee Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {employees.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                        No employees found. Add one to get started.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                                                    {emp.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{emp.name}</p>
                                                    <p className="text-xs text-slate-400">{emp.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-slate-500">{emp.employee_id}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                {emp.department}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this employee?')) {
                                                        deleteMutation.mutate(emp.id);
                                                    }
                                                }}
                                                className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Employee Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Add New Employee</h3>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    value={newEmployee.name}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        value={newEmployee.employee_id}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, employee_id: e.target.value })}
                                        placeholder="EMP001"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        value={newEmployee.department}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    value={newEmployee.email}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                    placeholder="john@company.com"
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="flex-1 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                                >
                                    {createMutation.isPending ? 'Saving...' : 'Add Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
