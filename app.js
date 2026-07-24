/* 
  Piper Software Solutions LLC - Core Application JavaScript
  Includes: Interactive System Canvas, Cloud ROI Calculator, API Sandbox, CLI Terminal, Telemetry Tickers
*/

document.addEventListener('DOMContentLoaded', () => {
  initHeroTelemetry();
  initArchitectureCanvas();
  initCloudCalculator();
  initApiSandbox();
  initTerminalCli();
  initContactForm();
});

/* ----------------------------------------------------
   1. HERO TELEMETRY TICKER
---------------------------------------------------- */
function initHeroTelemetry() {
  const rpsEl = document.getElementById('heroGatewayRps');
  const spatialLatencyEl = document.getElementById('heroSpatialLatency');
  const cacheHitEl = document.getElementById('heroCacheHit');
  const podCountEl = document.getElementById('heroPodCount');

  if (!rpsEl) return;

  setInterval(() => {
    // Subtle jitter to simulate live enterprise telemetry
    const baseRps = 42800 + Math.floor(Math.random() * 450);
    const latency = (7.8 + Math.random() * 1.4).toFixed(1);
    const hitRatio = (99.1 + Math.random() * 0.5).toFixed(1);

    rpsEl.textContent = `${baseRps.toLocaleString()} req/s`;
    spatialLatencyEl.textContent = `${latency} ms`;
    cacheHitEl.textContent = `${hitRatio}% Hit Ratio`;
  }, 2000);
}

