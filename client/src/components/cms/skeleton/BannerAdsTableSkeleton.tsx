import React from 'react';

export const BannerAdsTableSkeleton = () => {
  return (
    <div className="w-full ">
      {/* Mobile view */}
      <div className="block md:hidden divide-y divide-(--byreix-border)">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 space-y-4">
            <div className="flex gap-4">
              {/* Thumbnail Box */}
              <div className="w-12 h-12 rounded bg-white/10 shrink-0" />
              {/* Name and URL Box */}
              <div className="flex-1 space-y-2 min-w-0">
                <div className="h-4 w-3/4 bg-white/10 rounded" />
                <div className="h-3 w-1/2 bg-white/5 rounded" />
              </div>
              {/* Actions Box */}
              <div className="flex gap-2">
                <div className="h-4 w-4 bg-white/5 rounded" />
                <div className="h-4 w-4 bg-white/5 rounded" />
              </div>
            </div>
            {/* Status and Stats Bar */}
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-(--byreix-border)">
              <div className="h-4 w-20 bg-white/10 rounded" />
              <div className="h-4 w-24 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Dekstop view */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="bg-[#1A1A1A] border-b border-(--byreix-border)">
              <tr>
                <th className="w-[12%] px-6 py-5"><div className="h-3 w-12 bg-white/10 rounded" /></th>
                <th className="w-[43%] px-6 py-5"><div className="h-3 w-24 bg-white/10 rounded" /></th>
                <th className="w-[15%] px-6 py-5"><div className="h-3 w-16 bg-white/10 rounded" /></th>
                <th className="w-[15%] px-6 py-5"><div className="h-3 w-16 bg-white/10 rounded mx-auto" /></th>
                <th className="w-[15%] px-6 py-5 text-right"><div className="h-3 w-16 bg-white/10 rounded ml-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--byreix-border)">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {/* Thumbnail Column */}
                  <td className="w-[12%] px-6 py-4">
                    <div className="w-11 h-11 rounded bg-white/10" />
                  </td>
                  {/* Details Column */}
                  <td className="w-[43%] px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-white/10 rounded" />
                      <div className="h-3 w-48 bg-white/5 rounded" />
                    </div>
                  </td>
                  {/* Status Column */}
                  <td className="w-[15%] px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-4 bg-white/10 rounded-full" />
                      <div className="h-3 w-12 bg-white/5 rounded" />
                    </div>
                  </td>
                  {/* Stats Column */}
                  <td className="w-[15%] px-6 py-4">
                    <div className="flex items-center justify-center gap-4">
                      <div className="h-6 w-8 bg-white/5 rounded" />
                      <div className="h-6 w-8 bg-white/5 rounded" />
                    </div>
                  </td>
                  {/* Actions Column */}
                  <td className="w-[15%] px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <div className="h-4 w-4 bg-white/10 rounded" />
                      <div className="h-4 w-4 bg-white/10 rounded" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};