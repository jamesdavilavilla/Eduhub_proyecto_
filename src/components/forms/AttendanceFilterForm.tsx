"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  grades: { id: number; name: string }[];
};

const AttendanceFilterForm = ({ grades }: Props) => {
  const router = useRouter();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [gradeId, setGradeId] = useState<number | undefined>();

  const handleSearch = () => {
    if (!gradeId) return;
    const params = new URLSearchParams({
      month: String(month),
      year: String(year),
      gradeId: String(gradeId),
    });
    router.push(`/list/attendance?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4 flex-wrap mb-4">
      <div>
        <label className="block text-sm font-medium mb-1">Select Month:</label>
        <input
          type="month"
          value={`${year}-${String(month + 1).padStart(2, "0")}`}
          onChange={(e) => {
            const [y, m] = e.target.value.split("-");
            setYear(Number(y));
            setMonth(Number(m) - 1);
          }}
          className="border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Select Grade:</label>
        <select
          value={gradeId}
          onChange={(e) => setGradeId(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          <option value="">-- Select Grade --</option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-6"
      >
        Search
      </button>
    </div>
  );
};

export default AttendanceFilterForm;
