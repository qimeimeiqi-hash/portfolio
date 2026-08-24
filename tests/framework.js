// 极简浏览器测试框架：无需 npm/Node，直接在真实浏览器中运行。
// 用法：调用 test(name, fn) 注册用例，页面加载后调用 runAllTests() 执行。

const __tests = [];

function test(name, fn) {
  __tests.push({ name, fn });
}

function assertEqual(actual, expected, message) {
  if (!Object.is(actual, expected)) {
    throw new Error(
      `${message ? message + ' — ' : ''}期望 ${JSON.stringify(expected)}，实际得到 ${JSON.stringify(actual)}`
    );
  }
}

function assertTrue(condition, message) {
  if (!condition) throw new Error(message || '期望条件为真，但实际为假');
}

function assertFalse(condition, message) {
  if (condition) throw new Error(message || '期望条件为假，但实际为真');
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 轮询等待条件成立，而不是盲目 sleep 后假定通过 —— 超时仍未满足则视为失败。
async function waitUntil(predicate, timeoutMs = 2000, intervalMs = 50) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) return;
    await wait(intervalMs);
  }
  if (!predicate()) {
    throw new Error(`等待 ${timeoutMs}ms 后条件仍未满足`);
  }
}

async function runAllTests(resultsEl) {
  const summary = { total: __tests.length, passed: 0, failed: 0, failures: [] };
  for (const { name, fn } of __tests) {
    const li = document.createElement('li');
    try {
      await fn();
      summary.passed += 1;
      li.textContent = `PASS - ${name}`;
      li.className = 'pass';
      console.log(`[PASS] ${name}`);
    } catch (err) {
      summary.failed += 1;
      summary.failures.push({ name, error: err.message });
      li.textContent = `FAIL - ${name}: ${err.message}`;
      li.className = 'fail';
      console.error(`[FAIL] ${name}: ${err.message}`);
    }
    if (resultsEl) resultsEl.appendChild(li);
  }
  const summaryEl = document.getElementById('summary');
  const summaryText = `共 ${summary.total} 项，通过 ${summary.passed} 项，失败 ${summary.failed} 项`;
  if (summaryEl) {
    summaryEl.textContent = summaryText;
    summaryEl.className = summary.failed === 0 ? 'pass' : 'fail';
  }
  window.__testSummary = summary;
  console.log('TEST_SUMMARY ' + JSON.stringify(summary));
  return summary;
}
