// 针对 js/main.js 实际交互行为的测试用例。
// 每个用例都会给页面创建一个全新的 iframe（真实加载 index.html + js/main.js），
// 在其中触发真实的滚动 / 点击 / IntersectionObserver 事件，并断言真实产生的 DOM 结果。

function loadFreshPage() {
  return new Promise((resolve, reject) => {
    const old = document.getElementById('sut-frame');
    if (old) old.remove();
    const iframe = document.createElement('iframe');
    iframe.id = 'sut-frame';
    iframe.style.width = '400px';
    iframe.style.height = '800px';
    iframe.addEventListener('load', () => resolve(iframe), { once: true });
    iframe.addEventListener('error', () => reject(new Error('iframe 加载失败')), { once: true });
    // 加时间戳防止浏览器复用旧的文档实例，确保 main.js 每次都重新执行。
    iframe.src = '/index.html?t=' + Date.now() + Math.random();
    document.body.appendChild(iframe);
  });
}

test('导航栏：滚动超过 20px 后添加 scrolled 类，滚回顶部后移除', async () => {
  const iframe = await loadFreshPage();
  const win = iframe.contentWindow;
  const doc = iframe.contentDocument;
  const navbar = doc.getElementById('navbar');

  assertFalse(navbar.classList.contains('scrolled'), '页面刚加载、未滚动时不应有 scrolled 类');

  win.scrollTo(0, 100);
  await waitUntil(() => navbar.classList.contains('scrolled'), 2000);
  assertTrue(navbar.classList.contains('scrolled'), '滚动到 100px 后应添加 scrolled 类');

  win.scrollTo(0, 0);
  await waitUntil(() => !navbar.classList.contains('scrolled'), 2000);
  assertFalse(navbar.classList.contains('scrolled'), '滚回顶部后应移除 scrolled 类');
});

test('汉堡菜单：点击按钮展开导航链接并设置 aria-expanded=true，再次点击则收起', async () => {
  const iframe = await loadFreshPage();
  const doc = iframe.contentDocument;
  const navToggle = doc.getElementById('navToggle');
  const navLinks = doc.getElementById('navLinks');

  assertEqual(navToggle.getAttribute('aria-expanded'), 'false', '初始 aria-expanded 应为 false');
  assertFalse(navLinks.classList.contains('open'), '初始菜单不应展开');

  navToggle.click();
  assertTrue(navLinks.classList.contains('open'), '点击后导航链接应展开');
  assertTrue(navToggle.classList.contains('open'), '点击后按钮自身应带 open 类');
  assertEqual(navToggle.getAttribute('aria-expanded'), 'true', '展开后 aria-expanded 应为 true');

  navToggle.click();
  assertFalse(navLinks.classList.contains('open'), '再次点击后导航链接应收起');
  assertFalse(navToggle.classList.contains('open'), '再次点击后按钮不应带 open 类');
  assertEqual(navToggle.getAttribute('aria-expanded'), 'false', '收起后 aria-expanded 应为 false');
});

test('汉堡菜单：展开后点击某个导航链接会自动收起菜单', async () => {
  const iframe = await loadFreshPage();
  const doc = iframe.contentDocument;
  const navToggle = doc.getElementById('navToggle');
  const navLinks = doc.getElementById('navLinks');

  navToggle.click();
  assertTrue(navLinks.classList.contains('open'), '前置条件：菜单应先处于展开状态');

  const aboutLink = doc.querySelector('.nav-link[data-nav="about"]');
  aboutLink.click();

  assertFalse(navLinks.classList.contains('open'), '点击导航链接后菜单应收起');
  assertFalse(navToggle.classList.contains('open'), '点击导航链接后按钮不应再带 open 类');
  assertEqual(navToggle.getAttribute('aria-expanded'), 'false', '点击导航链接后 aria-expanded 应为 false');
});

test('返回顶部按钮：滚动超过视口高度 80% 时显示，滚回时隐藏', async () => {
  const iframe = await loadFreshPage();
  const win = iframe.contentWindow;
  const doc = iframe.contentDocument;
  const backToTop = doc.getElementById('backToTop');

  assertFalse(backToTop.classList.contains('visible'), '初始不应显示返回顶部按钮');

  const threshold = win.innerHeight * 0.8;
  win.scrollTo(0, threshold + 50);
  await waitUntil(() => backToTop.classList.contains('visible'), 2000);
  assertTrue(backToTop.classList.contains('visible'), '超过阈值后应显示返回顶部按钮');

  win.scrollTo(0, 0);
  await waitUntil(() => !backToTop.classList.contains('visible'), 2000);
  assertFalse(backToTop.classList.contains('visible'), '滚回顶部后应隐藏返回顶部按钮');
});

test('返回顶部按钮：点击后以 { top: 0, behavior: "smooth" } 调用 scrollTo', async () => {
  const iframe = await loadFreshPage();
  const win = iframe.contentWindow;
  const doc = iframe.contentDocument;
  const backToTop = doc.getElementById('backToTop');

  const calls = [];
  win.scrollTo = (...args) => calls.push(args);

  backToTop.click();

  assertEqual(calls.length, 1, 'scrollTo 应且只应被调用一次');
  assertEqual(calls[0][0].top, 0, 'scrollTo 的 top 参数应为 0');
  assertEqual(calls[0][0].behavior, 'smooth', 'scrollTo 的 behavior 参数应为 smooth');
});

test('页脚：年份元素文本内容等于当前实际年份', async () => {
  const iframe = await loadFreshPage();
  const doc = iframe.contentDocument;
  const yearEl = doc.getElementById('year');

  assertEqual(yearEl.textContent, String(new Date().getFullYear()), '页脚年份应等于当前年份');
});

test('滚动淡入：.fade-in 元素进入视口后获得 visible 类', async () => {
  const iframe = await loadFreshPage();
  const doc = iframe.contentDocument;
  const target = doc.querySelector('#skills .fade-in');

  assertTrue(!!target, '#skills 区块内应存在 .fade-in 元素');
  assertFalse(target.classList.contains('visible'), '滚动进入视口前不应有 visible 类');

  target.scrollIntoView();
  await waitUntil(() => target.classList.contains('visible'), 3000);
  assertTrue(target.classList.contains('visible'), '滚动进入视口后应添加 visible 类');
});

test('导航高亮：滚动到某板块时对应导航链接获得 active 类，其余链接失去 active 类', async () => {
  const iframe = await loadFreshPage();
  const doc = iframe.contentDocument;
  const homeLink = doc.querySelector('.nav-link[data-nav="home"]');
  const careerLink = doc.querySelector('.nav-link[data-nav="career"]');
  const careerSection = doc.getElementById('career');

  assertTrue(homeLink.classList.contains('active'), '初始应高亮首页导航链接');
  assertFalse(careerLink.classList.contains('active'), '初始职务经历链接不应高亮');

  careerSection.scrollIntoView();
  await waitUntil(() => careerLink.classList.contains('active'), 3000);

  assertTrue(careerLink.classList.contains('active'), '滚动到职务经历板块后该链接应高亮');
  assertFalse(homeLink.classList.contains('active'), '滚动离开首页板块后首页链接应失去高亮');
});