/* ----------------------------------------------------
   2. INTERACTIVE ARCHITECTURE CANVAS & STRESS SIMULATOR
---------------------------------------------------- */
function initArchitectureCanvas() {
  const canvas = document.getElementById('architectureCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 480;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let currentLoad = 'normal';
  let dbStatus = 'healthy';
  let cacheStatus = 'healthy';
  
  const loadConfig = {
    normal: { rps: '5,000', latency: '11.2 ms', hitRatio: '99.2%', pods: '12 Pods', packetSpeed: 3, packetDensity: 4 },
    spike: { rps: '50,000', latency: '16.8 ms', hitRatio: '97.8%', pods: '48 Pods', packetSpeed: 6, packetDensity: 12 },
    extreme: { rps: '200,000', latency: '24.5 ms', hitRatio: '94.5%', pods: '120 Pods', packetSpeed: 9, packetDensity: 24 }
  };

  const nodes = [
    { id: 'client', label: 'Client GPS Stream', sub: 'Leaflet.js/GeoLocation', xRatio: 0.1, yRatio: 0.5, color: '#00f2fe' },
    { id: 'gateway', label: 'API Gateway', sub: 'FastAPI Router', xRatio: 0.28, yRatio: 0.5, color: '#00e676' },
    { id: 'app1', label: 'Spatial Engine', sub: 'Haversine Evaluator', xRatio: 0.5, yRatio: 0.25, color: '#3b82f6' },
    { id: 'app2', label: 'Backend API', sub: 'Python/FastAPI', xRatio: 0.5, yRatio: 0.5, color: '#3b82f6' },
    { id: 'app3', label: 'Worker Cluster', sub: 'K8s Replicas', xRatio: 0.5, yRatio: 0.75, color: '#3b82f6' },
    { id: 'redis', label: 'Redis L2 Cache', sub: 'Sub-1ms Tier', xRatio: 0.72, yRatio: 0.32, color: '#f59e0b' },
    { id: 'kafka', label: 'Kafka Event Bus', sub: 'Spatial Stream', xRatio: 0.72, yRatio: 0.68, color: '#8b5cf6' },
    { id: 'db', label: 'Firebase Firestore', sub: 'NoSQL Collection', xRatio: 0.9, yRatio: 0.5, color: '#00e676' }
  ];

  const connections = [
    { from: 'client', to: 'gateway' },
    { from: 'gateway', to: 'app1' },
    { from: 'gateway', to: 'app2' },
    { from: 'gateway', to: 'app3' },
    { from: 'app1', to: 'redis' },
    { from: 'app2', to: 'redis' },
    { from: 'app2', to: 'db' },
    { from: 'app3', to: 'kafka' },
    { from: 'redis', to: 'db' },
    { from: 'kafka', to: 'db' }
  ];

  let packets = [];

  function createPacket(conn) {
    return {
      fromId: conn.from,
      toId: conn.to,
      progress: 0,
      speed: (0.005 + Math.random() * 0.004) * loadConfig[currentLoad].packetSpeed
    };
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;

    ctx.lineWidth = 2;
    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);

      ctx.beginPath();
      ctx.moveTo(fromNode.xRatio * w, fromNode.yRatio * h);
      ctx.lineTo(toNode.xRatio * w, toNode.yRatio * h);

      if (conn.to === 'db' && dbStatus === 'failing') {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.setLineDash([4, 4]);
      } else if (conn.to === 'redis' && cacheStatus === 'purged') {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
        ctx.setLineDash([4, 4]);
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });

    const targetPacketCount = loadConfig[currentLoad].packetDensity * connections.length;
    while (packets.length < targetPacketCount) {
      const randomConn = connections[Math.floor(Math.random() * connections.length)];
      packets.push(createPacket(randomConn));
    }

    packets.forEach((p, idx) => {
      p.progress += p.speed;
      if (p.progress >= 1) {
        const randomConn = connections[Math.floor(Math.random() * connections.length)];
        packets[idx] = createPacket(randomConn);
        return;
      }

      const fromNode = nodes.find(n => n.id === p.fromId);
      const toNode = nodes.find(n => n.id === p.toId);

      const px = fromNode.xRatio * w + (toNode.xRatio * w - fromNode.xRatio * w) * p.progress;
      const py = fromNode.yRatio * h + (toNode.yRatio * h - fromNode.yRatio * h) * p.progress;

      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = (p.toId === 'db' && dbStatus === 'failing') ? '#ef4444' : '#00e676';
      ctx.shadowBlur = 10;
      ctx.shadowColor = ctx.fillStyle;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    nodes.forEach(node => {
      const nx = node.xRatio * w;
      const ny = node.yRatio * h;

      let nodeColor = node.color;
      if (node.id === 'db' && dbStatus === 'failing') nodeColor = '#ef4444';
      if (node.id === 'redis' && cacheStatus === 'purged') nodeColor = '#f59e0b';

      ctx.beginPath();
      ctx.roundRect(nx - 75, ny - 28, 150, 56, 12);
      ctx.fillStyle = 'rgba(13, 24, 38, 0.9)';
      ctx.strokeStyle = nodeColor;
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();

      ctx.font = '600 13px Outfit, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, nx, ny - 4);

      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillStyle = nodeColor;
      ctx.fillText(node.sub, nx, ny + 14);
    });

    requestAnimationFrame(render);
  }

  render();

  document.querySelectorAll('.sim-btn[data-load]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.sim-btn[data-load]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentLoad = btn.getAttribute('data-load');
      const cfg = loadConfig[currentLoad];

      document.getElementById('simRps').textContent = cfg.rps;
      document.getElementById('simLatency').textContent = cfg.latency;
      document.getElementById('simHitRatio').textContent = cfg.hitRatio;
      document.getElementById('simReplicas').textContent = cfg.pods;
    });
  });

  const simKillDbBtn = document.getElementById('simKillDb');
  if (simKillDbBtn) {
    simKillDbBtn.addEventListener('click', () => {
      dbStatus = 'failing';
      document.getElementById('simLatency').textContent = '142.5 ms (Failover)';
      document.getElementById('simLatency').style.color = '#ef4444';

      setTimeout(() => {
        dbStatus = 'healthy';
        document.getElementById('simLatency').style.color = 'var(--accent-green)';
        document.getElementById('simLatency').textContent = loadConfig[currentLoad].latency;
      }, 3500);
    });
  }

  const simClearCacheBtn = document.getElementById('simClearCache');
  if (simClearCacheBtn) {
    simClearCacheBtn.addEventListener('click', () => {
      cacheStatus = 'purged';
      document.getElementById('simHitRatio').textContent = '0.0% (Cold)';
      document.getElementById('simHitRatio').style.color = '#f59e0b';

      setTimeout(() => {
        cacheStatus = 'healthy';
        document.getElementById('simHitRatio').style.color = 'var(--accent-green)';
        document.getElementById('simHitRatio').textContent = loadConfig[currentLoad].hitRatio;
      }, 3000);
    });
  }

  const simResetBtn = document.getElementById('simReset');
  if (simResetBtn) {
    simResetBtn.addEventListener('click', () => {
      dbStatus = 'healthy';
      cacheStatus = 'healthy';
      document.getElementById('simLatency').style.color = 'var(--accent-green)';
      document.getElementById('simHitRatio').style.color = 'var(--accent-green)';
      const cfg = loadConfig[currentLoad];
      document.getElementById('simRps').textContent = cfg.rps;
      document.getElementById('simLatency').textContent = cfg.latency;
      document.getElementById('simHitRatio').textContent = cfg.hitRatio;
    });
  }
}

