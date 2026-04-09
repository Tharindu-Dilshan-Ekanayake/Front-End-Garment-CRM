import React, { useEffect, useState } from 'react'
import TableCompo from '../../components/TableCompo'
import { useProductionStore } from '../../store/productionStore'
import PrimaryButton from '../../components/PrimaryButton';
import { useUserStore } from '../../store/userStore';

export default function ManagerProduction() {
  const { productions, selectedProduction, fetchProductions, fetchProductionById, detailLoading, createProduction } = useProductionStore();
  const { workers, fetchUserWorkers } = useUserStore();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProduction, setNewProduction] = useState({
    item: '',
    itemQuantity: '',
    groupLeaderId: '',
    groupMemberIds: [],
  });
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const completionPercentage = selectedProduction && selectedProduction.itemQuantity
    ? Math.round((selectedProduction.finishedQuantity / selectedProduction.itemQuantity) * 100)
    : 0;

  useEffect(() => {
    fetchProductions(); 
    fetchUserWorkers();
  }, [fetchProductions, fetchUserWorkers]);

  const getWorkerNameById = (id) => {
    const worker = workers?.find((w) => w.id === id);
    return worker?.name || id;
  };

  const getStatusMeta = (status) => {
    switch (status) {
      case 'NOT_STARTED':
        return {
          label: 'Not started',
          className:
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800',
        };
      case 'IN_PROGRESS':
        return {
          label: 'In progress',
          className:
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
        };
      case 'COMPLETED':
        return {
          label: 'Completed',
          className:
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800',
        };
      default:
        return {
          label: status || 'Unknown',
          className:
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800',
        };
    }
  };

  const filteredProductions = productions.filter((p) => {
    const matchesStatus = statusFilter === 'ALL' ? true : p.status === statusFilter;

    if (!search.trim()) return matchesStatus;

    const itemText = (p.item || '').toString().toLowerCase();
    const searchText = search.toLowerCase();

    const matchesSearch = itemText.includes(searchText);

    return matchesStatus && matchesSearch;
  });

  const handleView = async (row) => {
    await fetchProductionById(row.taskId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setNewProduction({ item: '', itemQuantity: '', groupLeaderId: '', groupMemberIds: [] });
    setSelectedMemberId('');
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewProduction((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMember = () => {
    if (!selectedMemberId) return;
    const idNum = Number(selectedMemberId);
    setNewProduction((prev) => (
      prev.groupMemberIds.includes(idNum)
        ? prev
        : { ...prev, groupMemberIds: [...prev.groupMemberIds, idNum] }
    ));
    setSelectedMemberId('');
  };

  const handleRemoveMember = (id) => {
    setNewProduction((prev) => ({
      ...prev,
      groupMemberIds: prev.groupMemberIds.filter((mId) => mId !== id),
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      item: newProduction.item,
      itemQuantity: Number(newProduction.itemQuantity),
      groupLeaderId: Number(newProduction.groupLeaderId),
      groupMemberIds: newProduction.groupMemberIds,
    };

    const ok = await createProduction(payload);
    if (ok) {
      closeCreateModal();
    }
  };
  const handleDelete = (row) => {
    // Implement delete functionality here
    console.log('Delete production with ID:', row.taskId);
  }

  return (
    <div>
      <div className="flex flex-col justify-end gap-3 mb-4 sm:flex-row ">
        <div>
          <PrimaryButton 
            color='green'
            label='Add Production'
            onClick={openCreateModal}
          />
        </div>
        
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Type item name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
           className="w-full h-10 max-w-sm px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-10 max-w-sm px-3 py-2 border border-gray-300 rounded "
          >
            <option value="ALL">All</option>
            <option value="NOT_STARTED">Not started</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>
      <TableCompo 
        data={filteredProductions}
        columns={[
          { header: 'ID', accessor: 'taskId' },
          { header: 'Item', accessor: 'item' },
          { 
            header: 'Status', 
            accessor: 'status',
            render: (value) => {
              const meta = getStatusMeta(value);
              return <span className={meta.className}>{meta.label}</span>;
            },
          },
          { header: 'QNT', accessor: 'itemQuantity' },
          { header: 'Completed qnt', accessor: 'finishedQuantity' }
        ]}
        pageSize={14}
        onView={handleView}
        onEdit={handleDelete}
      />
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-11/12 max-w-xl p-6 bg-white shadow-2xl rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Create Production</h2>
              <button
                type="button"
                onClick={closeCreateModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block mb-1 text-xs font-semibold text-gray-600">Item</label>
                <input
                  type="text"
                  name="item"
                  value={newProduction.item}
                  onChange={handleCreateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-semibold text-gray-600">Quantity</label>
                <input
                  type="number"
                  min="1"
                  name="itemQuantity"
                  value={newProduction.itemQuantity}
                  onChange={handleCreateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="Enter quantity"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-semibold text-gray-600">Group Leader</label>
                <select
                  name="groupLeaderId"
                  value={newProduction.groupLeaderId}
                  onChange={handleCreateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select leader</option>
                  {workers?.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} (ID: {w.id})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-xs font-semibold text-gray-600">Group Members</label>
                <div className="flex gap-2 mb-2">
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="">Select member</option>
                    {workers?.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} (ID: {w.id})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="px-3 py-2 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                {newProduction.groupMemberIds.length > 0 && (
                  <div className="p-2 border border-gray-200 rounded max-h-28 overflow-auto">
                    <ul className="space-y-1 text-xs">
                      {newProduction.groupMemberIds.map((id) => (
                        <li key={id} className="flex items-center justify-between">
                          <span>
                            {getWorkerNameById(id)} <span className="text-[10px] text-gray-500">(ID: {id})</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(id)}
                            className="text-[10px] text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="px-4 py-2 text-xs text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-11/12 max-w-4xl p-6 bg-white shadow-2xl md:w-2/3 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Production Details</h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {detailLoading && !selectedProduction && (
              <p className="py-6 text-sm text-center text-gray-500">Loading production...</p>
            )}
            {!detailLoading && selectedProduction && (
              <>
                <div className="mb-4 overflow-hidden text-xs text-left border border-blue-100 rounded-md">
                  <table className="w-full">
                    <tbody>
                      <tr className="bg-blue-50">
                        <td className="px-3 py-2 font-semibold text-blue-800">Task ID</td>
                        <td className="px-3 py-2 text-black">{selectedProduction.taskId}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-3 py-2 font-semibold text-blue-800">Item</td>
                        <td className="px-3 py-2 text-black">{selectedProduction.item}</td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="px-3 py-2 font-semibold text-blue-800">Group Leader</td>
                        <td className="px-3 py-2 text-black">
                          {getWorkerNameById(selectedProduction.groupLeaderId)}
                          {" "}
                          <span className="text-gray-500 text-[10px]">(ID: {selectedProduction.groupLeaderId})</span>
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-3 py-2 font-semibold text-blue-800">Status</td>
                        <td className="px-3 py-2">
                          {(() => {
                            const meta = getStatusMeta(selectedProduction.status);
                            return <span className={meta.className}>{meta.label}</span>;
                          })()}
                        </td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="px-3 py-2 font-semibold text-blue-800">Quantity</td>
                        <td className="px-3 py-2 text-black">{selectedProduction.itemQuantity}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-3 py-2 font-semibold text-blue-800">Completed quantity</td>
                        <td className="px-3 py-2 text-black">{selectedProduction.finishedQuantity}</td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="px-3 py-2 font-semibold text-blue-800">Overall progress</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 h-2 overflow-hidden bg-gray-200 rounded-full">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"
                                style={{ width: `${Math.min(Math.max(completionPercentage, 0), 100)}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                              {completionPercentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {Array.isArray(selectedProduction.taskAssignments) && selectedProduction.taskAssignments.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">Task Assignments</h3>
                    <div className="overflow-x-auto border border-gray-200 rounded-md">
                      <table className="min-w-full text-xs text-left text-gray-700">
                        <thead className="text-xs text-gray-600 uppercase bg-gray-100">
                          <tr>
                            
                            <th className="px-3 py-2">Group Member</th>
                            <th className="px-3 py-2">Completed Qty</th>
                            <th className="px-3 py-2">Rejected Qty</th>
                            <th className="px-3 py-2">Approved Qty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProduction.taskAssignments.map((ta) => (
                            <tr key={ta.id} className="border-t">
                              
                              <td className="px-3 py-1">
                                {getWorkerNameById(ta.groupMemberId)}
                                {" "}
                                <span className="text-gray-500 text-[10px]">(ID: {ta.groupMemberId})</span>
                              </td>
                              <td className="px-3 py-1">{ta.completedQty}</td>
                              <td className="px-3 py-1">{ta.rejectedQty}</td>
                              <td className="px-3 py-1">{ta.approvedQty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
