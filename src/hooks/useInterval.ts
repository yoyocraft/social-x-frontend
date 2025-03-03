import { useEffect, useRef } from 'react';

/**
 * 自定义 Hook: 定期执行一个函数
 * @param callback 要执行的函数
 * @param delay 执行间隔（毫秒），如果为 null，则停止定时器
 */
const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
};

export default useInterval;