/* ----------------------------------------------------
   3. CLOUD ROI & SAVINGS CALCULATOR
---------------------------------------------------- */
function initCloudCalculator() {
  const mauSlider = document.getElementById('mauSlider');
  const reqSlider = document.getElementById('reqSlider');
  const storageSlider = document.getElementById('storageSlider');

  if (!mauSlider) return;

  function updateCalc() {
    const mau = parseInt(mauSlider.value, 10);
    const req = parseInt(reqSlider.value, 10);
    const storage = parseInt(storageSlider.value, 10);

    document.getElementById('mauVal').textContent = `${mau.toLocaleString()} Users`;
    document.getElementById('reqVal').textContent = `${(req / 1000000).toFixed(1)}M Req/Day`;
    document.getElementById('storageVal').textContent = `${storage >= 1000 ? (storage / 1000).toFixed(1) + ' TB' : storage + ' GB'}`;

    const baseUnoptimized = (mau / 1000 * 15) + (req / 1000000 * 320) + (storage * 0.12);
    const optimized = baseUnoptimized * 0.40;
    const monthlySavings = baseUnoptimized - optimized;
    const annualSavings = monthlySavings * 12;

    document.getElementById('unoptimizedMonthly').textContent = `$${Math.round(baseUnoptimized).toLocaleString()} / mo`;
    document.getElementById('optimizedMonthly').textContent = `$${Math.round(optimized).toLocaleString()} / mo`;
    document.getElementById('annualSavings').textContent = `$${Math.round(annualSavings).toLocaleString()} / yr`;
  }

  mauSlider.addEventListener('input', updateCalc);
  reqSlider.addEventListener('input', updateCalc);
  storageSlider.addEventListener('input', updateCalc);

  updateCalc();
}

