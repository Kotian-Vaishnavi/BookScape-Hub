import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

const VisitCounter = () => {
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    const countKey = "admin-login-count";
    const sessionKey = "admin-session-counted";

    // ✅ Initialize to 0 if not set yet
    if (!localStorage.getItem(countKey)) {
      localStorage.setItem(countKey, 0);
    }

    // ✅ Increment only once per session (after a successful login)
    if (!sessionStorage.getItem(sessionKey)) {
      let currentCount = parseInt(localStorage.getItem(countKey)) || 0;
      const newCount = currentCount + 1;
      localStorage.setItem(countKey, newCount);
      sessionStorage.setItem(sessionKey, "true");
      setVisits(newCount);
    } else {
      // Just show current value if already counted this session
      const currentCount = parseInt(localStorage.getItem(countKey)) || 0;
      setVisits(currentCount);
    }
  }, []);

  return (
    <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <TrendingUp className="w-8 h-8 text-gray-600" />
      <div>
        <span className="block text-2xl font-bold text-gray-800">{visits}</span>
        <span className="block text-gray-500 font-medium">Admin logins</span>
      </div>
    </div>
  );
};

export default VisitCounter;
