 // Initialize Swiper
    const swiper = new Swiper('.swiper-container', {
      slidesPerView: 'auto',
      spaceBetween: 10,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        320: { slidesPerView: 2, spaceBetween: 10 },
        576: { slidesPerView: 3, spaceBetween: 10 },
        768: { slidesPerView: 4, spaceBetween: 10 },
        1024: { slidesPerView: 5, spaceBetween: 10 },
      },
    });

    // Triangular Grid Wave Background
    const canvas = document.getElementById("grid");
    const ctx = canvas.getContext("2d", { alpha: true });

    let width, height, centerX, centerY;
    function resizeCanvas() {
      width = canvas.width = window.innerWidth * window.devicePixelRatio;
      height = canvas.height = window.innerHeight * window.devicePixelRatio;
      centerX = width / 2;
      centerY = height / 2;
    }
    resizeCanvas();

    const config = {
      spacing: 30,
      speed: 0.08,
      waveSpeed: 1.2,
      waveWidth: 100,
      baseGlow: 0.04,
      maxGlow: 0.7
    };

    let offset = 0;
    let waveRadius = 0;
    let maxWaveRadius = Math.sqrt(centerX ** 2 + centerY ** 2);
    let secondaryWaveRadius = -config.waveWidth;

    function drawGrid(waveRad) {
      const triangleHeight = config.spacing * Math.sqrt(3) / 2;
      const cols = Math.ceil(width / config.spacing) + 2;
      const rows = Math.ceil(height / triangleHeight) + 2;

      ctx.save();
      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          const x = i * config.spacing + (offset % config.spacing);
          const y = j * triangleHeight + (offset % triangleHeight);

          const dx = x - centerX;
          const dy = y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const waveEffect = Math.max(0, 1 - Math.abs(distance - waveRad) / config.waveWidth);
          const glow = config.baseGlow + waveEffect * (config.maxGlow - config.baseGlow);

          if (glow > config.baseGlow) {
            ctx.strokeStyle = 'rgba(255, 98, 0, 0.15)';
            ctx.globalAlpha = glow;
            ctx.lineWidth = 1 + waveEffect * 1.5;

            ctx.beginPath();
            if (j % 2 === 0) {
              ctx.moveTo(x, y);
              ctx.lineTo(x + config.spacing / 2, y + triangleHeight);
              ctx.lineTo(x - config.spacing / 2, y + triangleHeight);
            } else {
              ctx.moveTo(x - config.spacing / 2, y);
              ctx.lineTo(x + config.spacing / 2, y);
              ctx.lineTo(x, y + triangleHeight);
            }
            ctx.closePath();
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    }

    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, width, height);

      waveRadius += config.waveSpeed;
      secondaryWaveRadius += config.waveSpeed;

      if (waveRadius > maxWaveRadius + config.waveWidth) waveRadius = -config.waveWidth;
      if (secondaryWaveRadius > maxWaveRadius + config.waveWidth) secondaryWaveRadius = -config.waveWidth;

      offset += config.speed;

      drawGrid(waveRadius);
      drawGrid(secondaryWaveRadius);

      requestAnimationFrame(animate);
    }

    // Scrambled Text Effect
    const scrambleTextElement = document.getElementById("scrambleText");
    const scrambleText = "We're working hard to bring you an amazing experience. Stay tuned!";
    const scrambleChars = "!@#$%^&*()_+=-{}[]<>?/.,:;|\\~`";
    const scrambleDuration = 1000;
    const scrambleSpeed = 25;

    let scrambleFrame = 0;
    const totalScrambleFrames = scrambleDuration / scrambleSpeed;

    function scrambleTextContent(original) {
      return original.split('').map(char => {
        if (char === ' ' || char === '.' || char === '!') return char;
        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      }).join('');
    }

    function animateScrambleText() {
      const interval = setInterval(() => {
        const progress = scrambleFrame / totalScrambleFrames;
        const revealCount = Math.floor(progress * scrambleText.length);
        const scrambled = scrambleTextContent(scrambleText.substring(revealCount));
        scrambleTextElement.textContent = scrambleText.substring(0, revealCount) + scrambled;
        scrambleFrame++;
        if (scrambleFrame >= totalScrambleFrames) {
          clearInterval(interval);
          scrambleTextElement.textContent = scrambleText;
        }
      }, scrambleSpeed);
    }

    // Model Configurations
    const modelConfigs = {
      website: {
        scaleFactor: 2.5,
        rotationSpeed: 0.02,
        verticalOffset: -0.3,
        ambientLightIntensity: 0.9,
        directionalLightIntensity: 1,
        animation: (group, time) => {
          if (group.children.length > 0) {
            group.children[0].rotation.y += 0.015;
          }
          group.position.y = Math.sin(time * 0.001) * 0.2 + 0.5;
        }
      },
      content: {
        scaleFactor: 3,
        rotationSpeed: 0.025,
        verticalOffset: -0.1,
        ambientLightIntensity: 0.8,
        directionalLightIntensity: 0.9,
        animation: (group, time) => {
          group.rotation.y += 0.02;
          group.position.y = Math.sin(time * 0.001) * 0.15 + 0.4;
        }
      },
      b2b: {
        scaleFactor: 3,
       
        verticalOffset: 0.1,
        ambientLightIntensity: 0.7,
        directionalLightIntensity: 0.85,
        animation: (group, time) => {
          
          group.rotation.x = Math.sin(time * 0.004) * 0.1;
          
        }
      },
      social: {
        scaleFactor: 1.5,
        rotationSpeed: 0.02,
        verticalOffset: 0,
        ambientLightIntensity: 0.75,
        directionalLightIntensity: 0.9,
        animation: (group, time) => {
          // group.rotation.y += 0.02;
          group.scale.setScalar(2.2 + Math.sin(time * 0.005) * 0.1);
          // group.position.y = 0.4;
        }
      },
      advertising: {
        scaleFactor: 3,
        rotationSpeed: 0.022,
        verticalOffset: 0.0,
        ambientLightIntensity: 0.7,
        directionalLightIntensity: 0.8,
        animation: (group, time) => {
          // group.rotation.y += 0.022;
          group.rotation.z = Math.cos(time * 0.003) * 0.1;
          // group.position.y = 0.3;
        }
      },
      seo: {
        scaleFactor: 2.5,
        rotationSpeed: 0.015,
        verticalOffset: -0.2,
        ambientLightIntensity: 0.65,
        directionalLightIntensity: 0.85,
        animation: (group, time) => {
          group.rotation.y += 0.015;
          group.position.y = Math.sin(time * 0.001) * 0.15 + 0.3;
          
        }
      },
      email: {
      scaleFactor: 2.7,
      rotationSpeed: 0.02,
      verticalOffset: 0.1,
      ambientLightIntensity: 0.8,
      directionalLightIntensity: 0.9,
      animation: (group, time) => {
        // Self-rotate on Y-axis
        group.rotation.y += 0.02;

        // Remove X-axis tilt for a cleaner float
        // group.rotation.x = Math.sin(time * 0.001) * 0.05; // (optional: comment this out)

        // Up-down float (like it's levitating)
        group.position.y = 0.35 + Math.sin(time * 0.0015) * 0.05;
     }
    },
      crm: {
        scaleFactor: 1.5,
        rotationSpeed: 0.018,
        verticalOffset: 0.4,
        ambientLightIntensity: 0.7,
        directionalLightIntensity: 0.85,
        animation: (group, time) => {
          group.rotation.y += 0.018;
          group.scale.setScalar(1.8 + Math.cos(time * 0.001) * 0.1);
          group.position.y = 0.3;
        }
      },
      collaborations: {
        scaleFactor: 2.9,
        rotationSpeed: 0.02,
        verticalOffset: -0.2,
        ambientLightIntensity: 0.75,
        directionalLightIntensity: 0.9,
        animation: (group, time) => {
          group.rotation.y += 0.02;
          group.rotation.z = Math.cos(time * 0.001) * 0.1;
          group.position.y = 0.4;
        }
      },
      reputation: {
        scaleFactor: 2.2,
        rotationSpeed: 0.015,
        verticalOffset: 1.2,
        ambientLightIntensity: 0.7,
        directionalLightIntensity: 0.85,
        animation: (group, time) => {
          group.rotation.y += 0.015;
          group.position.y = Math.sin(time * 0.001) * 0.15 + 0.3;
        }
      },
      analytics: {
        scaleFactor: 2,
        rotationSpeed: 0.015,
        verticalOffset: 0,
        ambientLightIntensity: 0.7,
        directionalLightIntensity: 0.85,
        animation: (group, time) => {
          group.rotation.y += 0.015;
          group.scale.setScalar(1.8 + Math.sin(time * 0.001) * 0.1);
          group.position.y = 0.3;
        }
      },
      ecommerce: {
        scaleFactor: 2.5,
        rotationSpeed: 0.02,
        verticalOffset: -0.9,
        ambientLightIntensity: 0.75,
        directionalLightIntensity: 0.9,
        animation: (group, time) => {
          // group.rotation.y += 0.02;
          group.rotation.x = Math.sin(time * 0.004) * 0.05;
          // group.position.y = 0.4;
        }
      }
    };

    // Initialize 3D Icons
    function init3DIcons() {
      const canvases = document.querySelectorAll('.service-icon-canvas');
      const scenes = [];
      const renderers = [];
      const groups = [];
      const cameras = [];

      const loader = new THREE.GLTFLoader();
      const dracoLoader = new THREE.DRACOLoader();
      dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/libs/draco/');
      loader.setDRACOLoader(dracoLoader);

      canvases.forEach((canvas, index) => {
        canvas.width = 100 * window.devicePixelRatio;
        canvas.height = 100 * window.devicePixelRatio;
        const glbPath = canvas.getAttribute('data-glb').replace(/\\/g, '/');
        const modelConfigName = canvas.getAttribute('data-model-config');
        const config = modelConfigs[modelConfigName] || modelConfigs.website;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
        camera.position.set(0, 0, 5);

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(canvas.width, canvas.height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputEncoding = THREE.sRGBEncoding;

        const ambientLight = new THREE.AmbientLight(0xffffff, config.ambientLightIntensity);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, config.directionalLightIntensity);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);

        scenes.push(scene);
        renderers.push(renderer);
        cameras.push(camera);
        groups.push(null);

        loader.load(
          glbPath,
          (gltf) => {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = config.scaleFactor / maxDim;
            model.scale.set(scale, scale, scale);
            const group = new THREE.Group();
            group.add(model);
            scene.add(group);
            model.position.sub(center);
            model.position.y += config.verticalOffset;
            model.traverse((child) => {
              if (child.isMesh && child.material) {
                child.material.colorConvert = THREE.sRGBEncoding;
                child.material.needsUpdate = true;
              }
            });
            groups[index] = group;
            renderer.render(scene, camera);
          },
          undefined,
          (error) => {
            console.error(`Error loading GLB model ${glbPath}:`, error);
            canvas.style.background = 'rgba(255, 255, 255, 0.1)';
          }
        );
      });

      function animateModels() {
        groups.forEach((group, index) => {
          if (group) {
            const config = modelConfigs[canvases[index].getAttribute('data-model-config')] || modelConfigs.website;
            config.animation(group, performance.now());
            renderers[index].render(scenes[index], cameras[index]);
          }
        });
        requestAnimationFrame(animateModels);
      }
      animateModels();

      window.addEventListener('resize', () => {
        canvases.forEach((canvas, index) => {
          const newWidth = 100 * window.devicePixelRatio;
          const newHeight = 100 * window.devicePixelRatio;
          canvas.width = newWidth;
          canvas.height = newHeight;
          cameras[index].aspect = newWidth / newHeight;
          cameras[index].updateProjectionMatrix();
          renderers[index].setSize(newWidth, newHeight);
        });
      });
    }

    // Initialize Everything
    init3DIcons();
    animate();
    animateScrambleText();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        swiper.update();
      }, 100);
    });

    document.querySelectorAll('.effect-btn').forEach(button => {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        const rect = this.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        setTimeout(() => ripple.remove(), 500);
      });
    });

    // Basic Email Submit Handler
    document.querySelector('.email-submit').addEventListener('click', (e) => {
      e.preventDefault();
      const emailInput = document.querySelector('.email-input').value;
      if (emailInput) {
        alert('Thank you for subscribing!');
        document.querySelector('.email-input').value = '';
      } else {
        alert('Please enter a valid email address.');
      }
    });