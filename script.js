
  // Sistema de Mensagens
  let messageArray = [
    "Bom. Parece que você realmente chegou até aqui.",
    "Primeiramente, insira seu nome: ",
    "Brincadeira, eu sei seu nome, Roberta.",
    "Está muito escuro aqui, não acha?",
    "Vamos consertar isso.",
  ];

  let postStarMessages = [
    "Bem melhor agora.",
    "Mova o mouse ao redor da tela."
  ]

  let textPosition = 0;
  let speed = 90;
  let index = 0;
  let isTyping = false;
  let waitingForInput = false;

  function typewriter() {
    isTyping = true;
    let messageElement = document.querySelector("#message");
    
    messageElement.style.opacity = "1";
    messageElement.innerHTML =
      messageArray[index].substring(0, textPosition) + "<span>\u25ae</span>";

    if (textPosition++ < messageArray[index].length) {
      setTimeout(typewriter, speed);
    } else {
      isTyping = false;

      if (index === 1) {
        waitingForInput = true;
        const handleKeyPress = () => {
          if (waitingForInput) {
            waitingForInput = false;
            document.removeEventListener('keydown', handleKeyPress);
            textPosition = messageArray[index].length;
            untypewriter();
          }
        };
        document.addEventListener('keydown', handleKeyPress);
      } else {
        setTimeout(() => {
          textPosition = messageArray[index].length;
          untypewriter();
        }, 1000);
      }
    }
  }

  function untypewriter() {
    let messageElement = document.querySelector("#message");
    
    if (textPosition > 0) {
      textPosition--;
      messageElement.innerHTML =
        messageArray[index].substring(0, textPosition) + "<span>\u25ae</span>";
      setTimeout(untypewriter, 40);
    } else {
      index++;
      if (index < messageArray.length) {
        textPosition = 0;
        if (index === 2) {
          fadeInEffect();
        } else {
          typewriter();
        }
      } else {
        iniciarAnimacaoEstrelas();
      }
    }
  }

  function fadeInEffect() {
    let messageElement = document.querySelector("#message");
    messageElement.style.opacity = "0";
    messageElement.innerHTML = messageArray[index];

    setTimeout(() => {
      messageElement.classList.add("fade-in");
    }, 10);

    setTimeout(fadeOutEffect, 2500);
  }

  function fadeOutEffect() {
    let messageElement = document.querySelector("#message");
    messageElement.classList.remove("fade-in");
    messageElement.classList.add("fade-out");

    setTimeout(() => {
      messageElement.classList.remove("fade-out");
      index++;
      if (index < messageArray.length) {
        textPosition = 0;
        typewriter();
      }
    }, 1500);
  }

  // Sistema de Estrelas (código original)
  const STAR_COLOR = '#fff';
  const STAR_SIZE = 3;
  const STAR_MIN_SCALE = 0.2;
  const OVERFLOW_THRESHOLD = 50;
  const STAR_COUNT = ( window.innerWidth + window.innerHeight ) / 8;

  const canvas = document.querySelector( 'canvas' );
  const context = canvas.getContext( '2d' );

  let scale = 1;
  let width, height;
  let stars = [];
  let pointerX, pointerY;
  let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };
  let touchInput = false;

  function iniciarAnimacaoEstrelas() {
    document.getElementById('gradient-bg').style.opacity = '1';
    canvas.classList.add('show-stars')
    generate();
    resize();
    step();
    
    // Event listeners para interação
    window.onresize = resize;
    canvas.onmousemove = onMouseMove;
    canvas.ontouchmove = onTouchMove;
    canvas.ontouchend = onMouseLeave;
    document.onmouseleave = onMouseLeave;

    setTimeout(() => {
      index = 0;
      textPosition = 0;
      messageArray = postStarMessages;

      let messageElement = document.querySelector("#message");
      messageElement.style.opacity = "1";
      messageElement.classList.remove('fade-out', 'fade-in');

      typewriter();
    }, 3000);
  }

  function generate() {
    for( let i = 0; i < STAR_COUNT; i++ ) {
      stars.push({
        x: 0,
        y: 0,
        z: STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE )
      });
    }
  }

  function placeStar( star ) {
    star.x = Math.random() * width;
    star.y = Math.random() * height;
  }

  function recycleStar( star ) {
    let direction = 'z';
    let vx = Math.abs( velocity.x ), vy = Math.abs( velocity.y );

    if( vx > 1 || vy > 1 ) {
      let axis = (vx > vy) ? (Math.random() < vx / (vx + vy) ? 'h' : 'v') 
                          : (Math.random() < vy / (vx + vy) ? 'v' : 'h');

      if( axis === 'h' ) direction = velocity.x > 0 ? 'l' : 'r';
      else direction = velocity.y > 0 ? 't' : 'b';
    }

    star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

    switch(direction) {
      case 'z': star.z = 0.1; star.x = Math.random() * width; star.y = Math.random() * height; break;
      case 'l': star.x = -OVERFLOW_THRESHOLD; star.y = height * Math.random(); break;
      case 'r': star.x = width + OVERFLOW_THRESHOLD; star.y = height * Math.random(); break;
      case 't': star.x = width * Math.random(); star.y = -OVERFLOW_THRESHOLD; break;
      case 'b': star.x = width * Math.random(); star.y = height + OVERFLOW_THRESHOLD; break;
    }
  }

  function resize() {
    scale = window.devicePixelRatio || 1;
    width = window.innerWidth * scale;
    height = window.innerHeight * scale;
    canvas.width = width;
    canvas.height = height;
    stars.forEach( placeStar );
  }

  function step() {
    context.clearRect( 0, 0, width, height );
    update();
    render();
    requestAnimationFrame( step );
  }

  function update() {
    velocity.tx *= 0.96;
    velocity.ty *= 0.96;
    velocity.x += ( velocity.tx - velocity.x ) * 0.8;
    velocity.y += ( velocity.ty - velocity.y ) * 0.8;

    stars.forEach( star => {
      star.x += velocity.x * star.z;
      star.y += velocity.y * star.z;
      star.x += ( star.x - width/2 ) * velocity.z * star.z;
      star.y += ( star.y - height/2 ) * velocity.z * star.z;
      star.z += velocity.z;

      if( star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || 
          star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD ) {
        recycleStar( star );
      }
    });
  }

  function render() {
    stars.forEach( star => {
      context.beginPath();
      context.lineCap = 'round';
      context.lineWidth = STAR_SIZE * star.z * scale;
      context.globalAlpha = 0.5 + 0.5*Math.random();
      context.strokeStyle = STAR_COLOR;

      let tailX = velocity.x * 2 || 0.5;
      let tailY = velocity.y * 2 || 0.5;

      context.moveTo( star.x, star.y );
      context.lineTo( star.x + tailX, star.y + tailY );
      context.stroke();
    });
  }

  function movePointer( x, y ) {
    if( pointerX !== undefined && pointerY !== undefined ) {
      let ox = x - pointerX, oy = y - pointerY;
      velocity.tx += ( ox / 8 * scale ) * ( touchInput ? 1 : -1 );
      velocity.ty += ( oy / 8 * scale ) * ( touchInput ? 1 : -1 );
    }
    pointerX = x;
    pointerY = y;
  }

  function onMouseMove( event ) {
    touchInput = false;
    movePointer( event.clientX, event.clientY );
  }

  function onTouchMove( event ) {
    touchInput = true;
    movePointer( event.touches[0].clientX, event.touches[0].clientY );
    event.preventDefault();
  }

  function onMouseLeave() {
    pointerX = pointerY = null;
  }

  window.addEventListener('load', () => {
    typewriter();
    resize();
  });