/**
 * KAUSHIKI SINGH - PORTFOLIO INTERACTIVITY & 3D VISUALIZATION
 * Includes: Three.js 3D Molecular Laboratory, 3D Card Tilt Physics,
 * Rotating DNA Helix Canvas, Theme Toggle (Default: Light),
 * ScrollSpy, Tab Switcher, Filterable Certificates, Modals & Toast Alerts.
 */

document.addEventListener("DOMContentLoaded", () => {
  initDnaCanvas();
  initThemeToggle();
  initNavigation();
  initSkillsTabs();
  initCertFilters();
  initModals();
  initContactForm();
  initCardTiltEffect();
  initThreeLabViewer();
});

/* ==========================================================================
   1. DNA HELIX BACKGROUND ANIMATION (CANVAS)
   ========================================================================== */
function initDnaCanvas() {
  const canvas = document.getElementById("dna-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const numPairs = 36;
  const speed = 0.011;
  let angleOffset = 0;
  const radius = 105;
  const pairSpacing = 40;

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const nodeColor1 = isLight ? "#0284c7" : "#06b6d4"; // Strand A (Cyan)
    const nodeColor2 = isLight ? "#059669" : "#10b981"; // Strand B (Emerald)
    const rungColor  = isLight ? "rgba(100, 116, 139, 0.18)" : "rgba(148, 163, 184, 0.16)";

    const centerX = width > 900 ? width * 0.84 : width * 0.5;
    const startY = -40;

    for (let i = 0; i < numPairs; i++) {
      const y = startY + i * pairSpacing;
      if (y > height + 60) break;

      const angle = angleOffset + i * 0.22;
      const xOffset = Math.sin(angle) * radius;
      const zDepth = Math.cos(angle); // -1 to 1

      const scale1 = (zDepth + 1.8) / 2.8;
      const scale2 = (-zDepth + 1.8) / 2.8;

      const x1 = centerX + xOffset;
      const x2 = centerX - xOffset;

      // Base-pair rung
      ctx.beginPath();
      ctx.strokeStyle = rungColor;
      ctx.lineWidth = 1.2;
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.stroke();

      // Strand A Node
      ctx.beginPath();
      ctx.arc(x1, y, 3.4 * scale1, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor1;
      ctx.shadowColor = nodeColor1;
      ctx.shadowBlur = zDepth > 0 ? 8 : 0;
      ctx.fill();

      // Strand B Node
      ctx.beginPath();
      ctx.arc(x2, y, 3.4 * scale2, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor2;
      ctx.shadowColor = nodeColor2;
      ctx.shadowBlur = -zDepth > 0 ? 8 : 0;
      ctx.fill();

      ctx.shadowBlur = 0;
    }

    angleOffset += speed;
    requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================================================
   2. THEME TOGGLE (Default: LIGHT THEME)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  const mobileToggleBtn = document.getElementById("mobile-theme-toggle");

  // Default to Light Theme per user request
  const currentTheme = localStorage.getItem("ks_theme") || "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon(currentTheme);

  function toggle() {
    const active = document.documentElement.getAttribute("data-theme");
    const next = active === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("ks_theme", next);
    updateThemeIcon(next);
  }

  if (toggleBtn) toggleBtn.addEventListener("click", toggle);
  if (mobileToggleBtn) mobileToggleBtn.addEventListener("click", toggle);
}

function updateThemeIcon(theme) {
  const icons = [document.getElementById("theme-icon"), document.getElementById("mobile-theme-icon")];
  const svg = theme === "light"
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

  icons.forEach((icon) => {
    if (icon) icon.innerHTML = svg;
  });
}

/* ==========================================================================
   3. NAVIGATION & SCROLLSPY (SIDEBAR & MOBILE DRAWER & DESKTOP COLLAPSE)
   ========================================================================== */
function initNavigation() {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const backdrop = document.getElementById("sidebar-backdrop");
  const sideLinks = document.querySelectorAll(".side-link");
  const floatingToggle = document.getElementById("sidebar-floating-toggle");
  const closeBtn = document.getElementById("sidebar-close-btn");
  const hideFooterBtn = document.getElementById("btn-hide-sidebar-footer");

  // Restore saved desktop sidebar visibility state
  const isSavedHidden = localStorage.getItem("ks_sidebar_hidden") === "true";
  if (isSavedHidden && window.innerWidth > 1024) {
    document.body.classList.add("sidebar-hidden");
  }

  function hideSidebarDesktop() {
    document.body.classList.add("sidebar-hidden");
    localStorage.setItem("ks_sidebar_hidden", "true");
  }

  function showSidebarDesktop() {
    document.body.classList.remove("sidebar-hidden");
    localStorage.setItem("ks_sidebar_hidden", "false");
  }

  // Mobile drawer functions
  function openMobileSidebar() {
    if (sidebar) sidebar.classList.add("open");
    if (backdrop) backdrop.classList.add("active");
    if (window.innerWidth <= 1024) {
      document.body.style.overflow = "hidden";
    }
  }

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove("open");
    if (backdrop) backdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Header & Footer Hide / Close Buttons
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (window.innerWidth <= 1024) {
        closeMobileSidebar();
      } else {
        hideSidebarDesktop();
      }
    });
  }

  if (hideFooterBtn) {
    hideFooterBtn.addEventListener("click", () => {
      if (window.innerWidth <= 1024) {
        closeMobileSidebar();
      } else {
        hideSidebarDesktop();
      }
    });
  }

  // Floating Toggle (Appears when sidebar is hidden on desktop)
  if (floatingToggle) {
    floatingToggle.addEventListener("click", () => {
      showSidebarDesktop();
    });
  }

  // Mobile Hamburger Toggle
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      if (sidebar && sidebar.classList.contains("open")) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeMobileSidebar);
  }

  sideLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1024) {
        closeMobileSidebar();
      }
    });
  });

  const sections = document.querySelectorAll("section[id]");

  function onScroll() {
    const scrollPos = window.scrollY + 180;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        sideLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ==========================================================================
   4. 3D CARD TILT INTERACTIVE PHYSICS
   ========================================================================== */
function initCardTiltEffect() {
  const tiltCards = document.querySelectorAll(".photo-3d-card, .about-card-3d");

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE 3D FORENSIC SPECIMEN & MOLECULAR VIEWER (THREE.JS)
   ========================================================================== */
function initThreeLabViewer() {
  const container = document.getElementById("three-dna-viewport");
  if (!container || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 24;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x06b6d4, 1.2);
  dirLight1.position.set(10, 15, 10);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x10b981, 1.0);
  dirLight2.position.set(-10, -15, -10);
  scene.add(dirLight2);

  // Groups
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  let dnaGroup = createDna3DModel();
  let antibodyGroup = createAntibody3DModel();
  let particleGroup = createParticleCloudModel();

  masterGroup.add(dnaGroup);
  let activeModel = "dna";

  // Mouse / Touch Drag Orbit
  let isDragging = false;
  let prevMousePos = { x: 0, y: 0 };
  let autoRotate = true;

  renderer.domElement.addEventListener("mousedown", (e) => {
    isDragging = true;
    prevMousePos = { x: e.clientX, y: e.clientY };
    autoRotate = false;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - prevMousePos.x;
    const deltaY = e.clientY - prevMousePos.y;

    masterGroup.rotation.y += deltaX * 0.01;
    masterGroup.rotation.x += deltaY * 0.01;

    prevMousePos = { x: e.clientX, y: e.clientY };
  });

  // Touch Support
  renderer.domElement.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      autoRotate = false;
    }
  });

  window.addEventListener("touchend", () => { isDragging = false; });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMousePos.x;
    const deltaY = e.touches[0].clientY - prevMousePos.y;

    masterGroup.rotation.y += deltaX * 0.012;
    masterGroup.rotation.x += deltaY * 0.012;

    prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });

  // Resume auto rotation if idle
  let idleTimeout;
  renderer.domElement.addEventListener("mouseleave", () => {
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => { autoRotate = true; }, 3000);
  });

  // Window resize
  window.addEventListener("resize", () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Model switch buttons
  document.querySelectorAll("[data-model-switch]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-model-switch]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.getAttribute("data-model-switch");
      switchModel(target);
    });
  });

  function switchModel(type) {
    activeModel = type;
    while (masterGroup.children.length > 0) {
      masterGroup.remove(masterGroup.children[0]);
    }

    const titleElem = document.getElementById("lab-3d-model-name");
    const infoElem = document.getElementById("lab-3d-model-info");

    if (type === "dna") {
      masterGroup.add(dnaGroup);
      if (titleElem) titleElem.textContent = "B-DNA Double Helix (Forensic STR Profiling)";
      if (infoElem) infoElem.textContent = "48 Nucleotide Pairs · Anti-Parallel Double Helix · 3.4 Å Stride";
    } else if (type === "antibody") {
      masterGroup.add(antibodyGroup);
      if (titleElem) titleElem.textContent = "Immunoglobulin Y-Complex (ABO Blood Grouping Assay)";
      if (infoElem) infoElem.textContent = "Fab Antigen-Binding Fragments · Rapid Agglutination Simulation";
    } else {
      masterGroup.add(particleGroup);
      if (titleElem) titleElem.textContent = "Forensic Serology Micro-Matrix (Analytical Chemistry)";
      if (infoElem) infoElem.textContent = "Biological Fluid Staining · Presumptive Screening Matrix";
    }
  }

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    if (autoRotate) {
      masterGroup.rotation.y += 0.008;
      masterGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.12;
    }

    renderer.render(scene, camera);
  }
  animate();

  // Helper 1: Create 3D DNA Model
  function createDna3DModel() {
    const group = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const strandMat1 = new THREE.MeshPhongMaterial({ color: 0x0284c7, shininess: 80 }); // Cyan Strand
    const strandMat2 = new THREE.MeshPhongMaterial({ color: 0x10b981, shininess: 80 }); // Emerald Strand

    const colors = [0x0284c7, 0x10b981, 0x8b5cf6, 0xf59e0b]; // A, T, G, C
    const numSteps = 42;
    const radius = 3.6;
    const heightStep = 0.38;

    for (let i = 0; i < numSteps; i++) {
      const angle = i * 0.32;
      const y = (i - numSteps / 2) * heightStep;
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = -x1;
      const z2 = -z1;

      // Backbone Spheres
      const s1 = new THREE.Mesh(sphereGeo, strandMat1);
      s1.position.set(x1, y, z1);
      group.add(s1);

      const s2 = new THREE.Mesh(sphereGeo, strandMat2);
      s2.position.set(x2, y, z2);
      group.add(s2);

      // Connecting Base-pair Rod
      const p1 = new THREE.Vector3(x1, y, z1);
      const p2 = new THREE.Vector3(x2, y, z2);
      const rodDist = p1.distanceTo(p2);

      const cylGeo = new THREE.CylinderGeometry(0.09, 0.09, rodDist, 8);
      const pairColor = colors[i % colors.length];
      const rodMat = new THREE.MeshPhongMaterial({ color: pairColor, transparent: true, opacity: 0.85 });
      const cyl = new THREE.Mesh(cylGeo, rodMat);

      cyl.position.copy(p1).add(p2).multiplyScalar(0.5);
      cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
      group.add(cyl);
    }
    return group;
  }

  // Helper 2: Create 3D Antibody Y-Model
  function createAntibody3DModel() {
    const group = new THREE.Group();
    const stemMat = new THREE.MeshPhongMaterial({ color: 0x6366f1, shininess: 90 });
    const fabMat = new THREE.MeshPhongMaterial({ color: 0xf43f5e, shininess: 90 });

    // Stem (Fc Region)
    const stemGeo = new THREE.CylinderGeometry(0.4, 0.4, 6, 16);
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, -2, 0);
    group.add(stem);

    // Left Arm (Fab Region)
    const arm1Geo = new THREE.CylinderGeometry(0.35, 0.35, 5, 16);
    const arm1 = new THREE.Mesh(arm1Geo, fabMat);
    arm1.position.set(-2, 2.5, 0);
    arm1.rotation.z = Math.PI / 4;
    group.add(arm1);

    // Right Arm (Fab Region)
    const arm2 = new THREE.Mesh(arm1Geo, fabMat);
    arm2.position.set(2, 2.5, 0);
    arm2.rotation.z = -Math.PI / 4;
    group.add(arm2);

    // Binding Sites (Spheres)
    const siteGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const siteMat = new THREE.MeshPhongMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.4 });

    const s1 = new THREE.Mesh(siteGeo, siteMat);
    s1.position.set(-3.7, 4.2, 0);
    group.add(s1);

    const s2 = new THREE.Mesh(siteGeo, siteMat);
    s2.position.set(3.7, 4.2, 0);
    group.add(s2);

    return group;
  }

  // Helper 3: Create 3D Particle Cloud / Serology Lattice
  function createParticleCloudModel() {
    const group = new THREE.Group();
    const count = 450;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const c1 = new THREE.Color(0x0284c7);
    const c2 = new THREE.Color(0x10b981);
    const c3 = new THREE.Color(0xf43f5e);

    for (let i = 0; i < count; i++) {
      const radius = 5 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c3;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const points = new THREE.Points(geometry, material);
    group.add(points);

    // Inner wireframe sphere
    const wireGeo = new THREE.IcosahedronGeometry(4, 2);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, wireframe: true, transparent: true, opacity: 0.25 });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    group.add(wireMesh);

    return group;
  }
}

