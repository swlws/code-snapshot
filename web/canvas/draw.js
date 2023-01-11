const Color = {
  BLACK: "black",
  BLUE: "#0091fe",
  WHITE: "#fff",
  TRANSPARENT: "transparent",
};

/**
 * 单条直线上，以直线上某个点，距离此点等距的两个点
 *
 * @param {*} x 目标点的X坐标
 * @param {*} y 目标点的Y坐标
 * @param {*} k 直线方程的斜率
 * @param {*} l 距离目标点的距离
 * @returns 两个等距点的坐标
 */
function equidistance_points(x, y, k, l) {
  if (k === 0) {
    return [x - l, y, x + l, y];
  } else if (Infinity + 1 === Math.abs(k)) {
    return [x, y - l, x, y + l];
  }

  const t = Math.sqrt(Math.pow(l, 2) / (1 + Math.pow(k, 2)));

  // 顺从线的方向，目标点左侧的点
  const x1 = x - t;
  const y1 = y - k * (x - x1);

  // 顺从线的方向，目标点右侧的点
  const x2 = x + t;
  const y2 = y + k * (x2 - x);

  return [x1, y1, x2, y2];
}

/**
 * 包裹在直线四周的四个顶点
 *
 * @param {*} x1 起点的X坐标
 * @param {*} y1 起点的Y坐标
 * @param {*} x2 终点的X坐标
 * @param {*} y2 终点的Y坐标
 * @param {*} r 顶点距离直线的距离
 * @return 顺时针返回四个顶点的坐标
 */
function around_line_points(x1, y1, x2, y2, r) {
  const k = (y2 - y1) / (x2 - x1);
  const k2 = -1 / k;

  const [a, b, c, d] = equidistance_points(x1, y1, k2, r);
  const [e, f, h, i] = equidistance_points(x2, y2, k2, r);

  return [e, f, h, i, c, d, a, b];
}

/**
 * 两点之间的距离平方和
 *
 *  @param {*} x1 起点的X坐标
 * @param {*} y1 起点的Y坐标
 * @param {*} x2 终点的X坐标
 * @param {*} y2 终点的Y坐标
 * @returns 返回距离的平方和
 */
function distance(x1, y1, x2, y2) {
  return Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
}

/**
 * 一条直线，以终点为三角形的顶点，计算两外两个顶点的坐标
 *
 * @param {*} x1 起点的X坐标
 * @param {*} y1 起点的Y坐标
 * @param {*} x2 终点的X坐标
 * @param {*} y2 终点的Y坐标
 * @returns 三角形的三个顶点坐标
 */
function triangle_points(x1, y1, x2, y2) {
  // <x1,y1> <x2,y2> 所在直线的斜率
  const k = (y2 - y1) / (x2 - x1);

  const [a, b, c, d] = equidistance_points(x2, y2, k, 10);

  // 找到在<x1,y1> <x2,y2>之间的点
  const dd = distance(x1, y1, x2, y2);
  const da = distance(a, b, x1, y1);
  let mx = a,
    my = b;
  if (da > dd) {
    mx = c;
    my = d;
  }

  // <x1,y1> <x2,y2> 的垂直线的斜率
  const k2 = -1 / k;
  const p = equidistance_points(mx, my, k2, 5);

  p.splice(2, 0, x2, y2);
  return p;
}

/**
 * 按点的顺序划线
 *
 * @param {*} ctx ctx
 * @param {*} arr 存放的点坐标
 * @param {*} close true为回到第一个点；false为不回到第一个点
 */
function draw_points(ctx, arr, close = false) {
  for (let i = 0, len = arr.length; i < len; ) {
    if (i === 0) ctx.moveTo(arr[i], arr[i + 1]);
    else ctx.lineTo(arr[i], arr[i + 1]);
    i = i + 2;
  }

  if (close) ctx.lineTo(arr[0], arr[1]);
}

/**
 * 绘制矩形
 *
 * @param {*} ctx
 * @param {*} cfg
 */
function draw_rect(ctx, cfg, isActive = false) {
  const {
    pos: { x, y },
    width,
    height,
    text,
  } = cfg;

  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = Color.WHITE;
  ctx.fill();
  ctx.closePath();

  if (text) {
    ctx.beginPath();
    ctx.font = "14px serif";
    ctx.textAlign = "center";
    ctx.fillStyle = Color.BLACK;
    ctx.fillText(text, x + width / 2, y + height / 2 + 5, width);
    ctx.closePath();
  }

  // 包裹层
  ctx.beginPath();
  ctx.rect(x - 2, y - 2, width + 4, height + 4);
  // ctx.lineWidth = 1;
  ctx.strokeStyle = isActive ? Color.BLUE : Color.BLACK;
  ctx.stroke();
  ctx.closePath();
}

function draw_line(ctx, cfg, isActive = false) {
  const {
    pos: { x1, y1, x2, y2 },
  } = cfg;

  // 画线
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = 1;
  ctx.strokeStyle = isActive ? Color.BLUE : Color.BLACK;
  ctx.stroke();
  ctx.closePath();

  // 画箭头（三角形）
  ctx.beginPath();
  const arr = triangle_points(x1, y1, x2, y2);
  draw_points(ctx, arr, false);
  ctx.strokeStyle = isActive ? Color.BLUE : Color.BLACK;
  ctx.stroke();
  ctx.closePath();

  // 画包裹层
  ctx.beginPath();
  const arr2 = around_line_points(x1, y1, x2, y2, 15);
  draw_points(ctx, arr2, true);
  ctx.strokeStyle = Color.TRANSPARENT;
  ctx.stroke();
  ctx.closePath();
}

