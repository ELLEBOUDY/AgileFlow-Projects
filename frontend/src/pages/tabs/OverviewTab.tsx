interface OverviewTabProps {
  project: any;
  tasks: any[];
  teamCount: number;
  filesCount: number;
}

export default function OverviewTab({
  project,
  tasks,
  teamCount,
  filesCount,
}: OverviewTabProps) {
  const completedTasks = tasks.filter(
    (t) => t.status?.toLowerCase() === "done",
  ).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-4 animate-in fade-in-50">
      {/* 1. كارت About Project */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1329]/50 rounded-xl p-6 space-y-4 shadow-sm dark:shadow-none">
        {/* العنوان: داكن في الـ Light وفاتح في الـ Dark */}
        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">
          About Project
        </h3>
        {/* النص: رمادي متوازن وواضح جداً في القراءة */}
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {project.description ||
            "No extensive summary documentation provided."}
        </p>
      </div>

      {/* 2. كارت Execution Status */}
      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1329]/50 rounded-xl p-6 space-y-4 shadow-sm dark:shadow-none">
        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">
          Execution Status
        </h3>

        {/* النصوص الداخلية والخطوط الفاصلة */}
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          {/* Project Phase */}
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2">
            <span>Project Phase</span>
            <span className="capitalize font-semibold text-blue-600 dark:text-blue-400">
              {project.status?.replace("_", " ")}
            </span>
          </div>

          {/* Task Completion Rate */}
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2">
            <span>Task Completion Rate</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {tasks.length
                ? Math.round((completedTasks / tasks.length) * 100)
                : 0}
              %
            </span>
          </div>

          {/* Active Contributors */}
          <div className="flex justify-between pb-1">
            <span>Active Contributors</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {teamCount} Members
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
