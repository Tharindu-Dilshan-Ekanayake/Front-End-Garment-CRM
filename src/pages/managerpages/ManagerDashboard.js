import React, { useEffect, useMemo } from 'react';
import HeadText from '../../components/HeadText';
import { useProductionStore } from '../../store/productionStore';
import { useInventoryStore } from '../../store/inventoryStore';

export default function ManagerDashboard() {
  const {
    productions,
    fetchProductions,
    listLoading: productionsLoading,
    error: productionsError,
  } = useProductionStore();

  const {
    inventoryItems,
    fetchInventoryItems,
    loading: inventoryLoading,
    error: inventoryError,
  } = useInventoryStore();

  useEffect(() => {
    fetchProductions();
    fetchInventoryItems();
  }, [fetchProductions, fetchInventoryItems]);

  const {
    totalTasks,
    notStartedTasks,
    inProgressTasks,
    completedTasks,
  } = useMemo(() => {
    const total = productions.length;
    const notStarted = productions.filter((p) => p.status === 'NOT_STARTED').length;
    const inProgress = productions.filter((p) => p.status === 'IN_PROGRESS').length;
    const completed = productions.filter((p) => p.status === 'COMPLETED').length;

    return {
      totalTasks: total,
      notStartedTasks: notStarted,
      inProgressTasks: inProgress,
      completedTasks: completed,
    };
  }, [productions]);

  const cardClass =
    'rounded-xl border border-gray-200 p-4 shadow-sm bg-white/80 backdrop-blur text-gray-900 hover:border-blue-400 hover:shadow-md transition-all duration-200';

  const { lowInventoryItems, lowInventoryCount } = useMemo(() => {
    const low = inventoryItems.filter((item) => {
      const qty = Number(item.itemQuantity);
      return !Number.isNaN(qty) && qty < 5;
    });

    return {
      lowInventoryItems: low,
      lowInventoryCount: low.length,
    };
  }, [inventoryItems]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <HeadText label="Manager Dashboard" />
      </div>

      {(productionsError || inventoryError) && (
        <div className="p-3 text-sm text-red-800 border border-red-200 rounded-md bg-red-50">
          {productionsError && <p>Production data error: {productionsError}</p>}
          {inventoryError && <p>Inventory data error: {inventoryError}</p>}
        </div>
      )}

      {(productionsLoading || inventoryLoading) && (
        <p className="text-sm text-gray-500">Loading dashboard data...</p>
      )}

      {/* Task status summary */}
      <div className="p-4 border rounded-2xl bg-gradient-to-r from-slate-50 via-white to-sky-50 border-slate-100">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Production tasks</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Total tasks</p>
              <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                TT
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{totalTasks}</p>
            <p className="mt-1 text-[11px] text-gray-500">All production tasks</p>
          </div>
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Not started</p>
              <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                NS
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{notStartedTasks}</p>
            <p className="mt-1 text-[11px] text-gray-500">Tasks not yet started</p>
          </div>
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">In progress</p>
              <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                IP
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{inProgressTasks}</p>
            <p className="mt-1 text-[11px] text-gray-500">Currently running tasks</p>
          </div>
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Completed</p>
              <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                CP
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{completedTasks}</p>
            <p className="mt-1 text-[11px] text-gray-500">Finished tasks</p>
          </div>
        </div>
      </div>

      {/* Low inventory items (qty < 5) */}
      <div className="p-4 border rounded-2xl bg-gradient-to-r from-amber-50 via-white to-rose-50 border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Low inventory items</h2>
          <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-full text-amber-800 bg-amber-100">
            {lowInventoryCount} items
          </span>
        </div>

        {lowInventoryCount === 0 ? (
          <p className="text-xs text-gray-500">No inventory items are currently below the low-level threshold.</p>
        ) : (
          <>
            <div className={cardClass}>
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">Low stock items</p>
              <p className="mt-2 text-2xl font-semibold">{lowInventoryCount}</p>
            </div>

            <div className="mt-4 overflow-hidden text-xs bg-white border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-[11px] text-gray-500">
                    <th className="px-3 py-2 font-medium">ID</th>
                    <th className="px-3 py-2 font-medium">Item</th>
                    <th className="px-3 py-2 font-medium">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {lowInventoryItems.slice(0, 6).map((item) => (
                    <tr key={item.id} className="border-t text-[11px] text-gray-700 bg-white/80 text-start">
                      <td className="px-3 py-2">{item.id}</td>
                      <td className="px-3 py-2">{item.itemName}</td>
                      <td className="px-3 py-2 font-semibold text-amber-700">{item.itemQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
