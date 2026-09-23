"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { NotificationResponse } from "@/types/notification";
import { NotificationItem } from "@/components/admin/notifications/notification-item";
import { NotificationFilter } from "@/components/admin/notifications/notification-filter";
import { NotificationSkeleton } from "@/components/admin/notifications/notification-skeleton";

export default function AdminNotificationsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch daftar notifikasi sesuai paginasi & filter
  const { data, isLoading, isPlaceholderData } = useQuery<NotificationResponse>(
    {
      queryKey: ["admin-notifications-page", page, filter],
      queryFn: async () => {
        const res = await apiClient.get<{
          success: boolean;
          data: NotificationResponse;
        }>("/notifications", {
          params: {
            page,
            limit,
            unread: filter === "unread" ? true : undefined,
          },
        });
        return res.data.data;
      },
      placeholderData: (prev) => prev,
      refetchInterval: 30000,
    },
  );

  // Mutasi tanda satu terbaca
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications-page"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] }); // Sinkronkan badge navbar
    },
  });

  // Mutasi tanda semua terbaca
  const markAllMutation = useMutation({
    mutationFn: async () => {
      await apiClient.patch("/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications-page"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
  });

  const total = data?.total || 0;
  const unreadCount = data?.unreadCount || 0;
  const totalPages = Math.ceil(total / limit) || 1;
  const notifications = data?.data || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Halaman */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0e1738] dark:text-zinc-100 flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-indigo-600" />
            <span>Pemberitahuan Sistem</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Pantau aktivitas keamanan ledger, pemalsuan dokumen, dan operasional
            penerbitan.
          </p>
        </div>
      </div>

      {/* Toolbar Filter */}
      <NotificationFilter
        filter={filter}
        onFilterChange={(newFilter) => {
          setFilter(newFilter);
          setPage(1);
        }}
        unreadCount={unreadCount}
        total={total}
        onMarkAllAsRead={() => markAllMutation.mutate()}
        isMarkingAll={markAllMutation.isPending}
      />

      {/* Konten Notifikasi */}
      {isLoading ? (
        <NotificationSkeleton />
      ) : notifications.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center p-6 rounded-3xl border border-dashed border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30">
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-400 mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <span className="font-bold text-sm text-[#0e1738] dark:text-zinc-100">
            Tidak ada notifikasi
          </span>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Semua aktivitas sistem dalam keadaan aman dan tidak ada
            pemberitahuan yang memerlukan tindakan.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <NotificationItem
              key={item.id}
              notification={item}
              onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
              isPending={markAsReadMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Paginasi Navigasi */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-zinc-800">
          <span className="text-xs text-slate-500 dark:text-zinc-400">
            Halaman{" "}
            <span className="font-bold text-slate-700 dark:text-zinc-200">
              {page}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-slate-700 dark:text-zinc-200">
              {totalPages}
            </span>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1 || isPlaceholderData}
              className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-zinc-300" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages || isPlaceholderData}
              className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Halaman Selanjutnya"
            >
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-zinc-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
