import { useState, useEffect } from "react";
import { getStats } from "../services/api";
import { INITIAL_STATS } from "../data/mockStats";

function normalizeStats(apiStats) {
  const map = {};
  apiStats.forEach(s => { map[s.stat_key] = s.stat_value; });
  return {
    schools:     map.total_schools  ?? INITIAL_STATS.schools,
    students:    map.total_students ?? INITIAL_STATS.students,
    activeNeeds: map.active_needs   ?? INITIAL_STATS.activeNeeds,
    teachers:    map.total_teachers ?? INITIAL_STATS.teachers,
  };
}

export function useStats() {
  const [stats,     setStats]     = useState(INITIAL_STATS);
  const [rawStats,  setRawStats]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getStats();
        setRawStats(data);
        setStats(normalizeStats(data));
        setUsingMock(false);
      } catch {
        setStats(INITIAL_STATS);
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return { stats, setStats, rawStats, setRawStats, loading, usingMock };
}
