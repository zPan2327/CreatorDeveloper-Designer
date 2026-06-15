/* ============================================
   AI CHAT — Main Script
   ============================================ */

// ============================================
// THEME SYSTEM
// ============================================
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;

  function applyTheme(dark) {
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    html.style.colorScheme = dark ? 'dark' : 'light';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  applyTheme(isDark);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const nextDark = html.getAttribute('data-theme') !== 'dark';
      if (document.startViewTransition) {
        document.startViewTransition(() => applyTheme(nextDark));
      } else {
        applyTheme(nextDark);
      }
    });
  }
}

// ============================================
// SIDEBAR — Mobile toggle
// ============================================
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebarToggle');
  const overlay = document.getElementById('sidebarOverlay');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }
}

// ============================================
// CHAT ENGINE
// ============================================
const ChatEngine = {
  messages: [],
  isStreaming: false,
  currentChatId: null,

  // Simulated AI responses
  responses: {
    '帮我写一段创意自我介绍': `当然！这是一段创意自我介绍：

> 你好，我是**子恒** — 一个用代码写诗、用设计讲故事的人。

我相信每一行代码都有温度，每一个像素都有意义。从前端开发到 UI 设计，从 3D 图形到创意编程，我热衷于在技术与美学的交汇处创造令人心动的数字体验。

💡 **我的信条：** 创造，不止于代码。

如果你也相信科技可以有诗意，那我们一定有很多可以聊的。`,

    '用代码实现一个粒子动画效果': `好的！这是一个基于 Canvas 的粒子动画效果：

\`\`\`javascript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
for (let i = 0; i < 200; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 2 + 0.5,
    color: \`hsl(\${210 + Math.random() * 30}, 80%, 60%)\`
  });
}

function animate() {
  ctx.fillStyle = 'rgba(5, 7, 10, 0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });

  requestAnimationFrame(animate);
}
animate();
\`\`\`

**效果说明：**
- 200 个粒子在画布上自由运动
- 碰到边界会反弹
- 半透明背景产生拖尾效果
- 蓝色调配色方案

你可以调整 \`粒子数量\`、\`速度\` 和 \`颜色\` 来获得不同效果！`,

    '推荐几个提升设计审美的方法': `提升设计审美是一个长期积累的过程，以下是几个实用方法：

**1. 每日设计灵感收集**
- 浏览 Dribbble、Behance、Pinterest
- 建立自己的灵感文件夹，分类收藏
- 关注优秀设计师的作品

**2. 学习设计原理**
- 掌握色彩理论（互补色、类似色）
- 理解排版规则（对齐、对比、重复、亲密性）
- 研究网格系统和响应式设计

**3. 临摹优秀作品**
- 选择喜欢的设计，尝试还原
- 分析每个设计决策的原因
- 从模仿到创新的渐进过程

**4. 跨领域学习**
- 🎨 艺术：参观画展、学习构图
- 📷 摄影：练习光影和构图
- 🏛 建筑：理解空间和比例
- 🎵 音乐：感受节奏和韵律

**5. 实践与反馈**
- 坚持每天做一个小设计
- 加入设计社区获取反馈
- 参与设计挑战（如 Daily UI）

记住：**审美是可以训练的肌肉**，关键在于持续的刻意练习。`,

    '解释一下 Three.js 的基本原理': `Three.js 是一个基于 WebGL 的 3D 图形库，让我为你解释它的核心原理：

**核心概念**

**1. 场景（Scene）**
场景是所有 3D 对象的容器，类似于一个舞台。

**2. 相机（Camera）**
相机定义了观察场景的视角，常用透视相机：
\`\`\`javascript
const camera = new THREE.PerspectiveCamera(
  75,                    // 视场角
  window.innerWidth / window.innerHeight,  // 宽高比
  0.1,                  // 近裁剪面
  1000                  // 远裁剪面
);
\`\`\`

**3. 渲染器（Renderer）**
将 3D 场景渲染到 2D 画布上：
\`\`\`javascript
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
\`\`\`

**4. 几何体 + 材质 = 网格**
\`\`\`javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x0071E3 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
\`\`\`

**5. 渲染循环**
\`\`\`javascript
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
\`\`\`

**工作流程：**
\`创建场景 → 添加物体 → 设置相机 → 配置光照 → 渲染循环\`

这就是主页背景粒子效果的基础原理！`
  },

  // Generic fallback responses
  fallbackResponses: [
    `这是个很好的问题！让我来为你解答。

根据我的理解，这个问题涉及到多个方面。首先，我们需要考虑基础概念，然后再深入到具体的实现细节。

如果你能提供更多上下文，我可以给出更精准的回答。`,

    `很有意思的想法！以下是我的一些思考：

**关键点：**
- 首先明确目标和需求
- 然后选择合适的工具和方法
- 最后通过实践来验证

有什么具体的问题我可以帮你解答吗？`,

    `让我来帮你分析一下这个问题。

从技术角度来看，这需要我们综合考虑多个因素。我的建议是：

1. **明确需求** — 先搞清楚要解决什么问题
2. **调研方案** — 看看现有的解决方案
3. **动手实践** — 最好的学习方式就是动手做

需要我详细展开某个方面吗？`
  ],

  init() {
    this.chatInput = document.getElementById('chatInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.messagesEl = document.getElementById('messages');
    this.welcomeScreen = document.getElementById('welcomeScreen');
    this.typingIndicator = document.getElementById('typingIndicator');
    this.chatHistory = document.getElementById('chatHistory');

    this.bindEvents();
    this.loadHistory();
  },

  bindEvents() {
    // Send button
    this.sendBtn.addEventListener('click', () => this.send());

    // Enter to send, Shift+Enter for newline
    this.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.send();
      }
    });

    // Auto-resize textarea
    this.chatInput.addEventListener('input', () => {
      this.chatInput.style.height = 'auto';
      this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 160) + 'px';

      // Toggle send button
      this.sendBtn.classList.toggle('active', this.chatInput.value.trim().length > 0);
    });

    // Suggestion cards
    document.querySelectorAll('.suggestion-card').forEach(card => {
      card.addEventListener('click', () => {
        const prompt = card.dataset.prompt;
        if (prompt) {
          this.chatInput.value = prompt;
          this.sendBtn.classList.add('active');
          this.send();
        }
      });
    });

    // New chat button
    const newChatBtn = document.getElementById('newChatBtn');
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => this.newChat());
    }
  },

  send() {
    const text = this.chatInput.value.trim();
    if (!text || this.isStreaming) return;

    // Hide welcome, show messages
    this.welcomeScreen.style.display = 'none';
    this.messagesEl.classList.add('active');

    // Add user message
    this.addMessage('user', text);

    // Clear input
    this.chatInput.value = '';
    this.chatInput.style.height = 'auto';
    this.sendBtn.classList.remove('active');

    // Generate chat ID if needed
    if (!this.currentChatId) {
      this.currentChatId = Date.now().toString();
      this.addToHistory(text);
    }

    // Simulate AI response
    this.simulateResponse(text);
  },

  addMessage(role, content) {
    const msg = { role, content, timestamp: Date.now() };
    this.messages.push(msg);

    const div = document.createElement('div');
    div.className = `message ${role}`;

    const avatarContent = role === 'user'
      ? '你'
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`;

    const senderName = role === 'user' ? '你' : 'ZIHENG AI';
    const formattedContent = this.formatMessage(content);

    div.innerHTML = `
      <div class="message-avatar">${avatarContent}</div>
      <div class="message-content">
        <div class="message-sender">${senderName}</div>
        <div class="message-text">${formattedContent}</div>
        ${role === 'assistant' ? `
        <div class="message-actions">
          <button class="msg-action-btn copy-btn" title="复制">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
          <button class="msg-action-btn" title="点赞">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
          </button>
        </div>` : ''}
      </div>
    `;

    this.messagesEl.appendChild(div);
    this.scrollToBottom();

    // Bind copy button
    const copyBtn = div.querySelector('.copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(content).then(() => {
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
          }, 2000);
        });
      });
    }
  },

  formatMessage(text) {
    // Simple markdown-like formatting
    let html = text;

    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code>${this.escapeHtml(code.trim())}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Blockquote
    html = html.replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid var(--accent);padding-left:1rem;color:var(--text-muted);margin:0.5rem 0;">$1</blockquote>');

    // Unordered list
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Ordered list
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');

    return html;
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  async simulateResponse(userText) {
    this.isStreaming = true;
    this.typingIndicator.classList.add('active');
    this.scrollToBottom();

    // Simulate delay
    await this.delay(800 + Math.random() * 1200);

    this.typingIndicator.classList.remove('active');

    // Get response
    const response = this.responses[userText] || this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)];

    // Stream the response
    await this.streamMessage(response);

    this.isStreaming = false;
  },

  async streamMessage(fullText) {
    const div = document.createElement('div');
    div.className = 'message assistant';
    div.innerHTML = `
      <div class="message-avatar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
      </div>
      <div class="message-content">
        <div class="message-sender">ZIHENG AI</div>
        <div class="message-text"><span class="streaming-cursor"></span></div>
      </div>
    `;
    this.messagesEl.appendChild(div);
    this.scrollToBottom();

    const textEl = div.querySelector('.message-text');
    let currentText = '';

    // Stream character by character (simulated)
    const chars = fullText.split('');
    for (let i = 0; i < chars.length; i++) {
      currentText += chars[i];
      textEl.innerHTML = this.formatMessage(currentText) + '<span class="streaming-cursor"></span>';

      // Variable speed: faster for spaces, slower for punctuation
      let delay = 12;
      if (chars[i] === ' ') delay = 6;
      else if ('。，！？.!?'.includes(chars[i])) delay = 80;
      else if (chars[i] === '\n') delay = 40;

      // Only scroll occasionally for performance
      if (i % 20 === 0) this.scrollToBottom();

      await this.delay(delay);
    }

    // Final render without cursor
    textEl.innerHTML = this.formatMessage(fullText);

    // Add action buttons
    const actions = document.createElement('div');
    actions.className = 'message-actions';
    actions.innerHTML = `
      <button class="msg-action-btn copy-btn" title="复制">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      </button>
      <button class="msg-action-btn" title="点赞">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
      </button>
    `;
    div.querySelector('.message-content').appendChild(actions);

    // Bind copy
    const copyBtn = actions.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(fullText).then(() => {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
        }, 2000);
      });
    });

    this.scrollToBottom();

    // Save to messages
    this.messages.push({ role: 'assistant', content: fullText, timestamp: Date.now() });
  },

  newChat() {
    this.messages = [];
    this.currentChatId = null;
    this.messagesEl.innerHTML = '';
    this.messagesEl.classList.remove('active');
    this.welcomeScreen.style.display = '';
    this.welcomeScreen.style.animation = 'none';
    this.welcomeScreen.offsetHeight; // reflow
    this.welcomeScreen.style.animation = 'welcomeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
    this.chatInput.value = '';
    this.chatInput.style.height = 'auto';
    this.sendBtn.classList.remove('active');
  },

  addToHistory(title) {
    const item = document.createElement('a');
    item.className = 'history-item active';
    item.href = '#';
    item.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span>${title.substring(0, 30)}${title.length > 30 ? '...' : ''}</span>
    `;

    // Remove active from others
    this.chatHistory.querySelectorAll('.history-item').forEach(h => h.classList.remove('active'));

    this.chatHistory.prepend(item);
  },

  loadHistory() {
    // Could load from localStorage in a real app
  },

  scrollToBottom() {
    requestAnimationFrame(() => {
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    });
  },

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  ChatEngine.init();

  // Focus input
  setTimeout(() => {
    document.getElementById('chatInput')?.focus();
  }, 300);

  console.log('%c✦ ZIHENG AI Chat Ready %c| %c智能对话 · 灵感无限',
    'color:#0071E3;font-weight:bold;', '', 'color:#6366F1;');
});