/* ==========================================================================
   6. TECHNICAL SKILLS CATEGORY TABS
   ========================================================================== */
function initSkillsTabs() {
  const tabButtons = document.querySelectorAll(".skill-tab-btn");
  const tabPanels = document.querySelectorAll(".skills-content-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetCategory = btn.getAttribute("data-category");

      tabButtons.forEach((b) => b.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      const targetPanel = document.getElementById(`skills-tab-${targetCategory}`);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });
}

/* ==========================================================================
   7. CERTIFICATIONS & CONFERENCES FILTER
   ========================================================================== */
function initCertFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const certCards = document.querySelectorAll(".cert-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      certCards.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-type") === filter) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* ==========================================================================
   8. MODALS (Projects Deep-Dive & Certificates Preview)
   ========================================================================== */
const PROJECT_DATA = {
  proj1: {
    title: "Rapid Field Blood Grouping Kit for Preliminary Crime Scene Analysis",
    domain: "Forensic Biology & Serology",
    status: "Engineered Research Concept & Prototype Proposal",
    overview:
      "This project focuses on developing an innovative forensic biology solution for rapid preliminary ABO blood group screening at crime scenes. The proposed concept explores antigen-antibody agglutination reactions as a means of supporting preliminary blood group identification during early stages of forensic investigation.",
    methodology:
      "Utilizes dry-form immobilized monoclonal antibodies (Anti-A, Anti-B, Anti-D) on an immunochromatographic or capillary micro-matrix. Upon contact with suspected biological fluid drops reconstituted in buffer, visible agglutination or lateral line capture occurs within 60-90 seconds.",
    objectives: [
      "Explore rapid preliminary ABO blood group screening in field environments.",
      "Apply antigen-antibody agglutination principles in compact portable form.",
      "Support early assessment of biological evidence during initial CSI golden hours.",
      "Preserve sample integrity and avoid destructive testing to ensure subsequent laboratory-based DNA extraction & STR profiling remain viable.",
      "Eliminate lengthy transit delays for preliminary classification."
    ],
    concepts: [
      "Forensic Biology",
      "Forensic Serology",
      "ABO Blood Grouping",
      "Antigen-Antibody Agglutination",
      "Immunochromatographic Assay",
      "Crime Scene Evidence Collection Protocols"
    ],
    significance:
      "Accelerates investigative triage while protecting precious biological material. Demonstrates the critical intersection between biochemical screening and forensic field logistics."
  },
  proj2: {
    title: "Examination of Adulteration in Local Vendors' Milk by Physical and Chemical Methods",
    domain: "Analytical Chemistry & Quality Forensics",
    status: "Completed Academic Analytical Study",
    overview:
      "This academic project involved a comprehensive analytical study to assess the quality and authenticity of milk collected from local vendors using standardized physical and chemical examination techniques. The study focused on evaluating milk quality through analytical parameters and identifying possible indications of adulteration.",
    methodology:
      "Milk samples collected across distinct vendor zones were subjected to systematic quantitative testing: Gerber butyrometer centrifugation for fat content, Gerber lactometer for specific gravity, electronic pH probe calibration, and targeted colorimetric chemical assays for neutralizers, starch, and synthetic adulterants.",
    objectives: [
      "Assess the quality of raw and distributed milk samples from local vendor sources.",
      "Examine physical and chemical characteristics against reference standards.",
      "Apply calibrated pH analysis, specific gravity measurement, and lactometer testing.",
      "Screen for chemical contaminants, synthetic adulterants, and dilution.",
      "Interpret analytical observations to draw evidence-based food safety conclusions."
    ],
    concepts: [
      "Food Chemistry & Forensic Toxicology",
      "Milk Quality Analysis",
      "Physical Examination Methods",
      "Chemical Analysis Techniques",
      "Adulteration Detection",
      "pH Analysis",
      "Lactometer Test & Specific Gravity",
      "Fat Content Analysis (Gerber Method)",
      "Quality Control & Standard Operating Procedures"
    ],
    significance:
      "Bridges forensic analytical chemistry with public health vigilance. Demonstrates rigorous scientific documentation, calibration of measurement devices, and empirical evidence evaluation."
  }
};

