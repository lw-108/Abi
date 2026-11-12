import { useState, useEffect } from "react";

export function useBattery() {
  const [batteryState, setBatteryState] = useState({
    level: 95,
    charging: true,
    supported: false,
    chargingTime: 0,
    dischargingTime: Infinity,
  });

  useEffect(() => {
    let batteryInstance = null;
    let updateHandler = null;
    let isMounted = true;

    if (typeof navigator !== "undefined" && typeof navigator.getBattery === "function") {
      navigator.getBattery()
        .then((batt) => {
          if (!isMounted) return;
          batteryInstance = batt;

          const handleUpdate = () => {
            if (!isMounted) return;
            setBatteryState({
              level: Math.round(batt.level * 100),
              charging: Boolean(batt.charging),
              supported: true,
              chargingTime: batt.chargingTime,
              dischargingTime: batt.dischargingTime,
            });
          };

          updateHandler = handleUpdate;
          handleUpdate();
          batt.addEventListener("levelchange", handleUpdate);
          batt.addEventListener("chargingchange", handleUpdate);
        })
        .catch(() => {
          // Browser restrictions fallback
        });
    }

    return () => {
      isMounted = false;
      if (batteryInstance && updateHandler) {
        try {
          batteryInstance.removeEventListener("levelchange", updateHandler);
          batteryInstance.removeEventListener("chargingchange", updateHandler);
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return batteryState;
}
