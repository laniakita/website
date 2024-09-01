// inspired by: https://www.rdiachenko.com/posts/arch/rate-limiting/sliding-window-algorithm/
// Unoptimized limiter:
export class SlidingWindowLimiter {
  maxCount: number;
  windowLengthInMs: number;
  t0: number;
  userSlidingWindow: Record<string, number[]> = {};

  constructor(maxCount: number, windowLengthInMs: number, t0: number) {
    this.maxCount = maxCount;
    this.windowLengthInMs = windowLengthInMs;
    this.t0 = t0;
  }

  allowed(userId: string) {
    const slidingWindow = this.userSlidingWindow[userId]
      ? this.userSlidingWindow[userId]
      : (this.userSlidingWindow[userId] = []);

    while (slidingWindow[0] !== undefined && slidingWindow[0] + this.windowLengthInMs < Date.now()) {
      slidingWindow.shift();
    }

    if (slidingWindow.length >= this.maxCount) {
      return false;
    }

    slidingWindow.push(Date.now());
    return true;
  }
}

class FixedWindow {
  timestamp: number;
  count: number;
  constructor(timestamp: number, count: number) {
    this.timestamp = timestamp;
    this.count = count;
  }
}

class SlidingWindow {
  previousFixedWindow: FixedWindow;
  currentFixedWindow: FixedWindow;
  constructor(previousFixedWindow: FixedWindow, currentFixedWindow: FixedWindow) {
    this.previousFixedWindow = previousFixedWindow;
    this.currentFixedWindow = currentFixedWindow;
  }
}

export class SlidingWindowCounterRateLimiter {
  maxCount: number;
  windowLengthInMs: number;
  userSlidingWindow: Record<string, SlidingWindow> = {};

  constructor(maxCount: number, windowLengthInMs: number) {
    this.maxCount = maxCount;
    this.windowLengthInMs = windowLengthInMs;
  }

  allowed(userId: string) {
    const t0 = Date.now();
    const slidingWindow = this.userSlidingWindow[userId]
      ? this.userSlidingWindow[userId]
      : (this.userSlidingWindow[userId] = new SlidingWindow(new FixedWindow(t0, 0), new FixedWindow(t0, 0)));

    let currentFixedWindow = slidingWindow.currentFixedWindow;
    let previousFixedWindow = slidingWindow.previousFixedWindow;

    if (currentFixedWindow.timestamp + this.windowLengthInMs < t0) {
      previousFixedWindow = currentFixedWindow;
      currentFixedWindow = new FixedWindow(t0, 0);
      this.userSlidingWindow[userId] = new SlidingWindow(previousFixedWindow, currentFixedWindow);
    }

    // calc window start and end
    const slidingWindowStart = Math.max(0, t0 - this.windowLengthInMs);
    const previousFixedWindowEnd = previousFixedWindow.timestamp + this.windowLengthInMs;
    // calc weight of previous window based on overlap with the sliding window
    const previousFixedWindowWeight = Math.max(0, previousFixedWindowEnd - slidingWindowStart) / this.windowLengthInMs;
    // total request count
    const count = previousFixedWindow.count * previousFixedWindowWeight + currentFixedWindow.count;

    /*
     * if request count within the sliding window >= maxCount => reject;
     * otherwise, update the request window & allow request.
     * */
    if (count >= this.maxCount) {
      return false;
    }

    currentFixedWindow = new FixedWindow(currentFixedWindow.timestamp, currentFixedWindow.count + 1);
    this.userSlidingWindow[userId] = new SlidingWindow(previousFixedWindow, currentFixedWindow);
    return true;
  }
}