/* ----------------------------------------------------
   4. INTERACTIVE API SANDBOX
---------------------------------------------------- */
function initApiSandbox() {
  const select = document.getElementById('endpointSelect');
  const methodBadge = document.getElementById('sandboxMethod');
  const endpointInput = document.getElementById('sandboxEndpoint');
  const jsonInput = document.getElementById('jsonInput');
  const jsonOutput = document.getElementById('jsonOutput');
  const statusEl = document.getElementById('responseStatus');
  const sendBtn = document.getElementById('sendApiBtn');

  if (!select) return;

  const endpoints = {
    geotask_nearby: {
      method: 'GET',
      url: 'https://api.pipersoftware.io/api/todos/nearby?lat=30.2672&lng=-97.7431',
      body: '{\n  "user_latitude": 30.2672,\n  "user_longitude": -97.7431,\n  "filter_radius_m": 500\n}',
      response: [
        {
          "id": "todo_firestore_9012",
          "title": "Client Meeting at Tech Hub",
          "description": "Discuss FastAPI & Firestore Spatial Indexing",
          "latitude": 30.2680,
          "longitude": -97.7425,
          "address_name": "Austin Tech Center",
          "radius_meters": 100,
          "distance_meters": 104.2,
          "is_inside": false,
          "completed": false,
          "created_at": new Date().toISOString()
        },
        {
          "id": "todo_firestore_9015",
          "title": "Groceries & Supplies",
          "description": "Pick up items",
          "latitude": 30.2671,
          "longitude": -97.7430,
          "address_name": "Whole Foods Market",
          "radius_meters": 200,
          "distance_meters": 14.8,
          "is_inside": true,
          "completed": false,
          "created_at": new Date().toISOString()
        }
      ]
    },
    geotask_create: {
      method: 'POST',
      url: 'https://api.pipersoftware.io/api/todos',
      body: '{\n  "title": "Hardware Store Run",\n  "description": "Buy thermal paste for server rack",\n  "latitude": 30.2701,\n  "longitude": -97.7402,\n  "address_name": "Home Depot",\n  "radius_meters": 150,\n  "completed": false\n}',
      response: {
        "id": "todo_doc_new_7781",
        "title": "Hardware Store Run",
        "description": "Buy thermal paste for server rack",
        "latitude": 30.2701,
        "longitude": -97.7402,
        "address_name": "Home Depot",
        "radius_meters": 150,
        "completed": false,
        "created_at": new Date().toISOString(),
        "firestore_sync": "SUCCESS"
      }
    },
    health: {
      method: 'GET',
      url: 'https://api.pipersoftware.io/v1/system/health',
      body: '{\n  "client": "Piper Web Portal Demo",\n  "environment": "production",\n  "request_telemetry": true\n}',
      response: {
        status: "HEALTHY",
        provider: "Piper Software Solutions LLC",
        contact_email: "pipersoftwaresolution87@gmail.com",
        metrics: {
          system_load: 0.14,
          active_nodes: 48,
          redis_latency_ms: 0.8,
          db_connection_pool: "35/100"
        },
        timestamp: new Date().toISOString()
      }
    }
  };

  select.addEventListener('change', () => {
    const data = endpoints[select.value];
    methodBadge.textContent = data.method;
    methodBadge.className = `http-method method-${data.method.toLowerCase()}`;
    endpointInput.value = data.url;
    jsonInput.value = data.body;
    jsonOutput.textContent = JSON.stringify(data.response, null, 2);
  });

  sendBtn.addEventListener('click', () => {
    sendBtn.textContent = 'Executing... ⏳';
    sendBtn.style.opacity = '0.7';

    setTimeout(() => {
      const latency = (6 + Math.random() * 5).toFixed(1);
      statusEl.textContent = `Status: 200 OK (${latency}ms)`;
      
      const key = select.value;
      const respObj = JSON.parse(JSON.stringify(endpoints[key].response));
      jsonOutput.textContent = JSON.stringify(respObj, null, 2);

      sendBtn.textContent = 'Execute Request 🚀';
      sendBtn.style.opacity = '1';
    }, 400);
  });
}

