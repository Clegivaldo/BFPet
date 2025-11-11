type DbRecoveryInfo = {
  when: string;
  reason?: string;
};

let recoveryListeners: ((info: DbRecoveryInfo) => void)[] = [];

export function onDbRecovery(cb: (info: DbRecoveryInfo) => void) {
  recoveryListeners.push(cb);
  return () => {
    recoveryListeners = recoveryListeners.filter((l) => l !== cb);
  };
}

export function emitDbRecovery(info: DbRecoveryInfo) {
  recoveryListeners.forEach((cb) => {
    try {
      cb(info);
    } catch (e) {
      // ignore listener errors
    }
  });
}

export const dbEvents = {
  onDbRecovery,
  emitDbRecovery,
};
