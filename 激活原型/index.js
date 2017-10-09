{
	// fast spatial hash grid (no GC)
	// 全球资源数据库（第hash空间fast G）
	class Grid {

		constructor(maxParticlesPerCell) {

			this.max = maxParticlesPerCell;

			this.neighborsSize = 0;
			this.neighbors = new Uint16Array(this.max);
		}
		index(x, y) {
			return this.max * (y * this.width + x);
		}
		getX(x) {
			return (0.01 + x / this.size) | 0;
		}
		getY(y) {
			return (0.01 + y / this.size) | 0;
		}
		cellSize(x, y) {
			return this.cellsSize[y * this.width + x];
		}
		// 初始
		initSize(width, height, size) {
			this.width = Math.round(width / size) + 0;
			this.height = Math.round(height / size) + 0;
			this.size = size;
			this.cells = new Uint16Array(this.width * this.height * this.max);
			this.cellsSize = new Uint8Array(this.width * this.height);
		}
		// 填满
		fill(particles) {
			for (let p of particles) {
				const xc = this.getX(p.x);
				const yc = this.getY(p.y);
				const index = yc * this.width + xc;
				if (this.cellsSize[index] < this.max) {
					const cellPos = this.cellsSize[index]++;
					this.cells[index * this.max + cellPos] = p.i;
				}
			}
		}
		// 更新
		update(particles) {
			for (let i = 0; i < this.width * this.height; ++i) {
				for (let j = 0; j < this.cellsSize[i]; ++j) {
					const p = particles[this.cells[i * this.max + j]];
					const xc = this.getX(p.x);
					const yc = this.getY(p.y);
					const index = yc * this.width + xc;
					// if new grid position
					if (index !== i && this.cellsSize[index] < this.max) {
						this.cells[index * this.max + this.cellsSize[index]++] = p.i;
						// replace the old particle with the last one
						this.cells[i * this.max + j] = this.cells[
							i * this.max + --this.cellsSize[i]
						];
					}
				}
			}
		}
	}
	class Particle {
		constructor(i, x, y) {
			this.i = i;
			this.x = x;
			this.y = y;
			this.px = x;
			this.py = y;
			this.vx = 0.0;
			this.vy = 0.0;
			this.q = 0.0;
			this.vlen = 0.0;
		}
		integrate() {
			sun.collide(this);
			container.limit(this);
			const x = this.x;
			const y = this.y;
			this.x += this.x - this.px;
			this.y += this.y - this.py + kGravity;
			this.px = x;
			this.py = y;
		}
		fluid() {
			// ref 格兰特 特质 点 方法
			// Ref Grant Kot Material Point Method http://grantkot.com/
			let pressure = 0;
			let presnear = 0;
			grid.neighborsSize = 0;
			const xc = grid.getX(this.x);
			const yc = grid.getY(this.y);
			// 3 x 3 cells
			for (let x = xc - 1; x < xc + 2; ++x) {
				for (let y = yc - 1; y < yc + 2; ++y) {
					const len = grid.cellSize(x, y);
					if (len) {
						const index = grid.index(x, y);
						for (let k = index; k < index + len; ++k) {
							const id = grid.cells[k];
							if (id !== this.i) {
								const pn = particles[id];
								const vx = pn.x - this.x;
								const vy = pn.y - this.y;
								pn.vlen = vx * vx + vy * vy;
								if (pn.vlen < kRadius * kRadius) {
									// compute density and near-density
									pn.vlen = Math.sqrt(pn.vlen);
									const q = 1 - pn.vlen / kRadius;
									pressure += q * q;
									presnear += q * q * q;
									pn.q = q;
									pn.vx = vx / pn.vlen * q;
									pn.vy = vy / pn.vlen * q;
									//neighbors.push(pn);
									grid.neighbors[grid.neighborsSize++] = pn.i;
								}
							}
						}
					}
				}
			}

			// 二 通过放松
			// 压力       压力         密度
			pressure = (pressure - kDensity) * 1.0;
			presnear *= 0.5;
			for (let i = 0; i < grid.neighborsSize; ++i) {
				const pn = particles[grid.neighbors[i]];
				// 应用位移
				const p = pressure + presnear * pn.q;
				const dx = pn.vx * p * 0.5;
				const dy = pn.vy * p * 0.5;
				pn.x += dx;
				pn.y += dy;
				this.x -= dx;
				this.y -= dy;
				// render
				if (pn.q > 0.5 && pn.vlen < canvas.mx) {
					ctx.moveTo(this.x, this.y);
					ctx.lineTo(pn.x, pn.y);
				}
			}
		}
	}
	class Circle {
		constructor(x, y, r) {
			this.x = x;
			this.y = y;
			this.px = x;
			this.py = y;
			this.dx = 0;
			this.dy = 0;
			this.r = r;
			this.drag = false;
			this.over = false;
		}
		anim() {
			const dx = pointer.x - this.x;
			const dy = pointer.y - this.y;
			if (Math.sqrt(dx * dx + dy * dy) < this.r) {
				if (!this.over) {
					this.over = true;
					canvas.elem.style.cursor = "pointer";
				}
			} else {
				if (this.over && !this.drag) {
					this.over = false;
					canvas.elem.style.cursor = "default";
				}
			}
			if (this.drag) {
				this.x = pointer.ex + this.dx;
				this.y = pointer.ey + this.dy;
			}
			container.limit(this, this.r);
			const x = this.x;
			const y = this.y;
			this.x += this.x - this.px;
			this.y += this.y - this.py + 2 * kGravity;
			this.px = x;
			this.py = y;
			// render
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
			// 球的颜色
			ctx.fillStyle = "#334";
			ctx.fill();
		}
		collide(p) {
			const dx = p.x - this.x;
			const dy = p.y - this.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < this.r * 1.2) {
				const fx = Math.min(dist, dx / dist);
				const fy = Math.min(dist, dy / dist);
				p.x += fx;
				p.y += fy;
				this.x -= 0.01 * fx;
				this.y -= 0.01 * (fy + Math.abs(fy));
			}
		}
	}
	// 波浪方式
	const container = {
		init() {
			this.ai = 0;
			this.borders = [
				new this.Plane(),
				new this.Plane(),
				new this.Plane(),
				new this.Plane()
			];
		},
		Plane: class {
			constructor() {
				this.x = 0;
				this.y = 0;
				this.d = 0;
			}
			distanceToPlane(p) {
				return (
					(p.x - canvas.width * 0.5) * this.x +
					(p.y - canvas.height * 0.5) * this.y +
					this.d
				);
			}
			update(x, y, d) {
				this.x = x;
				this.y = y;
				this.d = d;
			}
		},
		rotate() {

			const w = canvas.width;
			const h = canvas.height;
			// 控制容器大小
			// const s = 0.5;
			const s = 0.25;
			// 2D旋转设置           速度                           角度
			// const angle = Math.sin((this.ai += 0.1)) * Math.min(4.0, h / w);
			// const angle = Math.sin((this.ai += 0.01)) * Math.min(0, h / w);
			const angle = Math.sin((this.ai += 0.01)) * Math.min(4.0, h / w);
			const cos = Math.cos(angle);
			const sin = Math.sin(angle);
			this.borders[0].update(-sin, cos, -h * s);
			this.borders[1].update(cos, sin, -w * s);
			this.borders[2].update(-cos, -sin, -w * s);
			this.borders[3].update(sin, -cos, -h * s);
			ctx.save();
			// 背景颜色
			ctx.fillStyle = "#fff";
			// ctx.fillStyle = "pink";
			// 平移
			// ctx.translate(w * 1, h * 0.5);
			// ctx.translate(w * 0.5, h * 1);
			ctx.translate(w * 0.5, h * 0.5);
			// 定义2D旋转，在参数中规定角度
			ctx.rotate(angle);
			// 填充矩形
			// ctx.fillRect(-w * s, -h * s, w * s * 0.2, h * s * 2);
			// ctx.fillRect(-w * s, -h * s, w * s * 2, h * s * 4);
			ctx.fillRect(-w * s, -h * s, w * s * 2, h * s * 2);
			ctx.restore();
		},
		limit(p, radius = 0) {
			for (let b of this.borders) {
				let d = b.distanceToPlane(p) + radius + 0;
				if (d > 0) {
					// 界限 有点儿像重力失衡但是有有界限掉不下去
					// p.x += b.x * -d + (Math.random() * 0.1 - 1);
					// p.y += b.y * -d + (Math.random() * 0.1 - 1);
					p.x += b.x * -d + (Math.random() * 0.1 - 0.01);
					p.y += b.y * -d + (Math.random() * 0.1 - 0.01);
				}
			}
		}
	};
	// 设置画布
	const canvas = {
		init() {
			this.elem = document.getElementById("c");
			const ctx = this.elem.getContext("2d", { alpha: false });
			this.resize();
			window.addEventListener("resize", () => canvas.resize(), false);
			return ctx;
		},
		resize() {
			this.width = this.elem.width = this.elem.offsetWidth;
			this.height = this.elem.height = this.elem.offsetHeight;
			this.mx = Math.sqrt(this.width * this.height / 2000);
			kRadius = Math.round(0.04 * Math.sqrt(this.width * this.height));
			grid.initSize(this.width, this.height, kRadius);
			grid.fill(particles);
			// sun.r 我以为hi太阳的半径那 谁知道几乎看不出所以然
			if (sun) sun.r = 1.5 * kRadius;
		}
	};
	// 设置指南
	const pointer = {
		init(canvas) {
			this.x = this.ex = 0;
			this.y = this.ey = 2000;
			// this.y = this.ey = 2; 
			window.addEventListener("mousemove", e => this.move(e, false), false);
			canvas.elem.addEventListener("touchmove", e => this.move(e, true), false);
			window.addEventListener("mousedown", e => this.down(e, false), false);
			window.addEventListener("touchstart", e => this.down(e, true), false);
			window.addEventListener("mouseup", e => this.up(e, false), false);
			window.addEventListener("touchend", e => this.up(e, true), false);
		},
		move(e, touch) {
			if (touch) {
				e.preventDefault();
				this.x = e.targetTouches[0].clientX;
				this.y = e.targetTouches[0].clientY;
			} else {
				this.x = e.clientX;
				this.y = e.clientY;
			}
		},
		down(e, touch) {
			this.move(e, touch);
			if (touch) sun.anim();
			if (sun.over) {
				sun.drag = true;
				if (touch) {
					sun.dx = 0;
					sun.dy = 0;
					this.ex = this.x;
					this.ey = this.y;
				} else {
					sun.dx = sun.x - this.ex;
					sun.dy = sun.y - this.ey;
					canvas.elem.style.cursor = "move";
				}
			}
		},
		up(e, touch) {
			if (!touch) canvas.elem.style.cursor = "default";
			sun.drag = false;
			sun.over = false;
		},
		ease(n) {
			this.ex += (this.x - this.ex) * n;
			this.ey += (this.y - this.ey) * n;
		}
	};
	// 笔设置
	function initParticles(num) {
		// 
		// 水的容量
		// let x = canvas.width *0.1;
		// let y = canvas.height * 0.1;
		let x = canvas.width *0.5;
		let y = canvas.height * 0.5;
		for (let i = 0; i < num; ++i) {
			particles.push(new Particle(i, x, y));
			x += kRadius / 2;
			if (x > canvas.width * 0.75) {
				x = canvas.width * 0.25;
				// 同上
				// if (x > canvas.width * 1) {
				// x = canvas.width * 0.005;
				y += kRadius / 2;
			}
		}
		grid.fill(particles);
	}
	let sun;
	let kRadius;
	const particles = [];
	// 网格
	const grid = new Grid(50);
	const ctx = canvas.init();
	pointer.init(canvas);
	container.init();
	// 
    // const kGravity = 0.9;
	const kGravity = 0.01;
	// 密度
	// const kDensity = 10;
	const kDensity = 3;
	// 粒子初始化
	// initParticles(200);
	initParticles(2000);
	sun = new Circle(
		canvas.width * 0.5,
		canvas.height * 0.5 - kRadius,
		//圆的半径
		// 2 * kRadius
		1.5 * kRadius
	);
	// animation loop  loop动画
	const run = () => {
		requestAnimationFrame(run);
		// body 颜色
		// ctx.fillStyle = "#09BB07";
			ctx.fillStyle = "##bebebf";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		pointer.ease(0.25);
		container.rotate();
		for (let p of particles) p.integrate();
		grid.update(particles);
		ctx.beginPath();
		// 细胞颜色
		// ctx.strokeStyle = "red";
		ctx.strokeStyle = "#556";
		for (let p of particles) p.fluid();
		ctx.stroke();
		sun.anim();
	};
	run();
}