/* ----------------------------------------------------
   5. CLI TERMINAL OVERLAY
---------------------------------------------------- */
function initTerminalCli() {
  const modal = document.getElementById('terminalModal');
  const toggleBtn = document.getElementById('toggleTerminalBtn');
  const closeBtn = document.getElementById('closeTermBtn');
  const termInput = document.getElementById('termInput');
  const termBody = document.getElementById('termBody');

  if (!modal || !toggleBtn) return;

  function openTerm() {
    modal.classList.add('active');
    termInput.focus();
  }

  function closeTerm() {
    modal.classList.remove('active');
  }

  toggleBtn.addEventListener('click', openTerm);
  closeBtn.addEventListener('click', closeTerm);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeTerm();
  });

  function appendLine(text, isPrompt = false) {
    const div = document.createElement('div');
    div.className = 'term-line';
    if (isPrompt) {
      div.innerHTML = `<span class="term-prompt">piper@software-solutions:~$</span> ${text}`;
    } else {
      div.innerHTML = text;
    }
    termBody.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
  }

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = termInput.value.trim().toLowerCase();
      appendLine(cmd, true);
      termInput.value = '';

      switch (cmd) {
        case 'help':
          appendLine(`
Available Piper CLI Commands:
  <span style="color:#fff;">services</span>       - List core backend & cloud capabilities
  <span style="color:#fff;">portfolio</span>      - View featured GeoTask open-source repository
  <span style="color:#fff;">location-todo</span>  - Technical analysis & Haversine math for GeoTask
  <span style="color:#fff;">audit</span>          - Request direct technical architecture review
  <span style="color:#fff;">clear</span>          - Clear terminal window
  <span style="color:#fff;">exit</span>           - Close terminal interface
          `);
          break;

        case 'services':
          appendLine(`
<span style="color:var(--accent-green);">PIPER SOFTWARE SOLUTIONS LLC - CORE CAPABILITIES:</span>
1. High-Concurrency API Design (Go, Rust, Python FastAPI, Node)
2. Cloud Infrastructure & Kubernetes Mesh (AWS, GCP, Terraform)
3. Cloud Cost & Billing Optimization (Avg 60% Reduction)
4. Spatial & Realtime Telemetry Engines (Geofencing, Firestore, Haversine Math)
5. Database Sharding & High Availability (Postgres, Redis)
          `);
          break;

        case 'portfolio':
        case 'case-studies':
          appendLine(`
<span style="color:var(--accent-green);">FEATURED REPOSITORY:</span>
[1] GeoTask: Location-Based TODO & Spatial Geofence Engine
    Repo: https://github.com/fenil09/Location_TODO
    Stack: Python FastAPI + Firebase Firestore + Haversine Math + Leaflet.js
          `);
          break;

        case 'location-todo':
        case 'geotask':
          appendLine(`
<span style="color:var(--accent-green);">TECHNICAL SPECIFICATION: GeoTask Location-Based TODO</span>
- GitHub: https://github.com/fenil09/Location_TODO
- Backend: Python FastAPI (main.py) with Pydantic schemas (TodoCreate, TodoResponse)
- Database: Firebase Firestore (firestore_service.py) with atomic document CRUD
- Math Engine: Haversine Great-Circle Distance (EARTH_RADIUS = 6,371,000 meters)
- Key Endpoint: GET /api/todos/nearby?lat={lat}&lng={lng} (returns distance_meters & is_inside)
- Frontend GIS: Leaflet.js map layer, continuous GPS watchPosition, Web Audio API alerts
          `);
          break;

        case 'audit':
          appendLine(`<span style="color:var(--accent-cyan);">Initiating Architecture Audit sequence... Email pipersoftwaresolution87@gmail.com</span>`);
          break;

        case 'clear':
          termBody.innerHTML = '';
          break;

        case 'exit':
          closeTerm();
          break;

        case '':
          break;

        default:
          appendLine(`<span style="color:#ef4444;">Command not recognized: '${cmd}'. Type 'help' for command list.</span>`);
          break;
      }
    }
  });
}

/* ----------------------------------------------------
   6. CONTACT FORM & INSTANT BLUEPRINT MODAL
---------------------------------------------------- */
function initContactForm() {
  const submitBtn = document.getElementById('submitContactBtn');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', () => {
    submitBtn.textContent = 'Processing Blueprint Request... ⚡';
    submitBtn.disabled = true;

    setTimeout(() => {
      alert('⚡ Architecture Consultation Request Received!\n\nA Principal Engineer from Piper Software Solutions LLC (pipersoftwaresolution87@gmail.com) will review your system specification and respond within 4 hours.');
      submitBtn.textContent = 'Inquiry Submitted ✓';
      submitBtn.style.background = '#10b981';
      submitBtn.style.color = '#fff';
    }, 1000);
  });
}
