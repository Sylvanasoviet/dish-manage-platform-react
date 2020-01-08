let animationId = 0;
export function bannerActive(flag, object, borderWidth, borderHeight) {
  window.cancelAnimationFrame(animationId)
  const canvasEle = document.getElementById('login-window')
  if (flag === 1) {
    canvasEle.style.height = '509px'
  } else {
    canvasEle.style.height = '613px'
  }
  const c = object;
  const context = c.getContext('2d');

  const width = borderWidth; // 画布宽度
  const height = borderHeight; // 画布高度

  const fPoints = [{
    x: (width / 2),
    y: 0,
    r: 1,
  }]; // 初始点坐标

  function drawCircle() {
    if (fPoints[0].x < width && fPoints[0].y === 0) {
      drawXLine()
      fPoints[0].x += 2;
    } else if (fPoints[0].x === width && fPoints[0].y < (width / 2)) {
      drawYLine()
      fPoints[0].y += 1;
    } else if (fPoints[0].y === ((width / 2)) && fPoints[0].x > 0) {
      drawXLine()
      fPoints[0].x -= 2;
    } else if (fPoints[0].x === 0 && fPoints[0].y <= (width / 2)) {
      drawYLine()
      fPoints[0].y -= 1;
    }
  }

  function drawXLine() {
    context.lineWidth = 0; // 线条宽度-空心圆
    context.strokeStyle = 'rgba(2, 179, 253,0.02)'; // 颜色
    context.shadowBlur = 0; // 设置或返回用于阴影的颜色
    context.shadowColor = 'rgba(2, 179, 253,0.5)'; // 设置或返回用于阴影的模糊级别
    context.fillStyle = 'rgba(255,255,255,0.89)'; // 填充颜色-实心圆
    context.fill(); // 画实心圆
    context.beginPath();
    context.ellipse(fPoints[0].x, fPoints[0].y, fPoints[0].r * 15, fPoints[0].r, 0, 0, Math.PI * 2);
    context.closePath();
    context.stroke();
  }

  function drawYLine() {
    context.lineWidth = 0; // 线条宽度-空心圆
    context.strokeStyle = 'rgba(2, 179, 253,0.02)'; // 颜色
    context.shadowBlur = 0; // 设置或返回用于阴影的颜色
    context.shadowColor = 'rgba(2, 179, 253,0.5)'; // 设置或返回用于阴影的模糊级别
    context.fillStyle = 'rgba(255,255,255,0.89)'; // 填充颜色-实心圆
    context.fill(); // 画实心圆
    context.beginPath();
    context.ellipse(fPoints[0].x, fPoints[0].y, fPoints[0].r * 2, fPoints[0].r * 15, 0, 0, Math.PI * 2);
    context.closePath();
    context.stroke();
  }


  function render() {
    // 默认值为source-over
    const prev = context.globalCompositeOperation;
    // 只显示canvas上原图像的重叠部分
    context.globalCompositeOperation = 'destination-in';
    // 设置主canvas的绘制透明度
    context.globalAlpha = 0.9;
    // 这一步目的是将canvas上的图像变的透明
    context.fillRect(0, 0, width, height);
    // 在原图像上重叠新图像
    context.globalCompositeOperation = prev;
    // 在主canvas上画新圆
    drawCircle();
    if (document.getElementById('login-window').style.height !== 0) {
      // 在动画没有结束前，递归渲染
      animationId = window.requestAnimationFrame(render);
      // console.log(requestId)
    }
  }
  window.requestAnimationFrame(render);
}

export function canvasSizeChange(flag) {
  const canvasEle = document.getElementById('login-window')
  if (flag === 1) {
    canvasEle.style.height = '509px'
  } else {
    canvasEle.style.height = '612px'
  }
}
