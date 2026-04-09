import React, { useEffect, useState } from 'react'
import TableCompo from '../../components/TableCompo'
import { useUserStore } from '../../store/userStore'
import PrimaryButton from '../../components/PrimaryButton';
import InputComponent from '../../components/InputComponent';
import { toast } from 'react-hot-toast';

export default function AdminUserManagement() {
  const { users, user, fetchUsers, fetchUserById, clearUser, createUser, deleteUser, patchUser, listLoading,  error } = useUserStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', password: '' });
  const [formErrors, setFormErrors] = useState({ name: '', email: '', phone: '', password: '' });
  const [editUser, setEditUser] = useState({ id: '', name: '', email: '', phone: '', role: '', position: '' });
  const [editErrors, setEditErrors] = useState({ name: '', email: '', phone: '', role: '', position: '' });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  if (error) return <p>{error}</p>;

  const filteredUsers = [...users]
    .sort((a, b) => Number(a.id) - Number(b.id))
    .filter((user) =>
      user.name?.toLowerCase().includes(search.toLowerCase())
    );

  const handleView = async (row) => {
    await fetchUserById(row.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    clearUser();
  };

  const openAddModal = () => {
    setNewUser({ name: '', email: '', phone: '', password: '' });
    setFormErrors({ name: '', email: '', phone: '', password: '' });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateField('name', newUser.name),
      email: validateField('email', newUser.email),
      phone: validateField('phone', newUser.phone),
      password: validateField('password', newUser.password)
    };

    setFormErrors(newErrors);

    const hasError = Object.values(newErrors).some((msg) => msg);
    if (hasError) {
      toast.error('Please fix the form errors');
      return;
    }
    const success = await createUser(newUser);
    if (success) {
      toast.success('User created successfully');
      setIsAddModalOpen(false);
      setNewUser({ name: '', email: '', phone: '', password: '' });
      fetchUsers();
    } else {
      toast.error('Failed to create user');
    }
  };

  const handleDeleteClick = (row) => {
    setDeleteTarget(row);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const success = await deleteUser(deleteTarget.id);
    if (success) {
      toast.success('User deleted successfully');
      closeDeleteModal();
      fetchUsers();
    } else {
      toast.error('Failed to delete user');
    }
  };

  const handleEditClick = (row) => {
    setEditUser({
      id: row.id,
      name: row.name || '',
      email: row.email || '',
      phone: row.phone || '',
      role: row.role || '',
      position: row.position || '',
    });
    setEditErrors({ name: '', email: '', phone: '', role: '', position: '' });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditUser({ id: '', name: '', email: '', phone: '', role: '', position: '' });
    setEditErrors({ name: '', email: '', phone: '', role: '', position: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));

    setEditErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateField('name', editUser.name),
      email: validateField('email', editUser.email),
      phone: validateField('phone', editUser.phone),
      role: validateField('role', editUser.role),
      position: validateField('position', editUser.position),
    };

    setEditErrors(newErrors);

    const hasError = Object.values(newErrors).some((msg) => msg);
    if (hasError) {
      toast.error('Please fix the form errors');
      return;
    }

    const payload = {
      name: editUser.name,
      email: editUser.email,
      phone: editUser.phone,
      role: editUser.role,
      position: editUser.position,
    };

    const success = await patchUser(editUser.id, payload);
    if (success) {
      toast.success('User updated successfully');
      setIsEditModalOpen(false);
      fetchUsers();
    } else {
      toast.error('Failed to update user');
    }
  };

  const validateField = (name, value) => {
    //name only letter
    if (name === 'name') {
      if (!value.trim()) return 'Name is required';
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(value)) return 'Name can only contain letters and spaces';
      return '';
    }
    if (name === 'email') {
      if (!value.trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Enter a valid email address';
      return '';
    }
    if (name === 'phone') {
      if (!value.trim()) return 'Phone number is required';
      const digits = value.replace(/\D/g, '');
      if (digits.length !== 10) return 'Phone number must be 10 digits';
      return '';
    }
    if (name === 'password') {
      if (!value) return 'Password is required';
      if (value.length < 5) return 'Password must be at least 5 characters';
      return '';
    }
    if (name === 'role') {
      if (!value) return 'Role is required';
      const validRoles = ['ADMIN', 'MANAGER', 'WORKER'];
      if (!validRoles.includes(value)) return 'Invalid role selected';
      return '';
    }
    if (name === 'position') {
      if (!value) return 'Position is required';
      const validPositions = ['FIRST', 'SECOND', 'THIRD'];
      if (!validPositions.includes(value)) return 'Invalid position selected';
      return '';
    }
    return '';
  };

  

  return (
    <div >
      <div className="flex justify-end gap-3 mb-4">
        <PrimaryButton 
          label="Add User"
          color="green"
          onClick={openAddModal}
        />
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 max-w-sm px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      {listLoading && users.length === 0 && (
        <p className="mb-4 text-sm text-gray-500">Loading users...</p>
      )}
      <TableCompo
  columns={[
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
   
    { header: 'Role', accessor: 'role' },
  ]}
  
  data={filteredUsers}
  pageSize={14}
  onView={handleView}
  onEdit={handleEditClick}
  onDelete={handleDeleteClick}
/>
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Edit User</h2>
              <button
                type="button"
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
             
              <InputComponent
                label="Name"
                name="name"
                type="text"
                placeholder="Enter name"
                value={editUser.name || ''}
                onChange={handleEditChange}
                error={editErrors.name}
              />
              <InputComponent
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email"
                value={editUser.email || ''}
                onChange={handleEditChange}
                error={editErrors.email}
              />
              <InputComponent
                label="Phone"
                name="phone"
                type="number"
                placeholder="Enter phone number"
                value={editUser.phone || ''}
                onChange={handleEditChange}
                error={editErrors.phone}
              />
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={editUser.role}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select role</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="WORKER">WORKER</option>
                </select>
                {editErrors.role && (
                  <p className="mt-1 text-xs font-medium text-right text-red-500">
                    {editErrors.role}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="position">
                  Position
                </label>
                <select
                  id="position"
                  name="position"
                  value={editUser.position}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select position</option>
                  <option value="FIRST">FIRST</option>
                  <option value="SECOND">SECOND</option>
                  <option value="THIRD">THIRD</option>
                </select>
                {editErrors.position && (
                  <p className="mt-1 text-xs font-medium text-right text-red-500">
                    {editErrors.position}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !editUser.name ||
                    !editUser.email ||
                    !editUser.phone ||
                    !editUser.role ||
                    !editUser.position ||
                    Object.values(editErrors).some((msg) => msg)
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-sm p-6 bg-white shadow-2xl rounded-xl">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Delete User</h2>
            <p className="mb-4 text-sm text-gray-700">
              Are you sure you want to delete
              {' '}
              <span className="font-semibold">{deleteTarget.name}</span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Add User</h2>
              <button
                type="button"
                onClick={closeAddModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <InputComponent
                label="Name"
                name="name"
                type="text"
                placeholder="Enter name"
                value={newUser.name || ''}
                onChange={handleAddChange}
                error={formErrors.name}
              />
              <InputComponent
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email"
                value={newUser.email}
                onChange={handleAddChange}
                error={formErrors.email}
              />
              <InputComponent
                label="Phone"
                name="phone"
                type="number"
                placeholder="Enter phone number"
                value={newUser.phone || ''}
                onChange={handleAddChange}
                error={formErrors.phone}
              />
              <InputComponent
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={handleAddChange}
                error={formErrors.password}
              />
              {/** Save button disabled until form is valid */}
              {/** Simple derived flag, no extra state */}
              {/** Valid if no errors and all fields non-empty */}
              {/** Note: validation also rechecked on submit */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !newUser.name ||
                    !newUser.email ||
                    !newUser.phone ||
                    !newUser.password ||
                    Object.values(formErrors).some((msg) => msg)
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isModalOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-xl">
            <button
              type="button"
              onClick={closeModal}
              className="absolute text-gray-500 top-3 right-3 hover:text-gray-700"
            >
              ✕
            </button>

            <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 sm:flex-row">
              <div className="w-20 h-20 overflow-hidden bg-gray-200 rounded-lg">
                <div className="flex items-center justify-center w-full h-full text-2xl font-semibold text-white bg-blue-500">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
              <div className="text-left">
                
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className="inline-flex items-center px-2 py-0.5 mt-2 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="px-6 pt-4 pb-5 bg-white">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs font-semibold text-gray-500">User ID</p>
                  <p className="mt-1 text-gray-800">{user.id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Phone</p>
                  <p className="mt-1 text-gray-800">{user.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Position</p>
                  <p className="mt-1 text-gray-800">{user.position || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Role</p>
                  <p className="mt-1 text-gray-800">{user.role}</p>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
