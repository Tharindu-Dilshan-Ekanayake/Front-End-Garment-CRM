import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useProductionStore } from '../../store/productionStore';
import { useUserStore } from '../../store/userStore';
import TableCompo from '../../components/TableCompo';
import { toast } from 'react-hot-toast';

export default function WorkerProduction() {
  const location = useLocation();
  const isLeaderView = location.pathname.endsWith('/lead');
  const isMemberView = location.pathname.endsWith('/member');

  const {
    productions,
    selectedProduction,
    fetchLeaderTasks,
    fetchMemberTasks,
    fetchProductionById,
    patchTaskAssignment,
    listLoading,
    detailLoading,
    error,
  } = useProductionStore();

  const { workers, fetchUserWorkers } = useUserStore();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingAssignments, setIsEditingAssignments] = useState(false);
  const [assignmentEdits, setAssignmentEdits] = useState([]);

  useEffect(() => {
    if (isLeaderView) {
      fetchLeaderTasks();
    }
    if (isMemberView) {
      fetchMemberTasks();
    }
    fetchUserWorkers();
  }, [isLeaderView, isMemberView, fetchLeaderTasks, fetchMemberTasks, fetchUserWorkers]);

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

  const completionPercentage =
    selectedProduction && selectedProduction.itemQuantity
      ? Math.round(
          (selectedProduction.finishedQuantity / selectedProduction.itemQuantity) * 100,
        )
      : 0;

  const getWorkerNameById = (id) => {
    const worker = workers?.find((w) => w.id === id);
    return worker?.name || id;
  };

  const handleView = async (row) => {
    await fetchProductionById(row.taskId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditingAssignments(false);
    setAssignmentEdits([]);
  };

  const startEditAssignments = () => {
    if (!selectedProduction || !Array.isArray(selectedProduction.taskAssignments)) return;
    setAssignmentEdits(
      selectedProduction.taskAssignments.map((ta) => ({
        ...ta,
        baseCompletedQty: ta.completedQty ?? 0,
        baseRejectedQty: ta.rejectedQty ?? 0,
        addCompleted: 0,
        addRejected: 0,
      })),
    );
    setIsEditingAssignments(true);
  };

  const handleAssignmentChange = (id, field, value) => {
    setAssignmentEdits((prev) =>
      prev.map((ta) => (ta.id === id ? { ...ta, [field]: value } : ta)),
    );
  };

  const handleSaveAssignments = async () => {
    if (!selectedProduction || !Array.isArray(assignmentEdits)) return;

    const cleanedAssignments = assignmentEdits.map((ta) => ({
      id: ta.id,
      completedQty: (ta.baseCompletedQty || 0) + (Number(ta.addCompleted) || 0),
      rejectedQty: (ta.baseRejectedQty || 0) + (Number(ta.addRejected) || 0),
    }));

    let allOk = true;
    for (const ta of cleanedAssignments) {
      const ok = await patchTaskAssignment(ta.id, {
        completedQty: ta.completedQty,
        rejectedQty: ta.rejectedQty,
      });
      if (!ok) {
        allOk = false;
      }
    }

    if (allOk) {
      // refresh current production details so UI shows updated values
      await fetchProductionById(selectedProduction.taskId);
      toast.success('Task assignments updated');
      setIsEditingAssignments(false);
    } else {
      toast.error('Failed to update one or more task assignments');
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {isLeaderView ? 'Leader Group Tasks' : 'Member Tasks'}
        </h2>
      </div>

      <div className="flex flex-col justify-end gap-3 mb-4 sm:flex-row">
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
            className="w-full h-10 max-w-sm px-3 py-2 border border-gray-300 rounded"
          >
            <option value="ALL">All</option>
            <option value="NOT_STARTED">Not started</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="mb-2 text-sm text-red-500">{error}</p>
      )}

      {listLoading && productions.length === 0 ? (
        <p className="text-sm text-gray-500">
          Loading {isLeaderView ? 'leader' : 'member'} tasks...
        </p>
      ) : productions.length === 0 ? (
        <p className="text-sm text-gray-500">
          No {isLeaderView ? 'leader' : 'member'} tasks available.
        </p>
      ) : null}

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
          { header: 'Completed qnt', accessor: 'finishedQuantity' },
        ]}
        pageSize={10}
        onView={handleView}
      />
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
                          {getWorkerNameById(selectedProduction.groupLeaderId)}{' '}
                          <span className="text-gray-500 text-[10px]">
                            (ID: {selectedProduction.groupLeaderId})
                          </span>
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
                                style={{
                                  width: `${Math.min(Math.max(completionPercentage, 0), 100)}%`,
                                }}
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
                {Array.isArray(selectedProduction.taskAssignments) &&
                  selectedProduction.taskAssignments.length > 0 && (
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
                            {(isEditingAssignments ? assignmentEdits : selectedProduction.taskAssignments).map((ta) => (
                              <tr key={ta.id} className="border-t">
                                <td className="px-3 py-1">
                                  {getWorkerNameById(ta.groupMemberId)}{' '}
                                  <span className="text-gray-500 text-[10px]">
                                    (ID: {ta.groupMemberId})
                                  </span>
                                </td>
                                <td className="px-3 py-1">
                                  {isEditingAssignments ? (
                                    <div className="flex items-center space-x-1">
                                      <span className="text-xs text-gray-800">
                                        {ta.baseCompletedQty}
                                      </span>
                                      <span className="text-xs text-gray-500">+</span>
                                      <input
                                        type="number"
                                        min="0"
                                        value={ta.addCompleted}
                                        onChange={(e) =>
                                          handleAssignmentChange(
                                            ta.id,
                                            'addCompleted',
                                            e.target.value,
                                          )
                                        }
                                        className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded"
                                      />
                                    </div>
                                  ) : (
                                    ta.completedQty
                                  )}
                                </td>
                                <td className="px-3 py-1">
                                  {isEditingAssignments ? (
                                    <div className="flex items-center space-x-1">
                                      <span className="text-xs text-gray-800">
                                        {ta.baseRejectedQty}
                                      </span>
                                      <span className="text-xs text-gray-500">+</span>
                                      <input
                                        type="number"
                                        min="0"
                                        value={ta.addRejected}
                                        onChange={(e) =>
                                          handleAssignmentChange(
                                            ta.id,
                                            'addRejected',
                                            e.target.value,
                                          )
                                        }
                                        className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded"
                                      />
                                    </div>
                                  ) : (
                                    ta.rejectedQty
                                  )}
                                </td>
                                <td className="px-3 py-1">
                                  {ta.approvedQty}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </>
            )}
            <div className="flex justify-end mt-6 space-x-2">
              {isLeaderView &&
                selectedProduction &&
                Array.isArray(selectedProduction.taskAssignments) &&
                selectedProduction.taskAssignments.length > 0 && (
                  <>
                    {!isEditingAssignments && (
                      <button
                        type="button"
                        onClick={startEditAssignments}
                        className="px-4 py-2 text-sm text-blue-600 rounded-md bg-blue-50 hover:bg-blue-100"
                      >
                        Edit assignments
                      </button>
                    )}
                    {isEditingAssignments && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingAssignments(false);
                            setAssignmentEdits([]);
                          }}
                          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveAssignments}
                          className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                          Save
                        </button>
                      </>
                    )}
                  </>
                )}
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
  );
}