const CERT_DATA = {
  fg5: {
    title: "5th International Conference on Recent Developments in Forensic Science (Forensic Gyaan 5)",
    org: "Vivekananda Global University (VGU), Jaipur",
    year: "2025",
    type: "Conference Presentation",
    desc:
      "Certificate of Presentation awarded for academic participation and scientific engagement in the 5th International Conference 'Forensic Gyaan 5'. Explored emerging methodologies in molecular forensics, advanced DNA profiling, and multidisciplinary investigation.",
    keyTakeaways: [
      "Exposure to global breakthroughs in molecular diagnostics and forensic genetics",
      "Engagement with leading forensic researchers, professors, and lab directors",
      "Discussion of technological advances in criminalistics and evidence interpretation"
    ]
  },
  aiims: {
    title: "Forensic Science Online Training Program",
    org: "Ethical Edufabrica Pvt. Ltd. in association with Pulse, AIIMS Delhi",
    year: "2025",
    type: "Professional Certification",
    desc:
      "Comprehensive certified training covering forensic science fundamentals, advanced crime scene investigation protocols, physical evidence preservation, and forensic case interpretation under clinical and medico-legal perspectives.",
    keyTakeaways: [
      "Scientific approaches to crime scene reconstruction",
      "Evidence preservation and handling protocols",
      "Forensic case interpretation and scientific reasoning"
    ]
  },
  sage: {
    title: "Behind the Scene of Crime - Forensic Science Workshop",
    org: "SAGE University & iNurture Education Solutions",
    year: "2023",
    type: "Hands-on Workshop",
    desc:
      "Practical forensic workshop focusing on on-site crime scene management, physical evidence identification, latent fingerprint development, and evidence collection workflows.",
    keyTakeaways: [
      "Practical crime scene photography and documentation",
      "Physical evidence packaging and chain of custody preservation",
      "Fingerprint lifting and analysis basics"
    ]
  },
  afrs: {
    title: "Applied Forensic Research Sciences (AFRS) Training",
    org: "AFRS, Indore",
    year: "2023",
    type: "Research Training",
    desc:
      "Training focusing on applied forensic research methodologies, interdisciplinary investigation tools, and scientific literature appraisal.",
    keyTakeaways: [
      "Standard research methodologies in forensic biology",
      "Literature review and scientific writing principles",
      "Multidisciplinary laboratory tools and workflows"
    ]
  },
  psycho: {
    title: "Forensic Talkshow Expert Series - Psychology of a Rapist",
    org: "Applied Forensic Research Sciences (AFRS)",
    year: "Participation Certificate",
    type: "Expert Seminar",
    desc:
      "Specialized expert lecture series focusing on behavioral analysis, psychopathology of sexual offenders, criminal profiling, and victimological considerations in violent crime investigations.",
    keyTakeaways: [
      "Psychological profiling and offender behavioral patterns",
      "Victimology and behavioral crime scene evidence",
      "Integrative forensic psychology concepts"
    ]
  },
  sifs: {
    title: "Foundation Certificate in Cyber Security & OSINT",
    org: "Sherlock Institute of Forensic Science India (SIFS India)",
    year: "Certification",
    type: "Digital Forensics & OSINT",
    desc:
      "Foundational training covering digital threat awareness, open-source intelligence gathering, public data verification, and digital investigative methodologies.",
    keyTakeaways: [
      "Open-Source Intelligence (OSINT) tools and search techniques",
      "Cybersecurity fundamentals and threat vectors",
      "Digital footprint analysis in investigative workflows"
    ]
  }
};

