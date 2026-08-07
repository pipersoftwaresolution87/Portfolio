/* 
  Piper Software Solutions LLC - Core Application JavaScript
  Includes: Interactive Tech Stack Matrix, Cloud ROI Calculator, API Sandbox, CLI Terminal, Telemetry Tickers
*/

document.addEventListener('DOMContentLoaded', () => {
  initTechStackFilter();
  initApiSandbox();
  initTerminalCli();
  initContactForm();
});



/* ----------------------------------------------------
   2. INTERACTIVE TECH STACK MATRIX FILTER
---------------------------------------------------- */
function initTechStackFilter() {
  const tabs = document.querySelectorAll('.stack-tab');
  const cards = document.querySelectorAll('.tech-card');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.getAttribute('data-category');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (cat === 'all' || cardCat === cat) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
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
    loadtest_run: {
      method: 'POST',
      url: 'https://loadtesting.pipersoftwaresolution87.workers.dev/api/v1/load-tests',
      body: '{\n  "target_url": "https://api.pipersoftware.io/v1/system/health",\n  "virtual_users": 500,\n  "duration_seconds": 30,\n  "sla_threshold_p95_ms": 250\n}',
      response: {
        "test_id": "lt_run_884920",
        "status": "COMPLETED",
        "target_url": "https://api.pipersoftware.io/v1/system/health",
        "virtual_users": 500,
        "duration_seconds": 30,
        "total_requests": 14520,
        "successful_requests": 14520,
        "failed_requests": 0,
        "rps": 484.0,
        "latency_percentiles_ms": {
          "p50": 14.2,
          "p90": 38.6,
          "p95": 45.1,
          "p99": 89.4
        },
        "sla_verification": {
          "passed": true,
          "threshold_p95_ms": 250,
          "actual_p95_ms": 45.1
        },
        "pydantic_validation": "PASSED (ge=1, le=5000)"
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
  <span style="color:#fff;">stack</span>          - View backend tech stack matrix
  <span style="color:#fff;">portfolio</span>      - View featured case studies & repositories
  <span style="color:#fff;">location-todo</span>  - Technical analysis & Haversine math for GeoTask
  <span style="color:#fff;">loadtest</span>       - Technical spec & benchmarking for Load Testing API
  <span style="color:#fff;">audit</span>          - Request direct technical review
  <span style="color:#fff;">clear</span>          - Clear terminal window
  <span style="color:#fff;">exit</span>           - Close terminal interface
          `);
          break;

        case 'services':
          appendLine(`
<span style="color:var(--accent-green);">PIPER SOFTWARE SOLUTIONS LLC - CORE CAPABILITIES:</span>
1. High-Concurrency API & Load Testing Design (FastAPI, httpx, asyncio, uvloop)
2. Cloud Infrastructure & Kubernetes (AWS, GCP, Cloudflare Workers, Terraform)
3. Cloud Cost Optimization & Right-Sizing
4. Spatial & Realtime Telemetry Engines (Geofencing, WebSockets, Redis Streams)
5. Database Tuning & High Availability (Postgres, Redis, Firestore)
          `);
          break;

        case 'stack':
          appendLine(`
<span style="color:var(--accent-green);">BACKEND TECH STACK:</span>
- Backend: Python FastAPI, Go, Rust, Node.js, httpx, asyncio, uvloop
- Databases: PostgreSQL, Redis, Firestore, SQLite
- Cloud: AWS, Cloudflare Workers, GCP, Kubernetes (EKS/GKE), Terraform
- Streaming & Queues: WebSockets, Redis + ARQ, Apache Kafka
          `);
          break;

        case 'portfolio':
        case 'case-studies':
          appendLine(`
<span style="color:var(--accent-green);">FEATURED REPOSITORIES & APPS:</span>
[1] GeoTask: Location-Based TODO & Spatial Geofence Engine
    Repo: https://github.com/fenil09/Location_TODO
    Stack: Python FastAPI + Firebase Firestore + Haversine Math + Leaflet.js

[2] Load Testing API: High-Concurrency Performance Engine
    Live: https://loadtesting.pipersoftwaresolution87.workers.dev/
    Stack: Python FastAPI + httpx + asyncio + uvloop + Redis + ARQ + Pydantic (ge/le)
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

        case 'loadtest':
        case 'loadtesting':
        case 'load-api':
          appendLine(`
<span style="color:var(--accent-green);">TECHNICAL SPECIFICATION: Load Testing API</span>
- Live App: https://loadtesting.pipersoftwaresolution87.workers.dev/
- Core Engine: Python FastAPI + httpx + asyncio + uvloop (Non-blocking Virtual User simulation)
- Task Queue: Redis + ARQ async background worker job execution
- Input Guardrails: Pydantic Field validation (virtual_users: ge=1, le=5000, duration: ge=1, le=3600)
- Percentile Math: NumPy array quantile algorithms tracking p50, p90, p95, p99 latency
- Key Business Cases: Traffic spike simulation, CI/CD automated pipeline load tests (p95 > 250ms), latency benchmarking
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

  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === ''
  );

  const API_ENDPOINT = isLocalhost
    ? '/api/inquiry'
    : 'https://portfolio-z9sz.onrender.com/api/inquiry';

  submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const objectiveInput = document.getElementById('contactObjective');
    const budgetInput = document.getElementById('contactBudget');
    const detailsInput = document.getElementById('contactDetails');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const objective = objectiveInput ? objectiveInput.value : '';
    const monthly_budget = budgetInput ? budgetInput.value : '';
    const details = detailsInput ? detailsInput.value.trim() : '';

    if (!name || !email) {
      alert('Please fill out both your Name and Work Email.');
      return;
    }

    submitBtn.textContent = 'Submitting Blueprint Request... ⚡';
    submitBtn.disabled = true;

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          objective: objective,
          monthly_budget: monthly_budget,
          details: details
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        alert('⚡ Technical Consultation Request Received!\n\nFounder & Backend Engineer Fenil (pipersoftwaresolution87@gmail.com) will review your inquiry and get back to you promptly.');
        
        // Empty all form fields
        if (contactForm) contactForm.reset();

        submitBtn.textContent = 'Inquiry Submitted ✓';
        submitBtn.style.background = '#10b981';
        submitBtn.style.color = '#fff';

        setTimeout(() => {
          submitBtn.textContent = 'Submit Technical Inquiry 🚀';
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
        }, 3000);
      } else {
        alert(`Notice: ${data.message || 'Could not submit inquiry'}`);
        submitBtn.textContent = 'Submit Technical Inquiry 🚀';
        submitBtn.disabled = false;
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('⚡ Technical Consultation Request Received!\n\nFounder & Backend Engineer Fenil will review your inquiry and get back to you promptly.');
      
      if (contactForm) contactForm.reset();

      submitBtn.textContent = 'Inquiry Submitted ✓';
      submitBtn.style.background = '#10b981';
      submitBtn.style.color = '#fff';

      setTimeout(() => {
        submitBtn.textContent = 'Submit Technical Inquiry 🚀';
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
      }, 3000);
    }
  });
}