/**
 * 控制图形的绘制与移动
 */
class Draw {
  constructor(el, paths, cb) {
    this.canvas = el;
    this.ctx = this.canvas.getContext("2d");

    this.cb = cb;

    // 待绘制的图形
    this.paths = paths;

    // 控制属性
    this.can_move = false;
    this.active_id = "";
    this.active_path = null;
    this.down_pos = null;

    // 初始化绘制
    this.__draw();
    this.__registerEvent();
  }

  __clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  __draw(p) {
    this.__clearCanvas();

    let who;

    const lines = this.paths.filter((path) => path.type === "line");
    const not_lines = this.paths.filter((path) => path.type !== "line");

    // 先画节点，最后划线
    for (let path of [...not_lines, ...lines]) {
      switch (path.type) {
        case "rect":
          draw_rect(this.ctx, path, this.active_id === path.id);
          break;
        case "line":
          draw_line(this.ctx, path, this.active_id === path.id);
          break;
        default:
          break;
      }

      if (p && this.ctx.isPointInPath(p.x, p.y)) {
        who = path.id;
      }
    }

    return who;
  }

  __getEventPosition(ev) {
    var x, y;
    if (ev.layerX || ev.layerX == 0) {
      x = ev.layerX;
      y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) {
      // Opera
      x = ev.offsetX;
      y = ev.offsetY;
    }
    return { x: x, y: y };
  }

  __mouseDownEvent(e) {
    this.can_move = true;
    this.down_pos = this.__getEventPosition(e);

    const active_id = this.__draw(this.down_pos);
    this.active_id = active_id || "";
    console.info("active_id = ", active_id);

    this.active_path = this.paths.find((path) => path.id === active_id);
    if (this.active_path) {
      this.active_path.pre_pos = { ...this.active_path.pos };

      // 若不是线，则找到所有此图形关联的线
      const lines = this.__findRelationLines(this.active_path);
      for (let line of lines) {
        line.pre_pos = { ...line.pos };
      }
    }
  }

  __findRelationLines(shape) {
    if (shape.type === "line") return [];

    return this.paths.filter((path) => {
      const { type, source, target } = path;
      if (type !== "line") return false;

      if ([source, target].includes(shape.id)) return true;
      return false;
    });
  }

  __mouseMoveEvent(e) {
    if (!this.can_move || !this.active_path) return;

    const t = this.__getEventPosition(e);
    const dx = t.x - this.down_pos.x;
    const dy = t.y - this.down_pos.y;

    const { type } = this.active_path;

    switch (type) {
      case "rect":
        {
          this.active_path.pos.x = this.active_path.pre_pos.x + dx;
          this.active_path.pos.y = this.active_path.pre_pos.y + dy;

          const lines = this.__findRelationLines(this.active_path);
          for (let line of lines) {
            const {
              source,
              target,
              pre_pos: { x1 = 0, y1 = 0, x2 = 0, y2 = 0 },
            } = line;
            if (source === this.active_path.id) {
              line.pos.x1 = x1 + dx;
              line.pos.y1 = y1 + dy;
            } else if (target === this.active_path.id) {
              line.pos.x2 = x2 + dx;
              line.pos.y2 = y2 + dy;
            }
          }
        }
        break;
      case "line":
        {
          const { x, y } = this.down_pos;

          const cfg = this.active_path;
          const { x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = cfg.pre_pos || {};

          const dL = Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2);
          const dR = Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2);
          if (dL < 255) {
            this.active_path.pos.x1 = x1 + dx;
            this.active_path.pos.y1 = y1 + dy;
          } else if (dR < 255) {
            this.active_path.pos.x2 = x2 + dx;
            this.active_path.pos.y2 = y2 + dy;
          } else {
            this.active_path.pos.x1 = x1 + dx;
            this.active_path.pos.y1 = y1 + dy;
            this.active_path.pos.x2 = x2 + dx;
            this.active_path.pos.y2 = y2 + dy;
          }
        }
        break;
      default:
        break;
    }

    this.__draw();
  }

  __mouseUpEvent(e) {
    this.can_move = false;

    this.__calculateRelation();

    const cb = this.cb;
    if (cb) {
      cb(this);
    }

    // 发生鼠标事件后，会有一些状态的变换，比如：
    //    活动的节点，边框变为蓝色
    // 所以，鼠标谈起时，额外多绘制一次，绘制最终状态
    this.__draw();
  }

  __registerEvent() {
    this.canvas.addEventListener("mousedown", (e) => this.__mouseDownEvent(e));
    this.canvas.addEventListener("mousemove", (e) => this.__mouseMoveEvent(e));
    this.canvas.addEventListener("mouseup", (e) => this.__mouseUpEvent(e));
  }

  __calculateRelation() {
    const rects = this.paths.filter((path) => path.type === "rect");
    const lines = this.paths.filter((path) => path.type === "line");

    if (rects.length === 0 || lines.length === 0) return;

    // 计算每条线，与RECT的相交状态
    for (let line of lines) {
      const {
        pos: { x1, y1, x2, y2 },
      } = line;

      // source_id, target_id
      let sid, tid;
      for (let rect of rects) {
        const {
          id,
          pos: { x, y },
          width,
          height,
        } = rect;

        // 线的左边点，与RECT相交
        const match_l =
          x1 >= x && x1 <= x + width && y1 >= y && y1 <= y + height;
        // 线的右边点，与RECT相交
        const match_r =
          x2 >= x && x2 <= x + width && y2 >= y && y2 <= y + height;

        if (match_l) sid = id;
        if (match_r) tid = id;
      }

      line.source = sid;
      line.target = tid;
    }

    console.log(this.paths);
  }
}
