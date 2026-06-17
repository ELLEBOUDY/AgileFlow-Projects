interface TeamTabProps {
  team: any[];
}

export default function TeamTab({ team }: TeamTabProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4 animate-in fade-in-50">
      {team.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8 col-span-full">
          No explicit members allocated yet.
        </p>
      ) : (
        team.map((member) => (
          <div
            key={member.id}
            className="border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1329]/40 rounded-xl p-4 flex items-center gap-4 shadow-sm dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/20 dark:border-primary/30 flex items-center justify-center font-bold text-sm shrink-0">
              {member.name?.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              {" "}
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {member.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {member.role}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">
                {member.email}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
