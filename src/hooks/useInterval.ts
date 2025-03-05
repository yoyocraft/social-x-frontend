import { useEffect, useRef } from 'react';

/**
 * 自定义 Hook: 定期执行一个函数
 * @param callback 要执行的函数
 * @param delay 执行间隔（毫秒），如果为 null，则停止定时器
 * @returns {() => void} clear 清除定时器的方法
 */
const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
      return;
    }

    const tick = () => savedCallback.current?.();
    intervalId.current = setInterval(tick, delay);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [delay]);

  // 返回清除方法，组件可调用 useInterval(...).clear()
  const clear = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  };

  return clear;
};

export default useInterval;