function initModals() {
  const modalOverlay = document.getElementById("modal-overlay");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  if (!modalOverlay || !modalBody || !modalClose) return;

  function closeModal() {
    modalOverlay.classList.remove("active");
    modalBody.innerHTML = "";
    document.body.style.overflow = "";
  }

  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });

  // Project Modal Triggers
  document.querySelectorAll("[data-project-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const projKey = trigger.getAttribute("data-project-trigger");
      const data = PROJECT_DATA[projKey];
      if (!data) return;

      modalBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; border-bottom:1px solid var(--border-light); padding-bottom:1rem;">
            <div>
              <span style="display:inline-block; font-size:0.75rem; font-weight:700; color:var(--accent-cyan); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">${data.domain}</span>
              <h2 style="font-size:1.45rem; line-height:1.3; color:var(--text-primary);">${data.title}</h2>
              <span style="display:inline-block; font-size:0.8rem; color:var(--accent-emerald); font-weight:600; margin-top:0.35rem;">&bull; ${data.status}</span>
            </div>
          </div>
          <div>
            <h4 style="font-size:0.88rem; text-transform:uppercase; color:var(--text-accent); margin-bottom:0.4rem; letter-spacing:0.05em;">Project Overview</h4>
            <p style="font-size:0.92rem; line-height:1.65; color:var(--text-secondary);">${data.overview}</p>
          </div>
          <div>
            <h4 style="font-size:0.88rem; text-transform:uppercase; color:var(--text-accent); margin-bottom:0.4rem; letter-spacing:0.05em;">Scientific Methodology & Design</h4>
            <p style="font-size:0.92rem; line-height:1.65; color:var(--text-secondary);">${data.methodology}</p>
          </div>
          <div>
            <h4 style="font-size:0.88rem; text-transform:uppercase; color:var(--text-accent); margin-bottom:0.4rem; letter-spacing:0.05em;">Key Objectives</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.4rem;">
              ${data.objectives.map((obj) => `<li style="font-size:0.88rem; color:var(--text-secondary); display:flex; gap:0.5rem;"><span style="color:var(--accent-cyan);">&#10003;</span> ${obj}</li>`).join("")}
            </ul>
          </div>
          <div>
            <h4 style="font-size:0.88rem; text-transform:uppercase; color:var(--text-accent); margin-bottom:0.4rem; letter-spacing:0.05em;">Scientific Concepts Involved</h4>
            <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
              ${data.concepts.map((c) => `<span style="font-size:0.75rem; background:rgba(255,255,255,0.05); border:1px solid var(--border-light); padding:0.25rem 0.65rem; border-radius:4px; color:var(--text-secondary);">${c}</span>`).join("")}
            </div>
          </div>
          <div style="background:rgba(6,182,212,0.08); border-left:3px solid var(--accent-cyan); padding:0.85rem; border-radius:0 8px 8px 0;">
            <strong style="display:block; font-size:0.82rem; color:var(--accent-cyan); margin-bottom:0.25rem;">Scientific Significance:</strong>
            <p style="font-size:0.85rem; color:var(--text-secondary);">${data.significance}</p>
          </div>
        </div>
      `;

      modalOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  // Certificate Modal Triggers
  document.querySelectorAll("[data-cert-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const certKey = trigger.getAttribute("data-cert-trigger");
      const data = CERT_DATA[certKey];
      if (!data) return;

      modalBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; border-bottom:1px solid var(--border-light); padding-bottom:1rem;">
            <div>
              <span style="display:inline-block; font-size:0.75rem; font-weight:700; color:var(--accent-cyan); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">${data.type} &middot; ${data.year}</span>
              <h2 style="font-size:1.35rem; line-height:1.3; color:var(--text-primary);">${data.title}</h2>
              <span style="display:inline-block; font-size:0.88rem; color:var(--accent-cyan); font-weight:600; margin-top:0.35rem;">${data.org}</span>
            </div>
          </div>
          <div>
            <h4 style="font-size:0.88rem; text-transform:uppercase; color:var(--text-accent); margin-bottom:0.4rem; letter-spacing:0.05em;">Credential Overview</h4>
            <p style="font-size:0.92rem; line-height:1.65; color:var(--text-secondary);">${data.desc}</p>
          </div>
          <div>
            <h4 style="font-size:0.88rem; text-transform:uppercase; color:var(--text-accent); margin-bottom:0.4rem; letter-spacing:0.05em;">Key Competencies & Insights</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.4rem;">
              ${data.keyTakeaways.map((k) => `<li style="font-size:0.88rem; color:var(--text-secondary); display:flex; gap:0.5rem;"><span style="color:var(--accent-emerald);">&#10003;</span> ${k}</li>`).join("")}
            </ul>
          </div>
          <div style="background:rgba(255,255,255,0.03); border:1px dashed var(--border-light); border-radius:8px; padding:1rem; text-align:center;">
            <p style="font-size:0.8rem; color:var(--text-muted);">
              Physical certificate verified from verified academic portfolio records. Scan copy can be added directly to <code>/assets/certificates/</code>.
            </p>
          </div>
        </div>
      `;

      modalOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });
}

/* ==========================================================================
   9. CONTACT FORM & REAL-TIME EMAIL DELIVERY (to kaushikidiva@gmail.com)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const alertContainer = document.getElementById("form-alert");
  const submitBtn = document.getElementById("btn-submit-inquiry") || form?.querySelector("button[type='submit']");
  const submitText = document.getElementById("btn-submit-text");

  function showAlert(message, type = "success") {
    if (!alertContainer) return;
    const icon = type === "success"
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    alertContainer.innerHTML = `
      <div class="form-status-alert ${type}">
        <span style="flex-shrink:0; margin-top:2px;">${icon}</span>
        <div>${message}</div>
      </div>
    `;
  }

  function clearAlert() {
    if (alertContainer) alertContainer.innerHTML = "";
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAlert();

      const nameInput = document.getElementById("form-name");
      const emailInput = document.getElementById("form-email");
      const subjectInput = document.getElementById("form-subject");
      const messageInput = document.getElementById("form-message");

      const name = nameInput?.value.trim() || "";
      const email = emailInput?.value.trim() || "";
      const subject = subjectInput?.value.trim() || "Forensic Science Inquiry";
      const message = messageInput?.value.trim() || "";

      if (!name || !email || !message) {
        showAlert("Please fill in your name, email, and message.", "error");
        showToast("Please fill in all required fields.", "error");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showAlert("Please enter a valid email address.", "error");
        showToast("Invalid email address format.", "error");
        return;
      }

      // Loading State
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("btn-loading");
      }
      if (submitText) {
        submitText.innerHTML = `<span class="spinner-icon"></span> Delivering inquiry to Kaushiki...`;
      }

      const payload = {
        name: name,
        email: email,
        _subject: `[Forensic Portfolio] ${subject} - From ${name}`,
        message: message,
        _template: "table",
        _captcha: "false"
      };

      try {
        const response = await fetch("https://formsubmit.co/ajax/kaushikidiva@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && (data.success === "true" || data.success === true || data.message)) {
          showAlert(
            `<strong>Message Delivered!</strong> Thank you, <strong>${name}</strong>. Your inquiry has been sent directly to Kaushiki Singh (<strong>kaushikidiva@gmail.com</strong>). She will receive your message and reply to <em>${email}</em>.`,
            "success"
          );
          showToast(`Inquiry delivered directly to Kaushiki!`, "success");
          form.reset();
        } else {
          throw new Error(data.message || "Submission failed");
        }
      } catch (err) {
        console.warn("Direct submission notice:", err);
        const mailtoUrl = `mailto:kaushikidiva@gmail.com?subject=${encodeURIComponent("[Forensic Inquiry] " + subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
        window.open(mailtoUrl, "_blank");

        showAlert(
          `<strong>Notice:</strong> Your inquiry has been prepared for Kaushiki Singh (<strong>kaushikidiva@gmail.com</strong>). An email window has been opened. You can also write directly to <strong>kaushikidiva@gmail.com</strong>.`,
          "success"
        );
        showToast("Inquiry prepared in email client.", "info");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("btn-loading");
        }
        if (submitText) {
          submitText.textContent = "Send Direct Inquiry to Kaushiki";
        }
      }
    });
  }

  // Copy email buttons
  const copyBtns = document.querySelectorAll(".btn-copy");
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const emailText = btn.getAttribute("data-email") || "kaushikidiva@gmail.com";
      navigator.clipboard.writeText(emailText).then(() => {
        const orig = btn.textContent;
        btn.textContent = "Copied!";
        showToast(`Copied ${emailText} to clipboard!`, "success");
        setTimeout(() => { btn.textContent = orig; }, 2000);
      }).catch(() => {
        showToast("Unable to copy to clipboard.", "error");
      });
    });
  });
}

/* ==========================================================================
   10. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="color:var(--accent-cyan); font-weight:bold;">&#10003;</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
